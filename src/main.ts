// 부트스트랩, 카메라 초기화, 렌더 루프 (SPEC §3)
//
// 렌더 구조 (M6 멀티 프레임 제스처 프레이밍):
//   1. 디스플레이 캔버스에 원본 웹캠(미러)을 그린다
//   2. 양손 엄지+검지 핀치로 프레임을 만들면 순서상 다음 이펙트가 배정되고,
//      손을 놓으면 그 프레임은 그 이펙트로 영구 고정된다
//   3. 프레임들은 누적되어 여러 이펙트가 화면에 공존한다. 단, 새 프레임이
//      기존 프레임을 완전히 포함하면 그 기존 프레임은 제거된다
//   4. 각 프레임의 이펙트는 오프스크린(2D/WebGL) 캔버스에 풀사이즈로 렌더 후
//      해당 사각형만 잘라 합성한다

import './style.css';
import { startCamera, switchCamera, type Camera } from './camera.ts';
import { CanvasRecorder } from './recorder.ts';
import { Transport } from './transport.ts';
import { buildUI, type UI } from './ui.ts';
import { effects, type Effect, type FrameData } from './effects/index.ts';
import { createGlContext, type GlContext } from './gl/context.ts';
import { enableHands, disableHands, updateHands, handsState, handsInfo } from './hands.ts';
import { coverRect, toCanvas, midpoint } from './core/coords.ts';
import {
  updateAirdraw,
  compositeInk,
  resizeInk,
  isPenDown,
  getInkColor,
  airdrawDebug,
} from './layers/airdraw.ts';

const SAMPLE_W = 128; // CPU 이펙트 샘플 해상도 고정 (SPEC §7)
const DPR_MAX = 2; // devicePixelRatio 상한 (SPEC §7)
const TEMPOS = [90, 100, 110, 120, 128, 140];
const MIN_RECT = 0.08; // 프레임 최소 크기 (정규화)
const FINALIZE_MS = 400; // 핀치가 이 시간 이상 끊기면 프레임 고정 (검출 깜빡임 흡수)
const CONFIRM_MS = 150; // 양손 핀치를 이 시간 이상 유지해야 새 프레임 생성 (오인식 방지)

interface Rect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

interface FxFrame {
  rect: Rect;
  effect: Effect;
}

let ui: UI;
let cam: Camera | null = null;
let displayCtx: CanvasRenderingContext2D;
let fxCanvas: HTMLCanvasElement; // 2D 이펙트 오프스크린
let fxCtx: CanvasRenderingContext2D;
let glCanvas: HTMLCanvasElement; // WebGL 이펙트 오프스크린
let glCtx: GlContext | null = null; // WebGL2 미지원이면 null → CPU 폴백
let starting = false;
let flipping = false;
let debugHud: HTMLElement | null = null; // ?debug=1 (AIRDRAW §8)

// 저해상도 샘플 캔버스 — getImageData는 프레임당 1회 (SPEC §7)
const sampleCanvas = document.createElement('canvas');
const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true })!;

const transport = new Transport();
const recorder = new CanvasRecorder();
let recStartMs = 0;

// GL 이펙트 프레임용 더미 샘플 (CPU readback 생략)
const emptySample = new ImageData(2, 2);

// ── 프레임/이펙트 상태 ──────────────────────
const frames: FxFrame[] = []; // 고정된 프레임들 (생성 순)
let drawing: FxFrame | null = null; // 핀치로 조정 중인 프레임
let cursor = 0; // 다음 프레임에 배정될 이펙트 인덱스
let lastCornersMs = 0;
let cornersSinceMs: number | null = null; // 양손 핀치가 연속으로 유지되기 시작한 시각
const inited = new Set<string>();

function nextEffect(): Effect {
  return effects[cursor % effects.length];
}

function ensureInit(fx: Effect): void {
  if (inited.has(fx.id)) return;
  fx.init(glCtx?.gl ?? null, fxCtx);
  inited.add(fx.id);
}

/** 어떤 프레임에도 쓰이지 않는 이펙트는 해제 (SLIT-SCAN 히스토리 등 메모리 반환) */
function releaseUnused(): void {
  const used = new Set<string>();
  for (const f of frames) used.add(f.effect.id);
  if (drawing) used.add(drawing.effect.id);
  for (const id of [...inited]) {
    if (!used.has(id)) {
      effects.find((fx) => fx.id === id)?.dispose();
      inited.delete(id);
    }
  }
}

