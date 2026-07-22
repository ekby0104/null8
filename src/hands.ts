// MediaPipe 양손 추적 — 엄지+검지 핀치 제스처로 이펙트 프레임 설정 (SPEC M6)
// 무거운 번들(wasm ~10MB + 모델 7.8MB)은 동적 로드. 카메라 시작 시 자동 활성화.

export type HandsState = 'off' | 'loading' | 'on';

type HandLandmarkerT = import('@mediapipe/tasks-vision').HandLandmarker;

/** 비디오 정규화 좌표(0..1, 미러 적용 전)의 핀치 상태 */
export interface HandsInfo {
  /** 감지된 손 수 (0-2) */
  hands: number;
  /** 핀치 중인 손 수 */
  pinching: number;
  /** 양손 핀치 시 두 핀치 지점 — 사각형 대각 모서리 */
  corners: [{ x: number; y: number }, { x: number; y: number }] | null;
}

let state: HandsState = 'off';
let landmarker: HandLandmarkerT | null = null;
let lastVideoTime = -1;
let lastDetectMs = 0;
let info: HandsInfo = { hands: 0, pinching: 0, corners: null };

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
  info = { hands: 0, pinching: 0, corners: null };
}

/** 렌더 루프에서 매 프레임 호출. 새 비디오 프레임에서 최대 ~15Hz로 검출한다. */
export function updateHands(video: HTMLVideoElement, nowMs: number): void {
  if (state !== 'on' || !landmarker) return;
  if (video.currentTime === lastVideoTime) return;
  if (nowMs - lastDetectMs < 66) return;
  lastVideoTime = video.currentTime;
  lastDetectMs = nowMs;

  const result = landmarker.detectForVideo(video, nowMs);
  const pinchPoints: { x: number; y: number }[] = [];
  const handsCount = result.landmarks?.length ?? 0;

  for (const lm of result.landmarks ?? []) {
    // 핀치 판정: 엄지 끝(4)-검지 끝(8) 거리를 손 크기(손목 0 ↔ 중지 MCP 9)에 상대화.
    // 임계값이 후하면 손가락을 살짝 오므린 것도 핀치로 오인식되어
    // 의도치 않은 프레임(=이펙트 전환)이 생기므로 엄격하게 잡는다.
    const thumb = lm[4];
    const index = lm[8];
    const scale = Math.hypot(lm[0].x - lm[9].x, lm[0].y - lm[9].y);
    const d = Math.hypot(thumb.x - index.x, thumb.y - index.y);
    if (d < Math.max(0.025, scale * 0.38)) {
      pinchPoints.push({ x: (thumb.x + index.x) / 2, y: (thumb.y + index.y) / 2 });
    }
  }

  info = {
    hands: handsCount,
    pinching: pinchPoints.length,
    corners:
      pinchPoints.length >= 2 ? [pinchPoints[0], pinchPoints[1]] : null,
  };
}
