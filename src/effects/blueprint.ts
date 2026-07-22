// BLUEPRINT — 4×4 Bayer ordered dithering + 랜덤 노이즈, 듀오톤 (SPEC §5.5)
// M2: GLSL 이식 (blueprint.frag) + 파랑↔흰 반전 토글 (활성 탭 재탭).
// WebGL2 미지원 시 128 샘플 CPU 폴백.

import type { Effect, FrameData } from './index.ts';
import { luma } from './index.ts';
import { compileProgram, drawFullscreen } from '../gl/pipeline.ts';
import fragSrc from './blueprint.frag?raw';

let invert = false;

// ── WebGL 경로 ──────────────────────────────
let gl: WebGL2RenderingContext | null = null;
let program: WebGLProgram | null = null;
let uVideo: WebGLUniformLocation | null = null;
let uRes: WebGLUniformLocation | null = null;
let uCell: WebGLUniformLocation | null = null;
let uTime: WebGLUniformLocation | null = null;
let uMirror: WebGLUniformLocation | null = null;
let uInvert: WebGLUniformLocation | null = null;

function renderGl(f: FrameData): void {
  const g = gl!;
  const w = g.drawingBufferWidth;
  const h = g.drawingBufferHeight;
  g.viewport(0, 0, w, h);
  g.useProgram(program);
  g.activeTexture(g.TEXTURE0);
  g.bindTexture(g.TEXTURE_2D, f.videoTex);
  g.uniform1i(uVideo, 0);
  g.uniform2f(uRes, w, h);
  // 디더 셀 = CSS 1픽셀 (hi-dpi에서도 셀이 뭉개지지 않게)
  g.uniform1f(uCell, Math.max(1, Math.min(2, window.devicePixelRatio || 1)));
  g.uniform1f(uTime, f.time);
  g.uniform1i(uMirror, f.mirror ? 1 : 0);
  g.uniform1i(uInvert, invert ? 1 : 0);
  drawFullscreen(g);
}

// ── CPU 폴백 (M1 구현 유지) ──────────────────
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((v) => (v + 0.5) / 16));

const WHITE = { r: 0xee, g: 0xf4, b: 0xfa }; // #eef4fa
const BLUE = { r: 0x16, g: 0x48, b: 0x9e }; // #16489e
const NOISE = 0.12;

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
    const bayerRow = BAYER[y & 3];
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const l = luma(data[i], data[i + 1], data[i + 2]) / 255;
      let on = l + (Math.random() - 0.5) * NOISE > bayerRow[x & 3];
      if (invert) on = !on;
      const c = on ? WHITE : BLUE;
      od[i] = c.r;
      od[i + 1] = c.g;
      od[i + 2] = c.b;
      od[i + 3] = 255;
    }
  }

  offCtx.putImageData(out!, 0, 0);
  const { width: cw, height: ch } = ctx.canvas;
  ctx.imageSmoothingEnabled = false; // 디더 픽셀을 또렷하게
  ctx.drawImage(off, 0, 0, cw, ch);
  ctx.imageSmoothingEnabled = true;
}

export const blueprint: Effect = {
  id: 'blueprint',
  name: 'BLUEPRINT',
  usesGl: true,

  init(glCtx, ctx2d) {
    gl = glCtx;
    ctx = ctx2d;
    if (gl && !program) {
      program = compileProgram(gl, fragSrc);
      uVideo = gl.getUniformLocation(program, 'u_video');
      uRes = gl.getUniformLocation(program, 'u_res');
      uCell = gl.getUniformLocation(program, 'u_cell');
      uTime = gl.getUniformLocation(program, 'u_time');
      uMirror = gl.getUniformLocation(program, 'u_mirror');
      uInvert = gl.getUniformLocation(program, 'u_invert');
    }
  },

  render(f: FrameData) {
    if (gl && f.videoTex) renderGl(f);
    else renderCpu(f);
  },

  dispose() {
    out = null;
  },

  // 활성 탭 재탭 = 파랑↔흰 반전 토글
  onReselect() {
    invert = !invert;
  },
};