function contains(outer: Rect, inner: Rect): boolean {
  return (
    inner.x0 >= outer.x0 && inner.x1 <= outer.x1 && inner.y0 >= outer.y0 && inner.y1 <= outer.y1
  );
}

const EDGE_SNAP = 0.06; // 이 거리 안쪽에서 핀치하면 프레임을 화면 끝까지 스냅

function cornersToRect(corners: { x: number; y: number }[]): Rect {
  const pts = corners.map((p) => ({ x: cam!.mirror ? 1 - p.x : p.x, y: p.y }));
  let x0 = Math.min(pts[0].x, pts[1].x);
  let x1 = Math.max(pts[0].x, pts[1].x);
  let y0 = Math.min(pts[0].y, pts[1].y);
  let y1 = Math.max(pts[0].y, pts[1].y);
  // 가장자리 스냅 — 손을 화면 밖까지 뻗지 않아도 풀블리드 프레임 가능
  if (x0 < EDGE_SNAP) x0 = 0;
  if (y0 < EDGE_SNAP) y0 = 0;
  if (x1 > 1 - EDGE_SNAP) x1 = 1;
  if (y1 > 1 - EDGE_SNAP) y1 = 1;
  if (x1 - x0 < MIN_RECT) x1 = x0 + MIN_RECT;
  if (y1 - y0 < MIN_RECT) y1 = y0 + MIN_RECT;
  return { x0, y0, x1, y1 };
}

function updateFrames(nowMs: number): void {
  const info = handsInfo();

  if (info.corners && cam) {
    lastCornersMs = nowMs;
    const target = cornersToRect(info.corners);

    if (!drawing) {
      // 오인식 방지: 양손 핀치가 CONFIRM_MS 이상 유지될 때만 새 프레임 시작
      if (cornersSinceMs === null) cornersSinceMs = nowMs;
      if (nowMs - cornersSinceMs < CONFIRM_MS) return;
      cornersSinceMs = null;
      // 새 프레임 시작 — 순서상 다음 이펙트를 배정하고 커서 전진
      drawing = { rect: target, effect: nextEffect() };
      cursor++;
      ensureInit(drawing.effect);
      ui.setFxLabel(drawing.effect.name);
    } else {
      // 부드럽게 따라가기 (지터 억제)
      const k = 0.3;
      drawing.rect.x0 += (target.x0 - drawing.rect.x0) * k;
      drawing.rect.y0 += (target.y0 - drawing.rect.y0) * k;
      drawing.rect.x1 += (target.x1 - drawing.rect.x1) * k;
      drawing.rect.y1 += (target.y1 - drawing.rect.y1) * k;
    }
    return;
  }

  // 핀치가 풀림 — 확정 대기 리셋, 조정 중이던 프레임은 FINALIZE_MS 후 고정
  cornersSinceMs = null;
  if (drawing && nowMs - lastCornersMs > FINALIZE_MS) {
    commitFrame(drawing);
    drawing = null;
  }
}

/** 프레임 고정 — 새 프레임이 완전히 포함하는 기존 프레임은 제거 (덮어쓰기) */
function commitFrame(f: FxFrame): void {
  for (let i = frames.length - 1; i >= 0; i--) {
    if (contains(f.rect, frames[i].rect)) frames.splice(i, 1);
  }
  frames.push(f);
  releaseUnused();
  ui.setFxLabel(`NEXT ${nextEffect().name}`);
}

function resizeCanvas(): void {
  if (!cam) return;
  const vw = cam.video.videoWidth || 4;
  const vh = cam.video.videoHeight || 3;
  // TV 유닛(베젤 + 크롬) 포함해서 뷰포트 안에 들어가도록 캔버스 크기 결정
  const pad = 16;
  const bezel = 4;
  const availW = Math.max(64, window.innerWidth - pad * 2 - bezel);
  const availH = Math.max(64, window.innerHeight - pad * 2 - bezel - ui.chromeHeight());
  const scale = Math.min(availW / vw, availH / vh);
  const cssW = Math.round(vw * scale);
  const cssH = Math.round(vh * scale);

  const dpr = Math.min(DPR_MAX, window.devicePixelRatio || 1);
  ui.canvas.style.width = `${cssW}px`;
  ui.canvas.style.height = `${cssH}px`;
  ui.setDeviceWidth(cssW);
  for (const canvas of [ui.canvas, fxCanvas, glCanvas]) {
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
  }
  resizeInk(ui.canvas.width, ui.canvas.height); // 낙서 좌표 스케일 + 재그리기 (AIRDRAW §10)

  sampleCanvas.width = SAMPLE_W;
  sampleCanvas.height = Math.max(2, Math.round((SAMPLE_W * vh) / vw));
}

