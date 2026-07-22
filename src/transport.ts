// 타임코드/프레임/FPS/재생 상태 관리 (SPEC §3, §6)

const TIMECODE_FPS = 60; // 타임코드 표시는 60fps 기준 고정

export interface TransportState {
  time: number; // 초 단위 경과 시간 (일시정지 시간 제외)
  frame: number; // 렌더된 프레임 카운터
  beat: number; // time * BPM/60
  fps: number; // 측정된 실제 FPS (EMA)
  playing: boolean;
  bpm: number;
}

export class Transport {
  playing = true;
  bpm = 120;

  private elapsed = 0;
  private lastTs: number | null = null;
  private frame = 0;
  private fpsEma = 60;

  /** rAF 콜백마다 호출. 재생 중이면 시간을 진행시키고 현재 상태를 반환한다. */
  tick(nowMs: number): TransportState {
    if (this.lastTs !== null) {
      const dt = (nowMs - this.lastTs) / 1000;
      if (dt > 0 && dt < 1) {
        this.fpsEma += (1 / dt - this.fpsEma) * 0.08;
        if (this.playing) this.elapsed += dt;
      }
    }
    this.lastTs = nowMs;
    if (this.playing) this.frame++;
    return this.state();
  }

  state(): TransportState {
    return {
      time: this.elapsed,
      frame: this.frame,
      beat: (this.elapsed * this.bpm) / 60,
      fps: this.fpsEma,
      playing: this.playing,
      bpm: this.bpm,
    };
  }

  toggle(): boolean {
    this.playing = !this.playing;
    return this.playing;
  }

  /** HH:MM:SS:FF (60fps 기준) */
  timecode(): string {
    const t = this.elapsed;
    const hh = Math.floor(t / 3600);
    const mm = Math.floor(t / 60) % 60;
    const ss = Math.floor(t) % 60;
    const ff = Math.floor(t * TIMECODE_FPS) % TIMECODE_FPS;
    const p = (n: number) => String(n).padStart(2, '0');
    return `${p(hh)}:${p(mm)}:${p(ss)}:${p(ff)}`;
  }
}
