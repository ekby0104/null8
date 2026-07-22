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
  /** 캔버스를 제외한 유닛 크롬(타이틀바+타임라인+트랜스포트) 높이 합 */
  chromeHeight(): number;
  /** TV 유닛 폭을 캔버스 CSS 폭에 맞춘다 */
  setDeviceWidth(cssW: number): void;
  hideStartOverlay(): void;
  showStartError(msg: string): void;
  setFxLabel(name: string): void;
  setTransport(timecode: string, frame: number, fps: number, bpm: number, playing: boolean): void;
  /** 녹화 상태 표시 — 버튼 라벨 토글 + 타임코드 점멸 + 경과 시간 칩 표시 */
  setRecording(on: boolean): void;
  /** 녹화 경과 시간 (초) — 녹화 중에만 표시된다 */
  setRecordTime(seconds: number): void;
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

  // ── 스크린 (카메라 뷰) ──
  const viewport = el('div', 'viewport');
  const canvas = el('canvas');
  viewport.appendChild(canvas);
  viewport.addEventListener('click', () => handlers.onCanvasTap());

  const overlay = el('div', 'start-overlay');
  const pulse = el('div', 'pulse');
  const big = el('div', 'big', 'TAP TO START');
  const sub = el('div', 'sub', 'webcam access required\nHTTPS or localhost only');
  overlay.append(pulse, big, sub);
  overlay.addEventListener('click', (e) => {
    e.stopPropagation(); // viewport 탭(다음 이펙트)과 분리
    handlers.onStart();
  });
  viewport.appendChild(overlay);

  // ── 트랜스포트 바 ──
  const transport = el('footer', 'transport');

  const tcGroup = el('div', 'group');
  const tcLcd = el('span', 'lcd', '00:00:00:00');
  tcGroup.append(el('span', 'label', 'Timecode'), tcLcd, el('span', 'label', '(60fps)'));

  const frameGroup = el('div', 'group');
  const frameLcd = el('span', 'lcd small', '0');
  frameGroup.append(el('span', 'label', 'F'), frameLcd);

  const playBtn = el('button', 'on', 'PAUSE');
  playBtn.title = 'play / pause';
  playBtn.addEventListener('click', () => handlers.onPlayToggle());

  const snapBtn = el('button', undefined, 'PHOTO CAPTURE');
  snapBtn.title = 'photo capture';
  snapBtn.addEventListener('click', () => handlers.onSnapshot());

  const recBtn = el('button', 'rec-btn', 'RECORD START');
  recBtn.title = 'record video';
  recBtn.addEventListener('click', () => handlers.onRecordToggle());

  // 녹화 경과 시간 — 녹화 중에만 표시
  const recTimeGroup = el('div', 'group');
  const recTimeLcd = el('span', 'lcd small', '00:00');
  recTimeGroup.append(el('span', 'label', 'REC'), recTimeLcd);
  recTimeGroup.style.display = 'none';

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

  // ︎: 텍스트 프레젠테이션 강제 — iOS에서 컬러 이모지로 렌더되는 것 방지
  const handsBtn = el('button', 'hands-btn', '✋︎');
  handsBtn.title = 'hand tracking';
  handsBtn.addEventListener('click', () => handlers.onHandsToggle());

  const camBtn = el('button', undefined, '⇄');
  camBtn.title = 'switch camera';
  camBtn.addEventListener('click', () => handlers.onCameraFlip());

  transport.append(
    tcGroup,
    frameGroup,
    playBtn,
    snapBtn,
    recBtn,
    recTimeGroup,
    fxGroup,
    el('div', 'push'),
    fpsGroup,
    tempoGroup,
    handsBtn,
    camBtn,
  );

  // ── TV 유닛: 타이틀바 + 스크린 + 트랜스포트가 한 덩어리 ──
  const device = el('div', 'device');
  device.append(titlebar, viewport, transport);
  root.append(device);

  return {
    canvas,

    chromeHeight() {
      return titlebar.offsetHeight + transport.offsetHeight;
    },

    setDeviceWidth(cssW: number) {
      device.style.width = `${cssW + 4}px`; // 좌우 베젤(2px) 포함
    },

    hideStartOverlay() {
      overlay.classList.add('hidden');
    },

    showStartError(msg: string) {
      big.textContent = 'CAMERA ERROR';
      sub.textContent = msg;
      pulse.style.animationDuration = '0.4s'; // 에러는 빠른 점멸로 표현 (흑백 컨셉)
    },

    setFxLabel(name: string) {
      fxLcd.textContent = name;
    },

    setTransport(timecode, frame, fps, bpm, playing) {
      tcLcd.textContent = timecode;
      frameLcd.textContent = String(frame).padStart(6, '0');
      fpsLcd.textContent = fps.toFixed(1);
      tempoLcd.textContent = String(bpm);
      playBtn.textContent = playing ? 'PAUSE' : 'PLAY';
      playBtn.classList.toggle('on', playing);
    },

    setRecording(on: boolean) {
      recBtn.textContent = on ? 'RECORD STOP' : 'RECORD START';
      recBtn.classList.toggle('recording', on);
      tcLcd.classList.toggle('rec', on);
      recTimeGroup.style.display = on ? 'flex' : 'none';
      if (!on) recTimeLcd.textContent = '00:00';
    },

    setRecordTime(seconds: number) {
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds) % 60;
      recTimeLcd.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    },

    setHands(state, detected) {
      handsBtn.classList.toggle('loading', state === 'loading');
      handsBtn.classList.toggle('on', state === 'on');
      handsBtn.classList.toggle('detect', state === 'on' && detected);
    },
  };
}