function captureSample(): ImageData {
  const { width: sw, height: sh } = sampleCanvas;
  sampleCtx.save();
  if (cam!.mirror) {
    sampleCtx.translate(sw, 0);
    sampleCtx.scale(-1, 1);
  }
  sampleCtx.drawImage(cam!.video, 0, 0, sw, sh);
  sampleCtx.restore();
  return sampleCtx.getImageData(0, 0, sw, sh);
}

function drawBase(): void {
  const { width: w, height: h } = ui.canvas;
  displayCtx.save();
  if (cam!.mirror) {
    displayCtx.translate(w, 0);
    displayCtx.scale(-1, 1);
  }
  displayCtx.drawImage(cam!.video, 0, 0, w, h);
  displayCtx.restore();
}

function compositeFrame(f: FxFrame, source: HTMLCanvasElement, isDrawing: boolean): void {
  const { width: w, height: h } = ui.canvas;
  const rx = f.rect.x0 * w;
  const ry = f.rect.y0 * h;
  const rw = (f.rect.x1 - f.rect.x0) * w;
  const rh = (f.rect.y1 - f.rect.y0) * h;
  displayCtx.drawImage(source, rx, ry, rw, rh, rx, ry, rw, rh);
  // 테두리 — 흑백 컨셉: 조정 중이면 흰 점선, 고정이면 흰 실선
  displayCtx.strokeStyle = '#ffffff';
  displayCtx.lineWidth = Math.max(2, w / 640);
  if (isDrawing) displayCtx.setLineDash([10, 8]);
  displayCtx.strokeRect(rx, ry, rw, rh);
  displayCtx.setLineDash([]);
}

function renderFrames(s: { time: number; frame: number; beat: number }): void {
  drawBase();

  const all: { f: FxFrame; isDrawing: boolean }[] = frames.map((f) => ({ f, isDrawing: false }));
  if (drawing) all.push({ f: drawing, isDrawing: true });
  if (all.length === 0) return;

  const anyGl = all.some(({ f }) => f.effect.usesGl && glCtx);
  const anyCpu = all.some(({ f }) => !(f.effect.usesGl && glCtx));
  if (anyGl) glCtx!.uploadVideo(cam!.video);

  const frameData: FrameData = {
    videoTex: anyGl ? glCtx!.videoTex : null,
    // CPU 이펙트가 하나도 없으면 getImageData readback 생략 (SPEC §7)
    sample: anyCpu ? captureSample() : emptySample,
    video: cam!.video,
    mirror: cam!.mirror,
    time: s.time,
    frame: s.frame,
    beat: s.beat,
  };

  // 같은 캔버스를 쓰는 직전 이펙트와 같으면 재렌더 생략, 다르면 렌더 후 즉시 합성
  let lastOn2d: Effect | null = null;
  let lastOnGl: Effect | null = null;
  for (const { f, isDrawing } of all) {
    const useGl = !!f.effect.usesGl && !!glCtx;
    if (useGl) {
      if (lastOnGl !== f.effect) {
        f.effect.render(frameData);
        lastOnGl = f.effect;
      }
      compositeFrame(f, glCanvas, isDrawing);
    } else {
      if (lastOn2d !== f.effect) {
        f.effect.render(frameData);
        lastOn2d = f.effect;
      }
      compositeFrame(f, fxCanvas, isDrawing);
    }
  }
}

/**
 * 손가락 마커 (AIRDRAW §3/§4.3/§8 좌표계 기반)
 * - 엄지·검지 끝에 각각 투명 원 + 흰 보더. 원 반지름 = 핀치 판정 거리의
 *   절반이라, 두 원이 겹쳐지는 순간이 곧 핀치 인식 시점 (그때 파란 보더)
 * - 엄지↔검지를 잇는 얇은 선으로 핀치 정도를 시각화
 * - 펜 촉(nib) = 엄지-검지 중점에 작은 커서 원 — 공중 낙서의 펜 위치
 */
