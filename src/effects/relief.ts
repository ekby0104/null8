// RELIEF — 흰 종이 양각 릴리프, 엣지 황록 색수차 (레퍼런스 IMG_6360)
// SKETCH를 대체하는 이펙트. WebGL2 미지원 시 128 샘플 CPU 폴백.

import type { Effect, FrameData } from './index.ts';
import { luma } from './index.ts';
import { compileProgram, drawFullscreen } from '../gl/pipeline.ts';
import fragSrc from './relief.frag?raw';

// ── WebGL 경로 ──────────────────────────────
let gl: WebGL2RenderingContext | null = null;
let program: WebGLProgram | null = null;
let uVideo: WebGLUniformLocation | null = null;
let uTexel: WebGLUniformLocation | null = null;
let uTime: WebGLUniformLocation | null = null;
let uMirror: WebGLUniformLocation | null = null;

function renderGl(f: FrameData): void {
  const g = gl!;
  g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight);
  g.useProgram(program);
  g.activeTexture(g.TEXTURE0);
  g.bindTexture(g.TEXTURE_2D, f.videoTex);
  g.uniform1i(uVideo, 0);
  g.uniform2f(uTexel, 1 / f.video.videoWidth, 1 / f.video.videoHeight);
  g.uniform1f(uTime, f.time);
  g.uniform1i(uMirror, f.mirror ? 1 : 0);
  drawFullscreen(g);
}

// ── CPU 폴백 ────────────────────────────────
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
    lumaBuf[i] = luma(data[p], data[p + 1], data[p + 2]) / 255;
  }

  const od = out!.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let g = 0;
      if (x > 0 && x < w - 1 && y > 0 && y < h - 1) {
        g = lumaBuf[(y - 1) * w + (x - 1)] - lumaBuf[(y + 1) * w + (x + 1)];
      }
      const p = (y * w + x) * 4;
      od[p] = Math.min(255, Math.max(0, 248 - g * 2.3 * 255));
      od[p + 1] = Math.min(255, Math.max(0, 247 - g * 1.6 * 255));
      od[p + 2] = Math.min(255, Math.max(0, 242 - g * 2.9 * 255));
      od[p + 3] = 255;
    }
  }

  offCtx.putImageData(out!, 0, 0);
  const { width: cw, height: ch } = ctx.canvas;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(off, 0, 0, cw, ch);
}

export const relief: Effect = {
  id: 'relief',
  name: 'RELIEF',
  usesGl: true,

  init(glCtx, ctx2d) {
    gl = glCtx;
    ctx = ctx2d;
    if (gl && !program) {
      program = compileProgram(gl, fragSrc);
      uVideo = gl.getUniformLocation(program, 'u_video');
      uTexel = gl.getUniformLocation(program, 'u_texel');
      uTime = gl.getUniformLocation(program, 'u_time');
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
  },
};
