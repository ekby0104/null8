// getUserMedia 래퍼 — facingMode 전환 지원 (SPEC §3, §8)

export type Facing = 'user' | 'environment';

export interface Camera {
  video: HTMLVideoElement;
  stream: MediaStream;
  facing: Facing;
  /** 전면 카메라만 좌우 반전 (SPEC §8) */
  mirror: boolean;
}

export async function startCamera(facing: Facing = 'user'): Promise<Camera> {
  const video = document.createElement('video');
  // iOS 사파리: playsInline 필수, 재생은 사용자 제스처 이후에만 호출됨 (SPEC §8)
  video.playsInline = true;
  video.muted = true;
  video.autoplay = true;

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: facing,
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: false,
  });

  video.srcObject = stream;
  await video.play();

  // 메타데이터가 아직이면 실제 해상도가 잡힐 때까지 대기
  if (video.videoWidth === 0) {
    await new Promise<void>((resolve) => {
      video.addEventListener('loadedmetadata', () => resolve(), { once: true });
    });
  }

  return { video, stream, facing, mirror: facing === 'user' };
}

export function stopCamera(cam: Camera): void {
  for (const track of cam.stream.getTracks()) track.stop();
  cam.video.srcObject = null;
}

/** facingMode user ↔ environment 전환 (M4에서 UI 버튼 연결 예정) */
export async function switchCamera(cam: Camera): Promise<Camera> {
  const next: Facing = cam.facing === 'user' ? 'environment' : 'user';
  stopCamera(cam);
  return startCamera(next);
}