function drawHandMarkers(): void {
  const info = handsInfo();
  if (info.points.length === 0 || !cam) return;
  const { width: w, height: h } = ui.canvas;
  const rect = coverRect(cam.video.videoWidth || 4, cam.video.videoHeight || 3, w, h);
  displayCtx.lineWidth = Math.max(2, w / 500);

  for (const p of info.points) {
    const thumb = toCanvas(p.thumb, rect, cam.mirror);
    const index = toCanvas(p.index, rect, cam.mirror);
    // 그리는 중이면 잉크 색, 핀치(프레이밍 등)면 파랑, 평상시 흰색 (AIRDRAW §8)
    const drawing = isPenDown(p.handedness);
    const color = drawing ? getInkColor() : p.pinching ? '#1f6bff' : '#ffffff';
    displayCtx.strokeStyle = color;

    // 엄지↔검지 연결선 (핀치 정도 시각화)
    displayCtx.save();
    displayCtx.lineWidth = Math.max(1, w / 900);
    displayCtx.beginPath();
    displayCtx.moveTo(thumb.x, thumb.y);
    displayCtx.lineTo(index.x, index.y);
    displayCtx.stroke();
    displayCtx.restore();

    // 손가락 끝 원 — 겹침 = 핀치
    const r = Math.max(8, (p.threshold * rect.w) / 2);
    for (const tip of [thumb, index]) {
      displayCtx.beginPath();
      displayCtx.arc(tip.x, tip.y, r, 0, Math.PI * 2);
      displayCtx.stroke();
    }

    // 펜 촉 커서 (AIRDRAW §4.3 — 중점이라 펜을 쥔 감각)
    const nib = midpoint(thumb, index);
    displayCtx.beginPath();
    displayCtx.arc(nib.x, nib.y, Math.max(3, w / 240), 0, Math.PI * 2);
    displayCtx.fillStyle = color;
    displayCtx.fill();
  }
}

/** ?debug=1 — 손별 ratio/펜 상태 HUD (AIRDRAW §8, 임계값 튜닝용) */
function updateDebugHud(): void {
  if (!debugHud) return;
  const info = handsInfo();
  const d = airdrawDebug();
  const lines = info.points.map(
    (p) =>
      `${p.handedness.padEnd(6)} ratio ${p.ratio.toFixed(2)} ` +
      `${p.pinching ? 'PINCH' : '  -  '} ${isPenDown(p.handedness) ? 'DRAW' : ''}`,
  );
  lines.push(`strokes ${d.strokes}  points ${d.points}  hands ${info.hands}`);
  debugHud.textContent = lines.join('\n');
}

function loop(nowMs: number): void {
  requestAnimationFrame(loop);
  const s = transport.tick(nowMs);

  const camReady = cam !== null && cam.video.readyState >= 2;
  if (camReady) {
    updateHands(cam!.video, nowMs);
    updateFrames(nowMs);
  }

  if (s.playing && camReady) {
    // 공중 낙서 펜 상태 갱신 — 한 손 핀치 = 그리기, 양손 핀치/프레임 조정 = 프레이밍 (A안)
    const info = handsInfo();
    const framingActive = drawing !== null || info.pinching >= 2;
    const rect = coverRect(
      cam!.video.videoWidth || 4,
      cam!.video.videoHeight || 3,
      ui.canvas.width,
      ui.canvas.height,
    );
    updateAirdraw(info.points, rect, cam!.mirror, framingActive, nowMs);

    renderFrames(s);
    compositeInk(displayCtx); // 잉크는 이펙트 위, 커서 아래 (AIRDRAW §2)
    drawHandMarkers();
    updateDebugHud();
  }

  recorder.captureFrame(ui.canvas);
  if (recorder.recording) ui.setRecordTime((nowMs - recStartMs) / 1000);
  ui.setHands(handsState(), handsInfo().hands > 0);
  ui.setTransport(s.frame, s.fps, s.bpm, s.playing);
}

