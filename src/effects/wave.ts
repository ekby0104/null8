// WAVE — 행 단위 sin 변위 + 에코 등고선 + 블루 도트 디더 (레퍼런스 IMG_6365)
// WebGL2 미지원 시 128 샘플 CPU 폴백.

import type { Effect, FrameData } from './index.ts';
import { luma } from './index.ts';
import { compileProgram, drawFullscreen } from '../gl/pipeline.ts';
import fragSrc from './wave.frag?raw';

// ── WebGL 경로 ──────────────────────────────
let gl: WebGL2RenderingContext | null = null;
let program: WebGLProgram | null = null;
let uVideo: WebGLUniformLocation | null = null;
let uRes: WebGLUniformLocation | null = null;
let uCell: WebGLUniformLocation | null = null;
let uTime: WebGLUniformLocation | null = null;
let uMirror: WebGLUniformLocation | null = null;

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
  g.uniform1f(uCell, Math.max(1, Math.min(2, window.devicePixelRatio || 1)) * 1.5);
  g.uniform1f(uTime, f.time);
  g.uniform1i(uMirror, f.mirror ? 1 : 0);
  drawFullscreen(g);
}

// ── CPU 폴백 ────────────────────────────────
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((v) => (v + 0.5) / 16));

// [q>0.72 GLOW, q>0.45 BLUE, q>0.24 DEEP, else INK]
const PALETTE: [number, number, number][] = [
  [217, 247, 255],
  [84, 158, 255],
  [20, 56, 128],
  [0, 3, 8],
];

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

  const t = f.time;
  const od = out!.data;
  for (let y = 0; y < h; y++) {
    const vy = y / h;
    const wave = Math.sin(vy * 58 + t * 2.4) * 0.55 + Math.sin(vy * 21 - t * 1.6) * 0.45;
    const bayerRow = BAYER[y & 3];
    for (let x = 0; x < w; x++) {
      const base = lumaBuf[y * w + x];
      let acc = 0;
      for (let i = 0; i < 4; i++) {
        const ox = Math.round(wave * (0.006 + i * 0.014) * (0.35 + base) * w);
        const sx = Math.min(w - 1, Math.max(0, x + ox));
        acc = Math.max(acc, lumaBuf[y * w + sx] * Math.pow(0.7, i));
      }
      const q = acc + (bayerRow[x & 3] - 0.5) * 0.28;
      const c = PALETTE[q > 0.72 ? 0 : q > 0.45 ? 1 : q > 0.24 ? 2 : 3];
      const p = (y * w + x) * 4;
      od[p] = c[0];
      od[p + 1] = c[1];
      od[p + 2] = c[2];
      od[p + 3] = 255;
    }
  }

  offCtx.putImageData(out!, 0, 0);
  const { width: cw, height: ch } = ctx.canvas;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(off, 0, 0, cw, ch);
  ctx.imageSmoothingEnabled = true;
}

export const wave: Effect = {
  id: 'wave',
  name: 'WAVE',
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
