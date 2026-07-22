// RISO — 초록/노랑/흰 포스터라이즈 + 그레인 + 엣지 프린지 (레퍼런스 IMG_6369)
// WebGL2 미지원 시 128 샘플 CPU 폴백.

import type { Effect, FrameData } from './index.ts';
import { luma } from './index.ts';
import { compileProgram, drawFullscreen } from '../gl/pipeline.ts';
import fragSrc from './riso.frag?raw';

// ── WebGL 경로 ──────────────────────────────
let gl: WebGL2RenderingContext | null = null;
let program: WebGLProgram | null = null;
let uVideo: WebGLUniformLocation | null = null;
let uTime: WebGLUniformLocation | null = null;
let uMirror: WebGLUniformLocation | null = null;

function renderGl(f: FrameData): void {
  const g = gl!;
  g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight);
  g.useProgram(program);
  g.activeTexture(g.TEXTURE0);
  g.bindTexture(g.TEXTURE_2D, f.videoTex);
  g.uniform1i(uVideo, 0);
  g.uniform1f(uTime, f.time);
  g.uniform1i(uMirror, f.mirror ? 1 : 0);
  drawFullscreen(g);
}

// ── CPU 폴백 ────────────────────────────────
// [DEEP, GREEN, YELLOW, WHITE] — riso.frag 팔레트와 동일
const PALETTE: [number, number, number][] = [
  [10, 107, 31],
  [51, 168, 61],
  [237, 230, 133],
  [250, 250, 240],
];

let ctx: CanvasRenderingContext2D;
let off: HTMLCanvasElement | null = null;
let offCtx: CanvasRenderingContext2D;
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
    out = offCtx.createImageData(w, h);
  }

  const od = out!.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const grain = (Math.random() - 0.5) * 0.16;
      const l = luma(data[i], data[i + 1], data[i + 2]) / 255 + grain;
      const c = PALETTE[l < 0.3 ? 0 : l < 0.52 ? 1 : l < 0.72 ? 2 : 3];
      od[i] = c[0];
      od[i + 1] = c[1];
      od[i + 2] = c[2];
      od[i + 3] = 255;
    }
  }

  offCtx.putImageData(out!, 0, 0);
  const { width: cw, height: ch } = ctx.canvas;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(off, 0, 0, cw, ch);
  ctx.imageSmoothingEnabled = true;
}

export const riso: Effect = {
  id: 'riso',
  name: 'RISO',
  usesGl: true,

  init(glCtx, ctx2d) {
    gl = glCtx;
    ctx = ctx2d;
    if (gl && !program) {
      program = compileProgram(gl, fragSrc);
      uVideo = gl.getUniformLocation(program, 'u_video');
      uTime = gl.getUniformLocation(program, 'u_time');
      uMirror = gl.getUniformLocation(program, 'u_mirror');
    }
  },

  render(f: FrameData) {
    if (gl && f.videoTex) renderGl(f);
    else renderCpu(f);
  },

  dispose() {
    out = null;
  },
};
