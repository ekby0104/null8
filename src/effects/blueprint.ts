// BLUEPRINT — 4×4 Bayer ordered dithering + 랜덤 노이즈, 듀오톤 (SPEC §5.5)
// 흰 #eef4fa / 청사진 파랑 #16489e. M2에서 GLSL 이식 + 반전 토글 예정.

import type { Effect, FrameData } from './index.ts';
import { luma } from './index.ts';

// 4×4 Bayer 행렬 → 0..1 임계값
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
let off: HTMLCanvasElement;
let offCtx: CanvasRenderingContext2D;
let out: ImageData | null = null;

export const blueprint: Effect = {
  id: 'blueprint',
  name: 'BLUEPRINT',

  init(_gl, ctx2d) {
    ctx = ctx2d;
    off = document.createElement('canvas');
    offCtx = off.getContext('2d')!;
  },

  render(f: FrameData) {
    const { width: w, height: h, data } = f.sample;

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
        const on = l + (Math.random() - 0.5) * NOISE > bayerRow[x & 3];
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
  },

  dispose() {
    out = null;
  },
};
