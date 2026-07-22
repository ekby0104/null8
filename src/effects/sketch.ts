// SKETCH — Sobel 엣지 검출 → 반전 → 종이 톤 (SPEC §5.3)
// M2: GLSL 풀해상도 이식 (sketch.frag). WebGL2 미지원 시 128 샘플 CPU 폴백.

import type { Effect, FrameData } from './index.ts';
import { luma } from './index.ts';
import { compileProgram, drawFullscreen } from '../gl/pipeline.ts';
import fragSrc from './sketch.frag?raw';

// ── WebGL 경로 ──────────────────────────────
let gl: WebGL2RenderingContext | null = null;
let program: WebGLProgram | null = null;
let uVideo: WebGLUniformLocation | null = null;
let uTexel: WebGLUniformLocation | null = null;
let uMirror: WebGLUniformLocation | null = null;

function renderGl(f: FrameData): void {
  const g = gl!;
  g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight);
  g.useProgram(program);
  g.activeTexture(g.TEXTURE0);
  g.bindTexture(g.TEXTURE_2D, f.videoTex);
  g.uniform1i(uVideo, 0);
  g.uniform2f(uTexel, 1 / f.video.videoWidth, 1 / f.video.videoHeight);
  g.uniform1i(uMirror, f.mirror ? 1 : 0);
  drawFullscreen(g);
}

// ── CPU 폴백 (M1 구현 유지) ──────────────────
let ctx: CanvasRenderingContext2D;
let off: HTMLCanvasElement | null = null;
let offCtx: CanvasRenderingContext2D;
let lumaBuf: Float32Array = new Float32Array(0);
let out: ImageData | null = null;

function renderCpu(f: FrameData): void {
  const { width: w, height: h, data } = f.sample;

  if (!off) {
    off = document.createElement('canvas');
    offCtx = off.getContext('2d')!;
  }
  if (off.width !== w || off.height !== h) {
    off.width = w;
    off.height = h;
    lumaBuf = new Float32Array(w * h);
    out = offCtx.createImageData(w, h);
  }

  for (let i = 0, p = 0; i < w * h; i++, p += 4) {
    lumaBuf[i] = luma(data[p], data[p + 1], data[p + 2]);
  }

  const od = out!.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let mag = 0;
      if (x > 0 && x < w - 1 && y > 0 && y < h - 1) {
        const tl = lumaBuf[(y - 1) * w + (x - 1)];
        const tc = lumaBuf[(y - 1) * w + x];
        const tr = lumaBuf[(y - 1) * w + (x + 1)];
        const ml = lumaBuf[y * w + (x - 1)];
        const mr = lumaBuf[y * w + (x + 1)];
        const bl = lumaBuf[(y + 1) * w + (x - 1)];
        const bc = lumaBuf[(y + 1) * w + x];
        const br = lumaBuf[(y + 1) * w + (x + 1)];
        const gx = -tl - 2 * ml - bl + tr + 2 * mr + br;
        const gy = -tl - 2 * tc - tr + bl + 2 * bc + br;
        mag = Math.min(255, Math.sqrt(gx * gx + gy * gy));
      }
      const v = 250 - mag * 0.92;
      const p = (y * w + x) * 4;
      od[p] = Math.max(20, v);
      od[p + 1] = Math.max(18, v - 2);
      od[p + 2] = Math.max(14, v - 10);
      od[p + 3] = 255;
    }
  }

  offCtx.putImageData(out!, 0, 0);
  const { width: cw, height: ch } = ctx.canvas;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(off, 0, 0, cw, ch);
}

export const sketch: Effect = {
  id: 'sketch',
  name: 'SKETCH',
  usesGl: true,

  init(glCtx, ctx2d) {
    gl = glCtx;
    ctx = ctx2d;
    if (gl && !program) {
      program = compileProgram(gl, fragSrc);
      uVideo = gl.getUniformLocation(program, 'u_video');
      uTexel = gl.getUniformLocation(program, 'u_texel');
      uMirror = gl.getUniformLocation(program, 'u_mirror');
    }
  },

  render(f: FrameData) {
    if (gl && f.videoTex) renderGl(f);
    else renderCpu(f);
  },

  dispose() {
    lumaBuf = new Float32Array(0);
    out = null;
    // program은 재선택 시 재사용 (컴파일 비용 절약)
  },
};
