// 부트스트랩, 카메라 초기화, 렌더 루프 (SPEC §3)
//
// 렌더 구조 (M6 제스처 프레이밍):
//   1. 디스플레이 캔버스에 원본 웹캠(미러)을 그린다
//   2. 활성 이펙트는 오프스크린(2D 또는 WebGL) 캔버스에 풀사이즈로 렌더
//   3. 프레임 사각형 내부만 이펙트 캔버스에서 잘라 합성 + 흰 테두리
//   4. 프레임은 양손 엄지+검지 핀치 제스처로 설정, 이펙트는 8비트마다 자동 순환

import './style.css';
import { startCamera, switchCamera, type Camera } from './camera.ts';
import { CanvasRecorder } from './recorder.ts';
import { Transport } from './transport.ts';
import { buildUI, type UI } from './ui.ts';
import { effects, type Effect, type FrameData } from './effects/index.ts';
import { createGlContext, type GlContext } from './gl/context.ts';
import { enableHands, disableHands, updateHands, handsState, handsInfo } from './hands.ts';

const SAMPLE_W = 128; // CPU 이펙트 샘플 해상도 고정 (SPEC §7)
const DPR_MAX = 2; // devicePixelRatio 상한 (SPEC §7)
const TEMPOS = [90, 100, 110, 120, 128, 140];
const CYCLE_BEATS = 8; // 이펙트 자동 순환 주기 — 2마디
const MIN_RECT = 0.08; // 프레임 최소 크기 (정규화)

let ui: UI;
let cam: Camera | null = null;
let displayCtx: CanvasRenderingContext2D;
let fxCanvas: HTMLCanvasElement; // 2D 이펙트 오프스크린
let fxCtx: CanvasRenderingContext2D;
let glCanvas: HTMLCanvasElement; // WebGL 이펙트 오프스크린
let glCtx: GlContext | null = null; // WebGL2 미지원이면 null → CPU 폴백
let starting = false;
let flipping = false;

// 저해상도 샘플 캔버스 — getImageData는 프레임당 1회 (SPEC §7)
const sampleCanvas = document.createElement('canvas');
const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true })!;

const transport = new Transport();
const recorder = new CanvasRecorder();

// GL 이펙트 프레임용 더미 샘플 (CPU readback 생략)
const emptySample = new ImageData(2, 2);

// 이펙트 자동 순환 상태
let activeIndex = -1;
let cycleOffset = 0; // 캔버스 탭으로 앞당긴 횟수
const visited = new Set<string>();

// 이펙트 프레임 사각형 (디스플레이 정규화 좌표 0..1)
// 최초에는 프레임이 없고, 첫 양손 핀치 제스처로 만들어진다.
// 손 추적 로드 실패 시에만 기본 중앙 프레임으로 폴백.
const frameRect = { x0: 0.2, y0: 0.15, x1: 0.8, y1: 0.85 };
let hasFrame = false;
let framing = false; // 양손 핀치로 프레임 조정 중

function activeEffect(): Effect | null {
  return activeIndex >= 0 ? effects[activeIndex] : null;
}

function effectUsesGl(fx: Effect): boolean {
  return !!fx.usesGl && !!glCtx;
}

function switchEffect(next: number): void {
  activeEffect()?.dispose();
  activeIndex = next;
  const fx = effects[next];
  fx.init(glCtx?.gl ?? null, fxCtx);
  // 재방문 시 변형 토글 (BLUEPRINT 파랑↔흰 반전 등) — 순환에 변화를 준다
  if (visited.has(fx.id)) fx.onReselect?.();
  else visited.add(fx.id);
  ui.setFxLabel(fx.name);
}

function updateFrameRect(): void {
  const info = handsInfo();
  framing = info.corners !== null;
  if (!info.corners || !cam) return;

  // 첫 핀치: 프레임 생성 — 손 위치에서 바로 시작 (lerp 점프 방지)
  if (!hasFrame) {
    hasFrame = true;
    const p = info.corners.map((c) => ({ x: cam!.mirror ? 1 - c.x : c.x, y: c.y }));
    frameRect.x0 = Math.min(p[0].x, p[1].x);
    frameRect.x1 = Math.max(p[0].x, p[1].x);
    frameRect.y0 = Math.min(p[0].y, p[1].y);
    frameRect.y1 = Math.max(p[0].y, p[1].y);
  }

  // 비디오 정규화 좌표 → 디스플레이 좌표 (전면 카메라는 미러)
  const pts = info.corners.map((p) => ({
    x: cam!.mirror ? 1 - p.x : p.x,
    y: p.y,
  }));
  let x0 = Math.min(pts[0].x, pts[1].x);
  let x1 = Math.max(pts[0].x, pts[1].x);
  let y0 = Math.min(pts[0].y, pts[1].y);
  let y1 = Math.max(pts[0].y, pts[1].y);
  if (x1 - x0 < MIN_RECT) x1 = x0 + MIN_RECT;
  if (y1 - y0 < MIN_RECT) y1 = y0 + MIN_RECT;

  // 부드럽게 따라가기 (지터 억제)
  const k = 0.3;
  frameRect.x0 += (x0 - frameRect.x0) * k;
  frameRect.y0 += (y0 - frameRect.y0) * k;
  frameRect.x1 += (x1 - frameRect.x1) * k;
  frameRect.y1 += (y1 - frameRect.y1) * k;
}

