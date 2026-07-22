// 부트스트랩, 카메라 초기화, 렌더 루프 (SPEC §3)

import './style.css';
import { startCamera, switchCamera, type Camera } from './camera.ts';
import { CanvasRecorder } from './recorder.ts';
import { Transport } from './transport.ts';
import { buildUI, type UI } from './ui.ts';
import { effects, type Effect, type FrameData } from './effects/index.ts';
import { createGlContext, type GlContext } from './gl/context.ts';

const SAMPLE_W = 128; // CPU 이펙트 샘플 해상도 고정 (SPEC §7)
const DPR_MAX = 2; // devicePixelRatio 상한 (SPEC §7)
const TEMPOS = [90, 100, 110, 120, 128, 140];

let ui: UI;
let cam: Camera | null = null;
let ctx: CanvasRenderingContext2D;
let glCtx: GlContext | null = null; // WebGL2 미지원이면 null → CPU 폴백
let starting = false;

// 저해상도 샘플 캔버스 — getImageData는 프레임당 1회 (SPEC §7)
const sampleCanvas = document.createElement('canvas');
const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true })!;

const transport = new Transport();
const recorder = new CanvasRecorder();
let activeIndex = 0;
let flipping = false;

// GL 이펙트 프레임용 더미 샘플 (CPU readback 생략)
const emptySample = new ImageData(2, 2);

function activeEffect(): Effect {
  return effects[activeIndex];
}

function effectMode(fx: Effect): '2d' | 'gl' {
  return fx.usesGl && glCtx ? 'gl' : '2d';
}

function selectEffect(index: number): void {
  const next = ((index % effects.length) + effects.length) % effects.length;
  if (next === activeIndex) {
    // 활성 탭 재탭 = 이펙트 변형 토글 (예: BLUEPRINT 반전)
    activeEffect().onReselect?.();
    return;
  }
  activeEffect().dispose();
  activeIndex = next;
  activeEffect().init(glCtx?.gl ?? null, ctx);
  ui.setCanvasMode(effectMode(activeEffect()));
  ui.setActiveEffect(activeEffect().id);
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
  for (const canvas of [ui.canvas2d, ui.canvasGl]) {
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
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

function loop(nowMs: number): void {
  requestAnimationFrame(loop);
  const s = transport.tick(nowMs);

  if (s.playing && cam && cam.video.readyState >= 2) {
    const useGl = effectMode(activeEffect()) === 'gl';
    if (useGl) glCtx!.uploadVideo(cam.video);
    const frame: FrameData = {
      videoTex: useGl ? glCtx!.videoTex : null,
      // GL 이펙트 프레임에는 CPU 샘플 readback을 생략 (SPEC §7)
      sample: useGl ? emptySample : captureSample(),
      video: cam.video,
      mirror: cam.mirror,
      time: s.time,
      frame: s.frame,
      beat: s.beat,
    };
    activeEffect().render(frame);
  }

  recorder.captureFrame(ui.activeCanvas());
  ui.setTransport(transport.timecode(), s.frame, s.fps, s.bpm, s.playing);
  ui.setTimelineProgress((s.beat % 4) / 4); // 1마디(4비트) 주기 타임라인
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
    recorder.start(ui.activeCanvas());
    ui.setRecording(true);
    return;
  }
  ui.setRecording(false);
  const result = await recorder.stop();
  if (result) {
    download(result.blob, `null8_${transport.timecode().replaceAll(':', '')}.${result.ext}`);
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
  ui.activeCanvas().toBlob((blob) => {
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
    activeEffect().init(glCtx?.gl ?? null, ctx);
    ui.setCanvasMode(effectMode(activeEffect()));
    ui.setActiveEffect(activeEffect().id);
    requestAnimationFrame(loop);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    ui.showStartError(msg);
    starting = false;
  }
}

function bootstrap(): void {
  const root = document.getElementById('app')!;
  ui = buildUI(root, effects, {
    onStart: () => void start(),
    onSelectEffect: (id) => selectEffect(effects.findIndex((fx) => fx.id === id)),
    onCanvasTap: () => selectEffect(activeIndex + 1),
    onPlayToggle: () => transport.toggle(),
    onSnapshot: snapshot,
    onRecordToggle: () => void toggleRecord(),
    onCameraFlip: () => void flipCamera(),
    onTempoTap: () => {
      const i = TEMPOS.indexOf(transport.bpm);
      transport.bpm = TEMPOS[(i + 1) % TEMPOS.length];
    },
  });

  ctx = ui.canvas2d.getContext('2d')!;
  glCtx = createGlContext(ui.canvasGl);
  ui.setActiveEffect(activeEffect().id);

  new ResizeObserver(() => resizeCanvas()).observe(ui.stage);
}

bootstrap();
