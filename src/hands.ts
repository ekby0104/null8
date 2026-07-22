// MediaPipe Hands 손 추적 (SPEC M6) — 손 흔들기 에너지로 이펙트 파라미터 제어
// 무거운 번들(wasm ~10MB + 모델 7.8MB)은 ✋ 버튼으로 켤 때만 동적 로드한다.

import { pointcloudParams } from './effects/pointcloud.ts';

export type HandsState = 'off' | 'loading' | 'on';

type HandLandmarkerT = import('@mediapipe/tasks-vision').HandLandmarker;

const DEFAULT_WAVE = 1.0;

let state: HandsState = 'off';
let landmarker: HandLandmarkerT | null = null;
let lastVideoTime = -1;
let lastDetectMs = 0;
let prev: { x: number; y: number; t: number } | null = null;
let energy = 0; // 손 흔들기 에너지 (EMA)
let detected = false;

export function handsState(): HandsState {
  return state;
}

export function handsDetected(): boolean {
  return detected;
}

export async function enableHands(): Promise<void> {
  if (state !== 'off') return;
  state = 'loading';
  try {
    const { FilesetResolver, HandLandmarker } = await import('@mediapipe/tasks-vision');
    const base = import.meta.env.BASE_URL;
    const fileset = await FilesetResolver.forVisionTasks(`${base}mediapipe/wasm`);
    const options = (delegate: 'GPU' | 'CPU') => ({
      baseOptions: {
        modelAssetPath: `${base}mediapipe/hand_landmarker.task`,
        delegate,
      },
      runningMode: 'VIDEO' as const,
      numHands: 1,
    });
    try {
      landmarker = await HandLandmarker.createFromOptions(fileset, options('GPU'));
    } catch {
      landmarker = await HandLandmarker.createFromOptions(fileset, options('CPU'));
    }
    state = 'on';
  } catch (err) {
    state = 'off';
    throw err;
  }
}

export function disableHands(): void {
  landmarker?.close();
  landmarker = null;
  state = 'off';
  detected = false;
  prev = null;
  energy = 0;
  lastVideoTime = -1;
  lastDetectMs = 0;
  pointcloudParams.wave = DEFAULT_WAVE;
}

/** 렌더 루프에서 매 프레임 호출. 새 비디오 프레임에서만 검출한다. */
export function updateHands(video: HTMLVideoElement, nowMs: number): void {
  if (state !== 'on' || !landmarker) return;
  if (video.currentTime === lastVideoTime) return;
  // 검출은 최대 ~15Hz — 흔들기 에너지 추적에는 충분하고 저사양 기기를 보호
  if (nowMs - lastDetectMs < 66) return;
  lastVideoTime = video.currentTime;
  lastDetectMs = nowMs;

  const result = landmarker.detectForVideo(video, nowMs);
  const lm = result.landmarks?.[0];
  detected = !!lm;

  if (lm) {
    const p = lm[9]; // 가운뎃손가락 MCP — 손바닥 중심 근처
    const t = nowMs / 1000;
    if (prev) {
      const dt = Math.max(1e-3, t - prev.t);
      const v = Math.hypot(p.x - prev.x, p.y - prev.y) / dt; // 정규화 좌표/초
      energy += (Math.min(v, 3) - energy) * 0.15;
    }
    prev = { x: p.x, y: p.y, t };
  } else {
    prev = null;
    energy *= 0.92; // 손이 사라지면 서서히 감쇠
  }

  // 손 흔들기 에너지 → 포인트 클라우드 파동 강도 (가만히 = 1.0, 세게 흔들면 ~4.5)
  pointcloudParams.wave = Math.min(4.5, DEFAULT_WAVE + energy * 2.2);
}
