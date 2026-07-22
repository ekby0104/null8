// 부트스트랩, 카메라 초기화, 렌더 루프 (SPEC §3)

import './style.css';
import { startCamera, type Camera } from './camera.ts';
import { Transport } from './transport.ts';
import { buildUI, type UI } from './ui.ts';
import { effects, type Effect, type FrameData } from './effects/index.ts';

const SAMPLE_W = 128; // CPU 이펙트 샘플 해상도 고정 (SPEC §7)
const DPR_MAX = 2; // devicePixelRatio 상한 (SPEC §7)
const TEMPOS = [90, 100, 110, 120, 128, 140];

let ui: UI;
let cam: Camera | null = null;
let ctx: CanvasRenderingContext2D;
let starting = false;

// 저해상도 샘플 캔버스 — getImageData는 프레임당 1회 (SPEC §7)
const sampleCanvas = document.createElement('canvas');
const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true })!;

const transport = new Transport();
let activeIndex = 0;

function activeEffect(): Effect {
  return effects[activeIndex];
}

function selectEffect(index: number): void {
  if (index === activeIndex && ctx) return;
  activeEffect().dispose();
  activeIndex = ((index % effects.length) + effects.length) % effects.length;
  activeEffect().init(null, ctx);
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
  ui.canvas.style.width = `${cssW}px`;
  ui.canvas.style.height = `${cssH}px`;
  ui.canvas.width = Math.round(cssW * dpr);
  ui.canvas.height = Math.round(cssH * dpr);

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
    const frame: FrameData = {
      videoTex: null, // M2에서 WebGL 텍스처 업로드
      sample: captureSample(),
      video: cam.video,
      mirror: cam.mirror,
      time: s.time,
      frame: s.frame,
      beat: s.beat,
    };
    activeEffect().render(frame);
  }

  ui.setTransport(transport.timecode(), s.frame, s.fps, s.bpm, s.playing);
  ui.setTimelineProgress((s.beat % 4) / 4); // 1마디(4비트) 주기 타임라인
}

function snapshot(): void {
  ui.canvas.toBlob((blob) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `null8_${transport.timecode().replaceAll(':', '')}.png`;
    a.click();
    URL.revokeObjectURL(a.href);
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
    activeEffect().init(null, ctx);
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
    onTempoTap: () => {
      const i = TEMPOS.indexOf(transport.bpm);
      transport.bpm = TEMPOS[(i + 1) % TEMPOS.length];
    },
  });

  ctx = ui.canvas.getContext('2d')!;
  ui.setActiveEffect(activeEffect().id);

  new ResizeObserver(() => resizeCanvas()).observe(ui.stage);
}

bootstrap();
