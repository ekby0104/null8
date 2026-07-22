// 타이틀바 / 트랜스포트 바 DOM (SPEC §3, §6)
// 이펙트 바(탭)는 제거 — 이펙트는 프레임 내부에서 자동 순환하고
// 현재 이펙트 이름은 트랜스포트의 FX 라벨에 표시된다.

export interface UIHandlers {
  onStart(): void;
  onCanvasTap(): void; // 캔버스 탭 = 즉시 다음 이펙트
  onPlayToggle(): void;
  onSnapshot(): void;
  onTempoTap(): void;
  onRecordToggle(): void;
  onCameraFlip(): void; // facingMode user ↔ environment
  onHandsToggle(): void; // MediaPipe 손 추적 on/off
}

export interface UI {
  /** 합성 결과가 그려지는 디스플레이 캔버스 (녹화/스냅샷 대상) */
  canvas: HTMLCanvasElement;
  stage: HTMLElement;
  hideStartOverlay(): void;
  showStartError(msg: string): void;
  setFxLabel(name: string): void;
  setTransport(timecode: string, frame: number, fps: number, bpm: number, playing: boolean): void;
  setTimelineProgress(ratio: number): void;
  /** 녹화 상태 표시 — 녹화 중 타임코드 빨강 점멸 (SPEC §6) */
  setRecording(on: boolean): void;
  /** 손 추적 상태 표시 — on이면 오렌지, 손 감지 중이면 초록 (M6) */
  setHands(state: 'off' | 'loading' | 'on', detected: boolean): void;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function buildUI(root: HTMLElement, handlers: UIHandlers): UI {
  // ── 타이틀바 ──
  const titlebar = el('header', 'titlebar');
  const traffic = el('div', 'traffic');
  for (const c of ['r', 'y', 'g']) traffic.appendChild(el('span', c));
  const path = el('div', 'path', '/project1/null8 (128,128)');
  titlebar.append(traffic, path, el('div', 'spacer'));

  // ── 스테이지 ──
  const stage = el('main', 'stage');
  const viewport = el('div', 'viewport');
  const canvas = el('canvas');
  viewport.appendChild(canvas);
  viewport.addEventListener('click', () => handlers.onCanvasTap());

  const overlay = el('div', 'start-overlay');
  const pulse = el('div', 'pulse');
  const big = el('div', 'big', 'TAP TO START');
  const sub = el('div', 'sub', 'webcam access required\nHTTPS or localhost only');
  overlay.append(pulse, big, sub);
  overlay.addEventListener('click', () => handlers.onStart());

  stage.append(viewport, overlay);

  // ── 타임라인 ──
  const timeline = el('div', 'timeline');
  const timelineHead = el('div', 'head');
  timeline.appendChild(timelineHead);

  // ── 트랜스포트 바 ──
  const transport = el('footer', 'transport');

  const tcGroup = el('div', 'group');
  const tcLcd = el('span', 'lcd', '00:00:00:00');
  tcGroup.append(el('span', 'label', 'Timecode'), tcLcd, el('span', 'label', '(60fps)'));

  const frameGroup = el('div', 'group');
  const frameLcd = el('span', 'lcd small', '0');
  frameGroup.append(el('span', 'label', 'F'), frameLcd);

  const playBtn = el('button', 'on', '⏸');
  playBtn.title = 'play / stop';
  playBtn.addEventListener('click', () => handlers.onPlayToggle());

  const recBtn = el('button', 'rec-btn', '●');
  recBtn.title = 'record';
  recBtn.addEventListener('click', () => handlers.onRecordToggle());

  const fxGroup = el('div', 'group');
  const fxLcd = el('span', 'lcd small', '—');
  fxGroup.append(el('span', 'label', 'FX'), fxLcd);

  const fpsGroup = el('div', 'group');
  const fpsLcd = el('span', 'lcd small', '60.0');
  fpsGroup.append(el('span', 'label', 'FPS'), fpsLcd);

  const tempoGroup = el('div', 'group');
  const tempoLcd = el('span', 'lcd small', '120');
  tempoLcd.style.cursor = 'pointer';
  tempoLcd.addEventListener('click', () => handlers.onTempoTap());
  tempoGroup.append(el('span', 'label', 'Tempo'), tempoLcd, el('span', 'label', 'BPM'));

  const handsBtn = el('button', 'hands-btn', '✋');
  handsBtn.title = 'hand tracking';
  handsBtn.addEventListener('click', () => handlers.onHandsToggle());

  const camBtn = el('button', undefined, '⇄');
  camBtn.title = 'switch camera';
  camBtn.addEventListener('click', () => handlers.onCameraFlip());

  const snapBtn = el('button', undefined, '📷');
  snapBtn.title = 'snapshot';
  snapBtn.addEventListener('click', () => handlers.onSnapshot());

  transport.append(
    tcGroup,
    frameGroup,
    playBtn,
    recBtn,
    fxGroup,
    el('div', 'push'),
    fpsGroup,
    tempoGroup,
    handsBtn,
    camBtn,
    snapBtn,
  );

  root.append(titlebar, stage, timeline, transport);

  return {
    canvas,
    stage,

    hideStartOverlay() {
      overlay.classList.add('hidden');
    },

    showStartError(msg: string) {
      big.textContent = 'CAMERA ERROR';
      sub.textContent = msg;
      pulse.style.background = '#ff5f57';
    },

    setFxLabel(name: string) {
      fxLcd.textContent = name;
    },

    setTransport(timecode, frame, fps, bpm, playing) {
      tcLcd.textContent = timecode;
      frameLcd.textContent = String(frame).padStart(6, '0');
      fpsLcd.textContent = fps.toFixed(1);
      tempoLcd.textContent = String(bpm);
      playBtn.textContent = playing ? '⏸' : '▶';
      playBtn.classList.toggle('on', playing);
    },

    setTimelineProgress(ratio: number) {
      timelineHead.style.width = `${(ratio * 100).toFixed(2)}%`;
    },

    setRecording(on: boolean) {
      recBtn.classList.toggle('recording', on);
      tcLcd.classList.toggle('rec', on);
    },

    setHands(state, detected) {
      handsBtn.classList.toggle('loading', state === 'loading');
      handsBtn.classList.toggle('on', state === 'on');
      handsBtn.classList.toggle('detect', state === 'on' && detected);
    },
  };
}
