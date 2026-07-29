// 공중 낙서 레이어 — 펜 상태 + 스트로크 관리 + ink 캔버스 (AIRDRAW §5-§7)
//
// 제스처 규칙 (A안, AIRDRAW §13):
//   한 손만 핀치 = 그리기, 양손 동시 핀치 = 프레이밍.
//   획은 시작 후 BUFFER_MS 동안 ink에 커밋하지 않고 벡터로만 표시하다가,
//   그 사이 양손 핀치(프레이밍)로 전환되면 소급 취소한다 — 프레임을
//   만들려다 생기는 부스러기 획 방지.
//
// 렌더: 매 프레임 전체 재그리기 금지 (§7). 새 점만 ink에 증분으로 덧그리고
// 합성은 drawImage 한 번. 전체 재그리기는 undo/clear/리사이즈에서만.

import type { HandPoint } from '../hands.ts';
import { toCanvas, midpoint, type Rect } from '../core/coords.ts';

/** 튜닝 상수 (AIRDRAW §12) — 실기기에서 조정 */
export const AIRDRAW = {
  posSmooth: 0.5, // 위치 EMA 계수 (A3)
  minDist: 1.5, // 이보다 가까운 점은 버림 (px)
  baseWidth: 6, // 기본 선 두께 (px)
  speedRef: 40, // 이 속도에서 두께가 최소 (px/frame, A3)
  thinRatio: 0.55, // 최대 속도에서 줄어드는 두께 비율 (A3)
  widthSmooth: 0.3, // 두께 EMA 계수 (A3)
  maxPoints: 20000,
  bufferMs: 250, // 획 시작 후 ink 커밋을 미루는 시간 (프레이밍 전환 취소창)
};

/** 잉크 색 스와치 — 화이트 톤 + 파랑 액센트 디자인 기준 (§8, 현행화) */
export const INK_COLORS = ['#ffffff', '#141414', '#8a8a8a', '#1f6bff', '#9cc3ff'];

let inkColor = INK_COLORS[0];

export function setInkColor(color: string): void {
  inkColor = color;
}

export function getInkColor(): string {
  return inkColor;
}

interface Pt {
  x: number;
  y: number;
  w: number;
}

interface Stroke {
  color: string;
  pts: Pt[];
}

interface Pen {
  drawing: boolean;
  stroke: Stroke | null;
  /** 버퍼 시작 시각. -1이면 이미 ink에 커밋됨 */
  pendingSince: number;
  /** ink에 반영된 점 수 (증분 드로잉 커서) */
  inked: number;
}

const pens = new Map<string, Pen>();
const strokes: Stroke[] = [];
let totalPoints = 0;

let ink: HTMLCanvasElement | null = null;
let ictx: CanvasRenderingContext2D | null = null;

function setupCtx(): void {
  if (!ictx) return;
  ictx.lineCap = 'round';
  ictx.lineJoin = 'round';
}

/** 캔버스 크기 변경 — 저장된 점을 스케일하고 전체 재그리기 (§10) */
export function resizeInk(w: number, h: number): void {
  if (!ink) {
    ink = document.createElement('canvas');
    // willReadFrequently 금지 (§9) — 쓰기만 하므로 GPU 가속 유지
    ictx = ink.getContext('2d')!;
  }
  if (ink.width === w && ink.height === h) return;
  const ow = ink.width;
  const oh = ink.height;
  if (ow > 0 && oh > 0) {
    const sx = w / ow;
    const sy = h / oh;
    const sw = (sx + sy) / 2;
    for (const s of strokes) {
      for (const p of s.pts) {
        p.x *= sx;
        p.y *= sy;
        p.w *= sw;
      }
    }
  }
  ink.width = w;
  ink.height = h;
  setupCtx();
  redrawInk();
}