function download(blob: Blob, filename: string): void {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

async function toggleRecord(): Promise<void> {
  if (!cam || !CanvasRecorder.supported()) return;
  if (!recorder.recording) {
    recorder.start(ui.canvas);
    recStartMs = performance.now();
    ui.setRecording(true);
    return;
  }
  ui.setRecording(false);
  const result = await recorder.stop();
  if (result) {
    download(result.blob, `null8_${transport.timecode().replaceAll(':', '')}.${result.ext}`);
  }
}

async function toggleHands(): Promise<void> {
  if (handsState() === 'loading') return;
  if (handsState() === 'on') {
    disableHands();
    return;
  }
  ui.setHands('loading', false);
  try {
    await enableHands();
  } catch (err) {
    console.error('hand tracking init failed:', err);
  }
}

async function flipCamera(): Promise<void> {
  // facingMode user ↔ environment (SPEC §6) — 실패 시 이전 카메라로 복귀
  if (!cam || flipping) return;
  flipping = true;
  const prev = cam.facing;
  try {
    cam = await switchCamera(cam);
  } catch {
    cam = await startCamera(prev);
  } finally {
    flipping = false;
  }
  resizeCanvas();
}

function snapshot(): void {
  ui.canvas.toBlob((blob) => {
    if (blob) download(blob, `null8_${transport.timecode().replaceAll(':', '')}.png`);
  }, 'image/png');
}

/** 캔버스 탭: 프레임이 있으면 마지막 프레임 제거(undo), 없으면 다음 이펙트 예약 변경 */
function onCanvasTap(): void {
  if (frames.length > 0) {
    frames.pop();
    releaseUnused();
  } else {
    cursor++;
  }
  ui.setFxLabel(`NEXT ${nextEffect().name}`);
}

async function start(): Promise<void> {
  // iOS 사파리: getUserMedia/play는 사용자 제스처(탭) 이후에 호출 (SPEC §8)
  if (cam || starting) return;
  starting = true;
  try {
    cam = await startCamera('user');
    ui.hideStartOverlay();
    resizeCanvas();
    requestAnimationFrame(loop);
    // 손 추적 자동 활성화 — 실패 시에만 기본 중앙 프레임 하나로 폴백
    void enableHands().catch((err) => {
      console.warn('hand tracking unavailable:', err);
      const fx = nextEffect();
      cursor++;
      ensureInit(fx);
      frames.push({ rect: { x0: 0.2, y0: 0.15, x1: 0.8, y1: 0.85 }, effect: fx });
      ui.setFxLabel(fx.name);
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    ui.showStartError(msg);
    starting = false;
  }
}

function bootstrap(): void {
  const root = document.getElementById('app')!;
  ui = buildUI(root, {
    onStart: () => void start(),
    onCanvasTap,
    onPlayToggle: () => transport.toggle(),
    onSnapshot: snapshot,
    onTempoTap: () => {
      const i = TEMPOS.indexOf(transport.bpm);
      transport.bpm = TEMPOS[(i + 1) % TEMPOS.length];
    },
    onRecordToggle: () => void toggleRecord(),
    onCameraFlip: () => void flipCamera(),
    onHandsToggle: () => void toggleHands(),
  });

  displayCtx = ui.canvas.getContext('2d')!;
  fxCanvas = document.createElement('canvas');
  fxCtx = fxCanvas.getContext('2d')!;
  glCanvas = document.createElement('canvas');
  glCtx = createGlContext(glCanvas);

  ui.setFxLabel(`NEXT ${nextEffect().name}`);
  window.addEventListener('resize', resizeCanvas);

  if (new URLSearchParams(location.search).has('debug')) {
    debugHud = document.createElement('pre');
    debugHud.className = 'debug-hud';
    document.body.appendChild(debugHud);
  }

  // 개발/테스트용 디버그 훅 — 제스처 없이 프레임 조작
  (window as unknown as Record<string, unknown>).__null8 = {
    addFrame(rect: Rect) {
      const fx = nextEffect();
      cursor++;
      ensureInit(fx);
      commitFrame({ rect, effect: fx });
    },
    clearFrames() {
      frames.length = 0;
      releaseUnused();
    },
    get frames() {
      return frames.map((f) => ({ rect: { ...f.rect }, id: f.effect.id }));
    },
  };
}

bootstrap();
