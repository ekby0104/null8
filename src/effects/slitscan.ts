// SLIT-SCAN — 프레임 히스토리 버퍼에서 행마다 다른 과거 프레임 샘플링 (SPEC §5.8)
// GL: 480×270×60 TEXTURE_2D_ARRAY 링 버퍼. 매 프레임 videoTex를 FBO로 현재
// 레이어에 다운스케일 복사 (CPU 재업로드 없음). 메모리 ~31MB.
// WebGL2 미지원 시 128 샘플 히스토리 CPU 폴백.

import type { Effect, FrameData } from './index.ts';
import { compileProgram, drawFullscreen } from '../gl/pipeline.ts';
import fragSrc from './slitscan.frag?raw';

const LAYERS = 60; // 최근 60프레임
const HIST_W = 480;
const HIST_H = 270;

const COPY_FRAG = `#version 300 es
precision highp float;
uniform sampler2D u_video;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = vec4(texture(u_video, v_uv).rgb, 1.0); }
`;

// ── WebGL 경로 ──────────────────────────────
let gl: WebGL2RenderingContext | null = null;
let copyProg: WebGLProgram | null = null;
let scanProg: WebGLProgram | null = null;
let uCopyVideo: WebGLUniformLocation | null = null;
let uHistory: WebGLUniformLocation | null = null;
let uHead: WebGLUniformLocation | null = null;
let uLayers: WebGLUniformLocation | null = null;
let uFilled: WebGLUniformLocation | null = null;
let uBeat: WebGLUniformLocation | null = null;
let uMirror: WebGLUniformLocation | null = null;

let historyTex: WebGLTexture | null = null;
let fbo: WebGLFramebuffer | null = null;
let head = -1;
let filled = 0;

function allocHistory(g: WebGL2RenderingContext): void {
  historyTex = g.createTexture();
  g.bindTexture(g.TEXTURE_2D_ARRAY, historyTex);
  g.texStorage3D(g.TEXTURE_2D_ARRAY, 1, g.RGBA8, HIST_W, HIST_H, LAYERS);
  g.texParameteri(g.TEXTURE_2D_ARRAY, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
  g.texParameteri(g.TEXTURE_2D_ARRAY, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
  g.texParameteri(g.TEXTURE_2D_ARRAY, g.TEXTURE_MIN_FILTER, g.LINEAR);
  g.texParameteri(g.TEXTURE_2D_ARRAY, g.TEXTURE_MAG_FILTER, g.LINEAR);
  fbo = g.createFramebuffer();
  head = -1;
  filled = 0;
}

function freeHistory(): void {
  if (!gl) return;
  if (historyTex) gl.deleteTexture(historyTex);
  if (fbo) gl.deleteFramebuffer(fbo);
  historyTex = null;
  fbo = null;
  head = -1;
  filled = 0;
}

function renderGl(f: FrameData): void {
  const g = gl!;

  // 1) 현재 프레임을 링 버퍼의 다음 레이어로 다운스케일 복사
  head = (head + 1) % LAYERS;
  filled = Math.min(filled + 1, LAYERS);
  g.bindFramebuffer(g.FRAMEBUFFER, fbo);
  g.framebufferTextureLayer(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, historyTex, 0, head);
  g.viewport(0, 0, HIST_W, HIST_H);
  g.useProgram(copyProg);
  g.activeTexture(g.TEXTURE0);
  g.bindTexture(g.TEXTURE_2D, f.videoTex);
  g.uniform1i(uCopyVideo, 0);
  drawFullscreen(g);
  g.bindFramebuffer(g.FRAMEBUFFER, null);

  // 2) 히스토리에서 행별 지연 샘플링으로 화면 출력
  g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight);
  g.useProgram(scanProg);
  g.activeTexture(g.TEXTURE0);
  g.bindTexture(g.TEXTURE_2D_ARRAY, historyTex);
  g.uniform1i(uHistory, 0);
  g.uniform1f(uHead, head);
  g.uniform1f(uLayers, LAYERS);
  g.uniform1f(uFilled, filled);
  g.uniform1f(uBeat, f.beat);
  g.uniform1i(uMirror, f.mirror ? 1 : 0);
  drawFullscreen(g);
}

// ── CPU 폴백 — 128 샘플 히스토리 ─────────────
let ctx: CanvasRenderingContext2D;
let off: HTMLCanvasElement | null = null;
let offCtx: CanvasRenderingContext2D;
let out: ImageData | null = null;
let cpuHistory: Uint8ClampedArray[] = [];

function renderCpu(f: FrameData): void {
  const { width: w, height: h, data } = f.sample;
  if (!off) {
    off = document.createElement('canvas');
    offCtx = off.getContext('2d')!;
  }
  if (off.width !== w || off.height !== h) {
    off.width = w;
    off.height = h;
    out = offCtx.createImageData(w, h);
    cpuHistory = [];
  }

  cpuHistory.push(new Uint8ClampedArray(data));
  if (cpuHistory.length > LAYERS) cpuHistory.shift();

  const maxDelay = cpuHistory.length - 1;
  const od = out!.data;
  for (let y = 0; y < h; y++) {
    let d = (y / Math.max(1, h - 1)) * maxDelay;
    d += Math.sin((1 - y / h) * 36 + f.beat * Math.PI) * 3;
    const di = Math.round(Math.min(maxDelay, Math.max(0, d)));
    const frame = cpuHistory[maxDelay - di];
    const row = y * w * 4;
    od.set(frame.subarray(row, row + w * 4), row);
  }

  offCtx.putImageData(out!, 0, 0);
  const { width: cw, height: ch } = ctx.canvas;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(off, 0, 0, cw, ch);
}

export const slitscan: Effect = {
  id: 'slitscan',
  name: 'SLIT-SCAN',
  usesGl: true,

  init(glCtx, ctx2d) {
    gl = glCtx;
    ctx = ctx2d;
    if (gl) {
      if (!copyProg) {
        copyProg = compileProgram(gl, COPY_FRAG);
        uCopyVideo = gl.getUniformLocation(copyProg, 'u_video');
        scanProg = compileProgram(gl, fragSrc);
        uHistory = gl.getUniformLocation(scanProg, 'u_history');
        uHead = gl.getUniformLocation(scanProg, 'u_head');
        uLayers = gl.getUniformLocation(scanProg, 'u_layers');
        uFilled = gl.getUniformLocation(scanProg, 'u_filled');
        uBeat = gl.getUniformLocation(scanProg, 'u_beat');
        uMirror = gl.getUniformLocation(scanProg, 'u_mirror');
      }
      allocHistory(gl);
    }
  },

  render(f: FrameData) {
    if (gl && f.videoTex && historyTex) renderGl(f);
    else renderCpu(f);
  },

  dispose() {
    // 히스토리 텍스처(~31MB)는 이펙트를 떠날 때 해제, 프로그램은 재사용
    freeHistory();
    cpuHistory = [];
    out = null;
  },
};
