// SKETCH — Sobel 엣지 검출 → 반전 → 종이 톤 (SPEC §5.3)
// M1: 128 샘플에서 CPU 처리 후 업스케일. M2에서 GLSL 풀해상도 이식 예정.

import type { Effect, FrameData } from './index.ts';
import { luma } from './index.ts';

let ctx: CanvasRenderingContext2D;
let off: HTMLCanvasElement;
let offCtx: CanvasRenderingContext2D;
let lumaBuf: Float32Array = new Float32Array(0);
let out: ImageData | null = null;

export const sketch: Effect = {
  id: 'sketch',
  name: 'SKETCH',

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
      lumaBuf = new Float32Array(w * h);
      out = offCtx.createImageData(w, h);
    }

    for (let i = 0, p = 0; i < w * h; i++, p += 4) {
      lumaBuf[i] = luma(data[p], data[p + 1], data[p + 2]);
    }

    const o = out!;
    const od = o.data;
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
        // 반전: 엣지가 진할수록 어두운 연필선, 배경은 250 기준 미색 종이 톤
        const v = 250 - mag * 0.92;
        const p = (y * w + x) * 4;
        od[p] = Math.max(20, v);
        od[p + 1] = Math.max(18, v - 2);
        od[p + 2] = Math.max(14, v - 10);
        od[p + 3] = 255;
      }
    }

    offCtx.putImageData(o, 0, 0);

    const { width: cw, height: ch } = ctx.canvas;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(off, 0, 0, cw, ch);
  },

  dispose() {
    lumaBuf = new Float32Array(0);
    out = null;
  },
};