function resizeCanvas(): void {
  if (!cam) return;
  const vw = cam.video.videoWidth || 4;
  const vh = cam.video.videoHeight || 3;
  const rect = ui.stage.getBoundingClientRect();
  const pad = 16;
  const availW = Math.max(64, rect.width - pad * 2);
  const availH = Math.max(64, rect.height - pad * 2);
  const scale = Math.min(availW / vw, availH / vh);
  const cssW = Math.round(vw * scale);
  const cssH = Math.round(vh * scale);

  const dpr = Math.min(DPR_MAX, window.devicePixelRatio || 1);
  ui.canvas.style.width = `${cssW}px`;
  ui.canvas.style.height = `${cssH}px`;
  for (const canvas of [ui.canvas, fxCanvas, glCanvas]) {
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
  }

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

function composite(fxSource: HTMLCanvasElement): void {
  const { width: w, height: h } = ui.canvas;

  // 1) 원본 웹캠 (미러)
  drawBase();

  // 2) 프레임 내부만 이펙트 합성
  const rx = frameRect.x0 * w;
  const ry = frameRect.y0 * h;
  const rw = (frameRect.x1 - frameRect.x0) * w;
  const rh = (frameRect.y1 - frameRect.y0) * h;
  displayCtx.drawImage(fxSource, rx, ry, rw, rh, rx, ry, rw, rh);

  // 3) 프레임 테두리 — 핀치로 조정 중이면 오렌지, 고정 상태면 흰색
  displayCtx.strokeStyle = framing ? '#e8a33d' : '#ffffff';
  displayCtx.lineWidth = Math.max(2, w / 640);
  displayCtx.strokeRect(rx, ry, rw, rh);
}

function loop(nowMs: number): void {
  requestAnimationFrame(loop);
  const s = transport.tick(nowMs);

  const camReady = cam !== null && cam.video.readyState >= 2;
  if (camReady) {
    updateHands(cam!.video, nowMs);
    updateFrameRect();
  }

  // 이펙트 자동 순환 (beat 기반 — Tempo를 따라간다)
  const idx = (Math.floor(s.beat / CYCLE_BEATS) + cycleOffset) % effects.length;
  if (idx !== activeIndex) switchEffect(idx);

  if (s.playing && camReady) {
    if (hasFrame) {
      const fx = activeEffect()!;
      const useGl = effectUsesGl(fx);
      if (useGl) glCtx!.uploadVideo(cam!.video);
      const frame: FrameData = {
        videoTex: useGl ? glCtx!.videoTex : null,
        // GL 이펙트 프레임에는 CPU 샘플 readback을 생략 (SPEC §7)
        sample: useGl ? emptySample : captureSample(),
        video: cam!.video,
        mirror: cam!.mirror,
        time: s.time,
        frame: s.frame,
        beat: s.beat,
      };
      fx.render(frame);
      composite(useGl ? glCanvas : fxCanvas);
    } else {
      drawBase(); // 프레임이 생기기 전에는 원본 영상만
    }
  }

  recorder.captureFrame(ui.canvas);
  ui.setHands(handsState(), handsInfo().hands > 0);
  ui.setTransport(transport.timecode(), s.frame, s.fps, s.bpm, s.playing);
  ui.setTimelineProgress((s.beat % CYCLE_BEATS) / CYCLE_BEATS); // 순환 주기 타임라인
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

async function start(): Promise<void> {
  // iOS 사파리: getUserMedia/play는 사용자 제스처(탭) 이후에 호출 (SPEC §8)
  if (cam || starting) return;
  starting = true;
  try {
    cam = await startCamera('user');
    ui.hideStartOverlay();
    resizeCanvas();
    requestAnimationFrame(loop);
    // 손 추적 자동 활성화 — 실패 시에만 기본 중앙 프레임으로 폴백
    void enableHands().catch((err) => {
      console.warn('hand tracking unavailable:', err);
      hasFrame = true;
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
    onCanvasTap: () => {
      cycleOffset++; // 즉시 다음 이펙트
    },
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

  new ResizeObserver(() => resizeCanvas()).observe(ui.stage);
}

bootstrap();