/** 중점 이차 베지어 증분 — pts[i]가 추가됐을 때 마지막 한 조각만 그린다 (§7) */
function drawSegment(ctx: CanvasRenderingContext2D, s: Stroke, i: number): void {
  const pts = s.pts;
  ctx.strokeStyle = s.color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (i === 1) {
    // 두 점: 직선 (첫 조각)
    ctx.lineWidth = pts[1].w;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    ctx.lineTo((pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2);
    ctx.stroke();
    return;
  }
  const p0 = pts[i - 2];
  const p1 = pts[i - 1];
  const p2 = pts[i];
  const m0 = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
  const m1 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
  ctx.lineWidth = p1.w;
  ctx.beginPath();
  ctx.moveTo(m0.x, m0.y);
  ctx.quadraticCurveTo(p1.x, p1.y, m1.x, m1.y);
  ctx.stroke();
}

function drawDot(ctx: CanvasRenderingContext2D, s: Stroke): void {
  const p = s.pts[0];
  ctx.fillStyle = s.color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.w / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawWholeStroke(ctx: CanvasRenderingContext2D, s: Stroke): void {
  if (s.pts.length === 0) return;
  if (s.pts.length === 1) {
    drawDot(ctx, s);
    return;
  }
  for (let i = 1; i < s.pts.length; i++) drawSegment(ctx, s, i);
}

/** 전체 재그리기 — undo/clear/리사이즈에서만 (§7) */
export function redrawInk(): void {
  if (!ink || !ictx) return;
  ictx.clearRect(0, 0, ink.width, ink.height);
  for (const s of strokes) drawWholeStroke(ictx, s);
}

function commitPending(pen: Pen): void {
  if (!pen.stroke || !ictx) return;
  pen.pendingSince = -1;
  drawWholeStroke(ictx, pen.stroke);
  pen.inked = pen.stroke.pts.length;
  strokes.push(pen.stroke);
}

function endStroke(pen: Pen): void {
  if (pen.stroke && pen.pendingSince >= 0) commitPending(pen); // 짧은 획도 확정
  if (pen.stroke && pen.stroke.pts.length === 1 && ictx) drawDot(ictx, pen.stroke);
  pen.drawing = false;
  pen.stroke = null;
  pen.pendingSince = -1;
  pen.inked = 0;
}

function discardPending(pen: Pen): void {
  totalPoints -= pen.stroke?.pts.length ?? 0;
  pen.drawing = false;
  pen.stroke = null;
  pen.pendingSince = -1;
  pen.inked = 0;
}

/** 점 상한 초과 시 가장 오래된 획부터 버린다 (§9) */
function trimIfNeeded(): void {
  let trimmed = false;
  while (totalPoints > AIRDRAW.maxPoints && strokes.length > 0) {
    totalPoints -= strokes.shift()!.pts.length;
    trimmed = true;
  }
  if (trimmed) redrawInk();
}

/**
 * 매 프레임 호출 — 손 포인트로 펜 상태를 갱신하고 새 점을 ink에 증분 반영.
 * framingActive면 그리기를 중단한다 (버퍼 중이던 획은 소급 취소).
 */
export function updateAirdraw(
  points: HandPoint[],
  rect: Rect,
  mirrored: boolean,
  framingActive: boolean,
  nowMs: number,
): void {
  const seen = new Set<string>();

  for (const p of points) {
    seen.add(p.handedness);
    let pen = pens.get(p.handedness);
    if (!pen) {
      pen = { drawing: false, stroke: null, pendingSince: -1, inked: 0 };
      pens.set(p.handedness, pen);
    }

    // 프레이밍 전환 (A안): 버퍼 중이면 소급 취소, 커밋됐으면 획만 종료
    if (framingActive && pen.drawing) {
      if (pen.pendingSince >= 0) discardPending(pen);
      else endStroke(pen);
      continue;
    }

    // 펜 올림
    if (pen.drawing && !p.pinching) {
      endStroke(pen);
      continue;
    }

    // 펜 내림 (프레이밍 중에는 시작하지 않음)
    if (!pen.drawing && p.pinching && !framingActive) {
      pen.drawing = true;
      pen.stroke = { color: inkColor, pts: [] };
      pen.pendingSince = nowMs;
      pen.inked = 0;
    }

    if (!pen.drawing || !pen.stroke) continue;

    // 펜 촉: 엄지-검지 중점 (§4.3)
    const nib = midpoint(toCanvas(p.thumb, rect, mirrored), toCanvas(p.index, rect, mirrored));
    const last = pen.stroke.pts[pen.stroke.pts.length - 1];
    if (!last || Math.hypot(nib.x - last.x, nib.y - last.y) >= AIRDRAW.minDist) {
      pen.stroke.pts.push({ x: nib.x, y: nib.y, w: AIRDRAW.baseWidth });
      totalPoints++;
    }

    if (pen.pendingSince >= 0) {
      // 버퍼 만료 → ink 커밋 시작
      if (nowMs - pen.pendingSince > AIRDRAW.bufferMs) commitPending(pen);
    } else if (ictx) {
      // 커밋된 획 — 새 점만 증분 드로우
      while (pen.inked < pen.stroke.pts.length) {
        pen.inked++;
        if (pen.inked >= 2) drawSegment(ictx, pen.stroke, pen.inked - 1);
      }
    }
  }

  // 이번 프레임에 안 보인 손은 획 종료 (§5 — 재등장 시 화면 가로지르는 직선 방지)
  for (const [key, pen] of pens) {
    if (!seen.has(key) && pen.drawing) endStroke(pen);
  }

  trimIfNeeded();
}

/** 매 프레임 합성 — ink 한 번 + 아직 버퍼 중인 획은 벡터로 (§2, §7) */
export function compositeInk(ctx: CanvasRenderingContext2D): void {
  if (ink && (strokes.length > 0 || hasPending())) ctx.drawImage(ink, 0, 0);
  for (const pen of pens.values()) {
    if (pen.drawing && pen.pendingSince >= 0 && pen.stroke) drawWholeStroke(ctx, pen.stroke);
  }
}

function hasPending(): boolean {
  for (const pen of pens.values()) if (pen.drawing) return true;
  return false;
}

/** 특정 손이 지금 그리는 중인지 — 커서 표시용 (§8) */
export function isPenDown(handedness: string): boolean {
  return pens.get(handedness)?.drawing ?? false;
}

// ── A4에서 툴바에 연결될 조작들 ──────────────
export function undoStroke(): void {
  const s = strokes.pop();
  if (!s) return;
  totalPoints -= s.pts.length;
  redrawInk();
}

export function clearStrokes(): void {
  for (const pen of pens.values()) discardPending(pen);
  strokes.length = 0;
  totalPoints = 0;
  redrawInk();
}

/** 디버그 HUD용 상태 (§8 ?debug=1) */
export function airdrawDebug(): { strokes: number; points: number } {
  return { strokes: strokes.length, points: totalPoints };
}
