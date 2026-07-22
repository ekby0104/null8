// POINT CLOUD — luma 기반 점 크기/알파, sin 파동 변위, 시안-블루 팔레트 (SPEC §5.4)
// M3: gl.POINTS로 이식 — 그리드 200×N (16:9 기준 22,400점, M1 대비 ~10배).
// 잔상 트레일: preserveDrawingBuffer 위에 반투명 검정 풀스크린 오버드로우.
// WebGL2 미지원 시 128 샘플 CPU 폴백. 활성 탭 재탭 = 파동 강도 프리셋 순환.

import type { Effect, FrameData } from './index.ts';
import { luma } from './index.ts';
import { compileProgram, drawFullscreen } from '../gl/pipeline.ts';
import vertSrc from './pointcloud.vert?raw';
import fragSrc from './pointcloud.frag?raw';

const GRID_W = 200; // 가로 점 개수 — 세로는 비디오 종횡비 따라 결정

/** 추가 파라미터 (SPEC §5.4) — M6 손 추적 등 외부에서 조절 가능 */
export const pointcloudParams = {
  wave: 1.0, // 파동 강도
  trail: 0.14, // 트레일 길이 (프레임당 페이드 알파 — 작을수록 잔상이 길다)
};

const WAVE_PRESETS = [1.0, 2.0, 3.5, 0.4];

// ── WebGL 경로 ──────────────────────────────
const TRAIL_FRAG = `#version 300 es
precision highp float;
uniform float u_alpha;
out vec4 outColor;
void main() { outColor = vec4(0.0, 0.0, 0.0, u_alpha); }
`;

let gl: WebGL2RenderingContext | null = null;
let pointProg: WebGLProgram | null = null;
let trailProg: WebGLProgram | null = null;
let uVideo: WebGLUniformLocation | null = null;
let uGrid: WebGLUniformLocation | null = null;
let uRes: WebGLUniformLocation | null = null;
let uTime: WebGLUniformLocation | null = null;
let uWave: WebGLUniformLocation | null = null;
let uMirror: WebGLUniformLocation | null = null;
let uTrailAlpha: WebGLUniformLocation | null = null;
let needsClear = true;

function renderGl(f: FrameData): void {
  const g = gl!;
  const w = g.drawingBufferWidth;
  const h = g.drawingBufferHeight;
  g.viewport(0, 0, w, h);

  if (needsClear) {
    g.clearColor(0, 0, 0, 1);
    g.clear(g.COLOR_BUFFER_BIT);
    needsClear = false;
  }

  g.enable(g.BLEND);
  g.blendFunc(g.SRC_ALPHA, g.ONE_MINUS_SRC_ALPHA);

  // 1) 트레일 페이드: 반투명 검정 오버드로우
  g.useProgram(trailProg);
  g.uniform1f(uTrailAlpha, pointcloudParams.trail);
  drawFullscreen(g);

  // 2) 포인트 드로우 — 정점 셰이더에서 비디오 텍스처 샘플링
  const gridH = Math.max(2, Math.round((GRID_W * f.video.videoHeight) / f.video.videoWidth));
  g.useProgram(pointProg);
  g.activeTexture(g.TEXTURE0);
  g.bindTexture(g.TEXTURE_2D, f.videoTex);
  g.uniform1i(uVideo, 0);
  g.uniform2f(uGrid, GRID_W, gridH);
  g.uniform2f(uRes, w, h);
  g.uniform1f(uTime, f.time);
  g.uniform1f(uWave, pointcloudParams.wave);
  g.uniform1i(uMirror, f.mirror ? 1 : 0);
  g.drawArrays(g.POINTS, 0, GRID_W * gridH);

  g.disable(g.BLEND);
}

// ── CPU 폴백 (M1 구현 유지) ──────────────────
const STEP = 2;
let ctx: CanvasRenderingContext2D;
let first = true;

function renderCpu(f: FrameData): void {
  const { width: cw, height: ch } = ctx.canvas;
  const { width: w, height: h, data } = f.sample;

  if (first) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cw, ch);
    first = false;
  } else {
    ctx.fillStyle = `rgba(0,0,0,${pointcloudParams.trail})`;
    ctx.fillRect(0, 0, cw, ch);
  }

  const scaleX = cw / w;
  const scaleY = ch / h;
  const t = f.time;
  const wave = pointcloudParams.wave;

  for (let y = 0; y < h; y += STEP) {
    for (let x = 0; x < w; x += STEP) {
      const i = (y * w + x) * 4;
      const l = luma(data[i], data[i + 1], data[i + 2]) / 255;
      if (l < 0.04) continue;

      const dx = Math.sin(t * 2 + x * 0.35 + y * 0.18) * (1 + l * 5) * scaleX * 0.6 * wave;
      const dy = Math.cos(t * 1.6 + y * 0.28 + x * 0.11) * (1 + l * 3) * scaleY * 0.4 * wave;

      const r = Math.round(24 + l * 60);
      const g = Math.round(90 + l * 150);
      const b = Math.round(200 + l * 55);
      const size = (0.6 + l * 2.6) * scaleX * 0.5;

      ctx.fillStyle = `rgba(${r},${g},${b},${0.2 + l * 0.8})`;
      ctx.fillRect(x * scaleX + dx, y * scaleY + dy, size, size);
    }
  }
}

export const pointcloud: Effect = {
  id: 'pointcloud',
  name: 'POINT CLOUD',
  usesGl: true,

  init(glCtx, ctx2d) {
    gl = glCtx;
    ctx = ctx2d;
    first = true;
    needsClear = true;
    if (gl && !pointProg) {
      pointProg = compileProgram(gl, fragSrc, vertSrc);
      uVideo = gl.getUniformLocation(pointProg, 'u_video');
      uGrid = gl.getUniformLocation(pointProg, 'u_grid');
      uRes = gl.getUniformLocation(pointProg, 'u_res');
      uTime = gl.getUniformLocation(pointProg, 'u_time');
      uWave = gl.getUniformLocation(pointProg, 'u_wave');
      uMirror = gl.getUniformLocation(pointProg, 'u_mirror');
      trailProg = compileProgram(gl, TRAIL_FRAG);
      uTrailAlpha = gl.getUniformLocation(trailProg, 'u_alpha');
    }
  },

  render(f: FrameData) {
    if (gl && f.videoTex) renderGl(f);
    else renderCpu(f);
  },

  dispose() {
    first = true;
    needsClear = true;
  },

  // 활성 탭 재탭 = 파동 강도 프리셋 순환
  onReselect() {
    const i = WAVE_PRESETS.indexOf(pointcloudParams.wave);
    pointcloudParams.wave = WAVE_PRESETS[(i + 1) % WAVE_PRESETS.length];
  },
};
