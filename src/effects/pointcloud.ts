// POINT CLOUD — luma 기반 점 크기/알파, sin 파동 변위, 시안-블루 팔레트 (SPEC §5.4)
// 잔상 트레일: 반투명 검정 오버드로우. M3에서 gl.POINTS 인스턴싱 이식 예정.

import type { Effect, FrameData } from './index.ts';
import { luma } from './index.ts';

const STEP = 2; // 샘플 그리드 간격
const TRAIL_ALPHA = 0.14; // 트레일 길이 (작을수록 잔상이 길다)

let ctx: CanvasRenderingContext2D;
let first = true;

export const pointcloud: Effect = {
  id: 'pointcloud',
  name: 'POINT CLOUD',

  init(_gl, ctx2d) {
    ctx = ctx2d;
    first = true;
  },

  render(f: FrameData) {
    const { width: cw, height: ch } = ctx.canvas;
    const { width: w, height: h, data } = f.sample;

    if (first) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, cw, ch);
      first = false;
    } else {
      ctx.fillStyle = `rgba(0,0,0,${TRAIL_ALPHA})`;
      ctx.fillRect(0, 0, cw, ch);
    }

    const scaleX = cw / w;
    const scaleY = ch / h;
    const t = f.time;

    for (let y = 0; y < h; y += STEP) {
      for (let x = 0; x < w; x += STEP) {
        const i = (y * w + x) * 4;
        const l = luma(data[i], data[i + 1], data[i + 2]) / 255;
        if (l < 0.04) continue;

        // sin 파동 변위 — 밝은 픽셀일수록 크게 출렁인다
        const wave = Math.sin(t * 2 + x * 0.35 + y * 0.18);
        const dx = wave * (1 + l * 5) * scaleX * 0.6;
        const dy = Math.cos(t * 1.6 + y * 0.28 + x * 0.11) * (1 + l * 3) * scaleY * 0.4;

        // 시안(밝음) ↔ 블루(어두움) 보간
        const r = Math.round(24 + l * 60);
        const g = Math.round(90 + l * 150);
        const b = Math.round(200 + l * 55);
        const size = (0.6 + l * 2.6) * scaleX * 0.5;

        ctx.fillStyle = `rgba(${r},${g},${b},${0.2 + l * 0.8})`;
        ctx.fillRect(x * scaleX + dx, y * scaleY + dy, size, size);
      }
    }
  },

  dispose() {
    first = true;
  },
};
