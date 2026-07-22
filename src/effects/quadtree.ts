// QUADTREE MOSAIC — luma 분산 기반 재귀 4분할 (SPEC §5.2)
// 분할 계산은 CPU 유지 (v1.0에서도 동일 방침), 렌더는 Canvas 2D.

import type { Effect, FrameData } from './index.ts';
import { luma } from './index.ts';

const MAX_DEPTH = 6;
const MIN_SIZE = 2; // 샘플 픽셀 단위 최소 리프 크기

let ctx: CanvasRenderingContext2D;

// 영역 통계 O(1) 조회용 summed-area table (luma, luma², r, g, b)
let sw = 0;
let sh = 0;
let satL: Float64Array = new Float64Array(0);
let satL2: Float64Array = new Float64Array(0);
let satR: Float64Array = new Float64Array(0);
let satG: Float64Array = new Float64Array(0);
let satB: Float64Array = new Float64Array(0);

function buildSAT(img: ImageData): void {
  const { width: w, height: h, data } = img;
  if (w !== sw || h !== sh) {
    sw = w;
    sh = h;
    const n = (w + 1) * (h + 1);
    satL = new Float64Array(n);
    satL2 = new Float64Array(n);
    satR = new Float64Array(n);
    satG = new Float64Array(n);
    satB = new Float64Array(n);
  }
  const stride = w + 1;
  for (let y = 0; y < h; y++) {
    let rowL = 0;
    let rowL2 = 0;
    let rowR = 0;
    let rowG = 0;
    let rowB = 0;
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const l = luma(r, g, b);
      rowL += l;
      rowL2 += l * l;
      rowR += r;
      rowG += g;
      rowB += b;
      const o = (y + 1) * stride + (x + 1);
      const up = y * stride + (x + 1);
      satL[o] = satL[up] + rowL;
      satL2[o] = satL2[up] + rowL2;
      satR[o] = satR[up] + rowR;
      satG[o] = satG[up] + rowG;
      satB[o] = satB[up] + rowB;
    }
  }
}

function regionSum(sat: Float64Array, x: number, y: number, w: number, h: number): number {
  const stride = sw + 1;
  return (
    sat[(y + h) * stride + (x + w)] -
    sat[y * stride + (x + w)] -
    sat[(y + h) * stride + x] +
    sat[y * stride + x]
  );
}

/** 리프 위치 기반 결정적 해시 — 초록 패치 선택용 */
function hash(x: number, y: number, t: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7 + t * 74.7) * 43758.5453;
  return s - Math.floor(s);
}

function subdivide(
  x: number,
  y: number,
  w: number,
  h: number,
  depth: number,
  threshold: number,
  scaleX: number,
  scaleY: number,
  time: number,
): void {
  const area = w * h;
  const mean = regionSum(satL, x, y, w, h) / area;
  const variance = regionSum(satL2, x, y, w, h) / area - mean * mean;

  const canSplit = depth < MAX_DEPTH && w > MIN_SIZE && h > MIN_SIZE;
  if (canSplit && variance > threshold) {
    const hw = w >> 1;
    const hh = h >> 1;
    subdivide(x, y, hw, hh, depth + 1, threshold, scaleX, scaleY, time);
    subdivide(x + hw, y, w - hw, hh, depth + 1, threshold, scaleX, scaleY, time);
    subdivide(x, y + hh, hw, h - hh, depth + 1, threshold, scaleX, scaleY, time);
    subdivide(x + hw, y + hh, w - hw, h - hh, depth + 1, threshold, scaleX, scaleY, time);
    return;
  }

  // 리프: 평균색 채움 + 얇은 검정 테두리
  const r = regionSum(satR, x, y, w, h) / area;
  const g = regionSum(satG, x, y, w, h) / area;
  const b = regionSum(satB, x, y, w, h) / area;

  // 원본 오마주: 일부 리프를 초록 패치로 (시간에 따라 깜빡이며 자리 이동)
  const green = hash(x, y, Math.floor(time * 2)) < 0.025;
  ctx.fillStyle = green
    ? '#2ea44f'
    : `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;

  const px = x * scaleX;
  const py = y * scaleY;
  const pw = w * scaleX;
  const ph = h * scaleY;
  ctx.fillRect(px, py, pw, ph);
  ctx.strokeRect(px + 0.5, py + 0.5, pw - 1, ph - 1);
}

export const quadtree: Effect = {
  id: 'quadtree',
  name: 'QUADTREE MOSAIC',

  init(_gl, ctx2d) {
    ctx = ctx2d;
  },

  render(f: FrameData) {
    const { width: cw, height: ch } = ctx.canvas;
    const { width: w, height: h } = f.sample;

    buildSAT(f.sample);

    // v0.1: 임계값이 sin(time)으로 출렁임 (beat 연동은 M5에서 전환 예정)
    const threshold = 380 + 300 * Math.sin(f.time * 0.9);

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cw, ch);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;

    subdivide(0, 0, w, h, 0, threshold, cw / w, ch / h, f.time);
  },

  dispose() {
    sw = 0;
    sh = 0;
  },
};
