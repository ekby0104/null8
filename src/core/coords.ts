// cover-fit + 미러 좌표 변환 — 손 추적/렌더 공용 (AIRDRAW §3)
// 랜드마크(비디오 정규화 [0,1])를 캔버스 픽셀로 옮기는 유일한 경로.
// 여러 곳에서 각자 계산하면 그림과 영상이 미묘하게 어긋난다.

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** 비디오(vw×vh)를 캔버스(cw×ch)에 cover-fit으로 깔았을 때의 배치 사각형 */
export function coverRect(vw: number, vh: number, cw: number, ch: number): Rect {
  const s = Math.max(cw / vw, ch / vh);
  const w = vw * s;
  const h = vh * s;
  return { x: (cw - w) / 2, y: (ch - h) / 2, w, h };
}

/** 정규화 랜드마크 → 캔버스 픽셀. mirrored는 전면 카메라만 true (SPEC §8) */
export function toCanvas(
  lm: { x: number; y: number },
  r: Rect,
  mirrored: boolean,
): { x: number; y: number } {
  const nx = mirrored ? 1 - lm.x : lm.x;
  return { x: r.x + nx * r.w, y: r.y + lm.y * r.h };
}

export function midpoint(
  a: { x: number; y: number },
  b: { x: number; y: number },
): { x: number; y: number } {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}
