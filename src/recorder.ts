// MediaRecorder 캔버스 녹화 (SPEC §3, §6)
// iOS 사파리는 video/mp4만 지원하는 경우가 있어 isTypeSupported로 분기 (SPEC §8)

const MIME_CANDIDATES = [
  'video/mp4;codecs=avc1',
  'video/mp4',
  'video/webm;codecs=vp9',
  'video/webm',
];

export interface RecordingResult {
  blob: Blob;
  ext: 'mp4' | 'webm';
}

/**
 * 이펙트 캔버스(2D/WebGL)를 합성 캔버스로 복사하며 녹화한다.
 * 녹화 중 이펙트가 다른 캔버스로 전환돼도 스트림이 끊기지 않는다.
 */
export class CanvasRecorder {
  recording = false;

  private recorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private mime = '';
  private canvas = document.createElement('canvas');
  private ctx = this.canvas.getContext('2d')!;

  static supported(): boolean {
    return (
      typeof MediaRecorder !== 'undefined' &&
      typeof HTMLCanvasElement.prototype.captureStream === 'function'
    );
  }

  start(source: HTMLCanvasElement): void {
    if (this.recording) return;
    this.mime = MIME_CANDIDATES.find((m) => MediaRecorder.isTypeSupported(m)) ?? '';

    // 녹화 해상도는 시작 시점에 고정 (트랙 크기 변경으로 인한 글리치 방지)
    this.canvas.width = source.width;
    this.canvas.height = source.height;
    this.ctx.drawImage(source, 0, 0);

    this.stream = this.canvas.captureStream(60);
    this.recorder = new MediaRecorder(this.stream, {
      ...(this.mime ? { mimeType: this.mime } : {}),
      videoBitsPerSecond: 8_000_000,
    });
    this.chunks = [];
    this.recorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data);
    };
    this.recorder.start(1000); // 1초 단위 청크
    this.recording = true;
  }

  /** 렌더 루프에서 매 프레임 호출 — 현재 보이는 캔버스를 복사한다 */
  captureFrame(source: HTMLCanvasElement): void {
    if (!this.recording) return;
    this.ctx.drawImage(source, 0, 0, this.canvas.width, this.canvas.height);
  }

  async stop(): Promise<RecordingResult | null> {
    const rec = this.recorder;
    if (!rec || !this.recording) return null;
    this.recording = false;

    const done = new Promise<void>((resolve) => {
      rec.onstop = () => resolve();
    });
    rec.stop();
    await done;

    for (const track of this.stream?.getTracks() ?? []) track.stop();
    this.recorder = null;
    this.stream = null;

    const type = this.mime || 'video/webm';
    const ext: 'mp4' | 'webm' = type.includes('mp4') ? 'mp4' : 'webm';
    return { blob: new Blob(this.chunks, { type: type.split(';')[0] }), ext };
  }
}
