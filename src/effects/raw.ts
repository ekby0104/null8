// RAW / FRAME — 웹캠 미러 출력 + 흰색 프레임 사각형 오버레이 (SPEC §5.1)

import type { Effect, FrameData } from './index.ts';

let ctx: CanvasRenderingContext2D;

export const raw: Effect = {
  id: 'raw',
  name: 'RAW / FRAME',

  init(_gl, ctx2d) {
    ctx = ctx2d;
  },

  render(f: FrameData) {
    const { width: w, height: h } = ctx.canvas;

    ctx.save();
    if (f.mirror) {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(f.video, 0, 0, w, h);
    ctx.restore();

    // 흰색 프레임 사각형 + 코너 마크
    const m = Math.round(Math.min(w, h) * 0.06);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(2, w / 480);
    ctx.strokeRect(m, m, w - m * 2, h - m * 2);

    const c = m * 0.45;
    ctx.beginPath();
    for (const [cx, cy, dx, dy] of [
      [m, m, 1, 1],
      [w - m, m, -1, 1],
      [m, h - m, 1, -1],
      [w - m, h - m, -1, -1],
    ] as const) {
      ctx.moveTo(cx + dx * c, cy);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx, cy + dy * c);
    }
    ctx.stroke();
  },

  dispose() {},
};
