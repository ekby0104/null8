// MediaPipe 양손 추적 — 엄지+검지 핀치 제스처로 이펙트 프레임 설정 (SPEC M6)
// 무거운 번들(wasm ~10MB + 모델 7.8MB)은 동적 로드. 카메라 시작 시 자동 활성화.

export type HandsState = 'off' | 'loading' | 'on';

type HandLandmarkerT = import('@mediapipe/tasks-vision').HandLandmarker;

/** 감지된 손 하나의 손가락 상태 (비디오 정규화 좌표) */
export interface HandPoint {
  /** MediaPipe handedness — "Left" | "Right" (펜 상태 키, AIRDRAW §5) */
  handedness: string;
  /** 엄지 끝 */
  thumb: { x: number; y: number };
  /** 검지 끝 */
  index: { x: number; y: number };
  /** 핀치 진입 거리 (x축 정규화) — 마커 원 지름과 일치시켜 "겹침 = 핀치"가 되게 한다 */
  threshold: number;
  /** 엄지-검지 거리 / 손바닥 폭 비율 (디버그 표시용, AIRDRAW §4.1) */
  ratio: number;
  /** 히스테리시스 적용 후 핀치 상태 (AIRDRAW §4.2) */
  pinching: boolean;
  /** 핀치 중점 — 프레임 모서리/펜 촉으로 사용 */
  x: number;
  y: number;
}

/** 비디오 정규화 좌표(0..1, 미러 적용 전)의 핀치 상태 */
export interface HandsInfo {
  /** 감지된 손 수 (0-2) */
  hands: number;
  /** 핀치 중인 손 수 */
  pinching: number;
  /** 감지된 손마다의 포인터 — 화면 마커 표시용 */
  points: HandPoint[];
  /** 양손 핀치 시 두 핀치 지점 — 사각형 대각 모서리 */
  corners: [{ x: number; y: number }, { x: number; y: number }] | null;
}

let state: HandsState = 'off';
let landmarker: HandLandmarkerT | null = null;
let lastVideoTime = -1;
let lastDetectMs = 0;
let info: HandsInfo = { hands: 0, pinching: 0, points: [], corners: null };

// 핀치 히스테리시스 상태 머신 (AIRDRAW §4.2) — 손별(handedness) 유지.
// 단일 임계값은 경계에서 깜빡여 그리기 선이 점선처럼 끊긴다.
const PINCH_ON = 0.4; // 이 비율 미만이 STATE_FRAMES 연속이면 핀치 시작
const PINCH_OFF = 0.6; // 이 비율 초과가 STATE_FRAMES 연속이면 핀치 해제
const STATE_FRAMES = 2;

interface PinchSM {
  down: boolean;
  onFrames: number;
  offFrames: number;
}

const pinchSM = new Map<string, PinchSM>();

export function handsState(): HandsState {
  return state;
}

export function handsInfo(): HandsInfo {
  return info;
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
      numHands: 2,
      // 기본값(0.5)보다 낮춰서 멀리 있는(작게 보이는) 손과
      // 화면 가장자리에 걸친 손도 끈질기게 잡는다
      minHandDetectionConfidence: 0.3,
      minHandPresenceConfidence: 0.3,
      minTrackingConfidence: 0.3,
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
  lastVideoTime = -1;
  lastDetectMs = 0;
  pinchSM.clear();
  info = { hands: 0, pinching: 0, points: [], corners: null };
}

/**
 * 렌더 루프에서 매 프레임 호출. 새 비디오 프레임에서 검출한다.
 * 손이 보이면 ~30Hz(그리기 궤적 매끄러움), 없으면 ~10Hz(배터리 절약).
 */
export function updateHands(video: HTMLVideoElement, nowMs: number): void {
  if (state !== 'on' || !landmarker) return;
  if (video.currentTime === lastVideoTime) return;
  const interval = info.hands > 0 ? 33 : 100;
  if (nowMs - lastDetectMs < interval) return;
  lastVideoTime = video.currentTime;
  lastDetectMs = nowMs;

  const result = landmarker.detectForVideo(video, nowMs);
  const points: HandPoint[] = [];
  const handsCount = result.landmarks?.length ?? 0;
  const vw = video.videoWidth || 1280;
  const vh = video.videoHeight || 720;
  // 프레임이 정사각형이 아니므로 정규화 좌표에서 바로 hypot 하면
  // 세로 방향 거리가 왜곡된다 — 실제 픽셀로 환산 후 계산 (AIRDRAW §4.1)
  const distPx = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.hypot((a.x - b.x) * vw, (a.y - b.y) * vh);
  const seen = new Set<string>();

  for (let i = 0; i < handsCount; i++) {
    const lm = result.landmarks[i];
    let handedness = result.handednesses?.[i]?.[0]?.categoryName ?? `hand${i}`;
    if (seen.has(handedness)) handedness = `${handedness}${i}`; // 드문 중복 라벨 방어
    seen.add(handedness);

    const thumb = lm[4];
    const index = lm[8];
    // 손바닥 폭(검지 MCP 5 ↔ 새끼 MCP 17) 기준 — 손목 기준보다 안정적 (§4.1)
    const palm = distPx(lm[5], lm[17]);
    const pinch = distPx(thumb, index);
    const ratio = pinch / Math.max(palm, 1e-6);

    // 히스테리시스 + 디바운스 (§4.2): 중간 지대(0.4~0.6)에서는 직전 상태 유지
    let sm = pinchSM.get(handedness);
    if (!sm) {
      sm = { down: false, onFrames: 0, offFrames: 0 };
      pinchSM.set(handedness, sm);
    }
    if (ratio < PINCH_ON) {
      sm.onFrames++;
      sm.offFrames = 0;
      if (sm.onFrames >= STATE_FRAMES) sm.down = true;
    } else if (ratio > PINCH_OFF) {
      sm.offFrames++;
      sm.onFrames = 0;
      if (sm.offFrames >= STATE_FRAMES) sm.down = false;
    } else {
      sm.onFrames = 0;
      sm.offFrames = 0;
    }

    points.push({
      handedness,
      thumb: { x: thumb.x, y: thumb.y },
      index: { x: index.x, y: index.y },
      threshold: (PINCH_ON * palm) / vw, // 마커 원: 겹침 = 핀치 진입
      ratio,
      pinching: sm.down,
      x: (thumb.x + index.x) / 2,
      y: (thumb.y + index.y) / 2,
    });
  }

  // 이번 검출에서 안 보인 손의 상태 머신은 리셋 (다음 등장 시 새로 시작)
  for (const key of [...pinchSM.keys()]) {
    if (!seen.has(key)) pinchSM.delete(key);
  }

  const pinchPoints = points.filter((p) => p.pinching);
  info = {
    hands: handsCount,
    pinching: pinchPoints.length,
    points,
    corners: pinchPoints.length >= 2 ? [pinchPoints[0], pinchPoints[1]] : null,
  };
}
