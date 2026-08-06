// 타이틀바 / 트랜스포트 바 DOM (SPEC §3, §6)
// 이펙트 바(탭)는 제거 — 이펙트는 프레임 내부에서 자동 순환하고
// 현재 이펙트 이름은 트랜스포트의 FX 라벨에 표시된다.
// 타이틀바 우측의 한/영 버튼으로 UI 언어를 전환한다 (이펙트 이름은 영문 유지).

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
  /** 캔버스를 제외한 유닛 크롬(타이틀바+트랜스포트) 높이 합 */
  chromeHeight(): number;
  /** TV 유닛 폭을 캔버스 CSS 폭에 맞춘다 */
  setDeviceWidth(cssW: number): void;
  hideStartOverlay(): void;
  showStartError(msg: string): void;
  /** next=true면 "다음/NEXT" 접두어를 붙여 표시 */
  setFxLabel(name: string, next?: boolean): void;
  setTransport(frame: number, fps: number, bpm: number, playing: boolean): void;
  /** 녹화 상태 표시 — 버튼 라벨 토글 + 경과 시간 칩 표시 */
  setRecording(on: boolean): void;
  /** 녹화 경과 시간 (초) — 녹화 중에만 표시된다 */
  setRecordTime(seconds: number): void;
  /** 손 추적 상태 표시 (M6) */
  setHands(state: 'off' | 'loading' | 'on', detected: boolean): void;
}

// ── UI 문자열 (한/영) ──────────────────────
type Lang = 'en' | 'ko';

const STR = {
  en: {
    start: 'TAP TO START',
    sub: 'webcam access required\nHTTPS or localhost only',
    camError: 'CAMERA ERROR',
    pause: 'PAUSE',
    play: 'PLAY',
    photo: 'PHOTO CAPTURE',
    recStart: 'RECORD START',
    recStop: 'RECORD STOP',
    rec: 'REC',
    frame: 'F',
    fps: 'FPS',
    tempo: 'Tempo',
    bpm: 'BPM',
    fx: 'FX',
    next: 'NEXT',
  },
  ko: {
    start: '탭하여 시작',
    sub: '웹캠 권한이 필요합니다\nHTTPS 또는 localhost 전용',
    camError: '카메라 오류',
    pause: '일시정지',
    play: '재생',
    photo: '사진 캡쳐',
    recStart: '녹화 시작',
    recStop: '녹화 정지',
    rec: '녹화',
    frame: 'F',
    fps: 'FPS',
    tempo: '템포',
    bpm: 'BPM',
    fx: 'FX',
    next: '다음',
  },
} satisfies Record<Lang, Record<string, string>>;

const LANG_KEY = 'null8-lang';

function initialLang(): Lang {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === 'en' || saved === 'ko') return saved;
  return navigator.language?.startsWith('ko') ? 'ko' : 'en';
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
  let lang: Lang = initialLang();
  const t = () => STR[lang];

  // 언어 전환 시 다시 그릴 상태
  let started = false;
  let errored = false;
  let recording = false;
  let playing = true;
  let fx = { name: '—', next: false };

  // ── 타이틀바 ──
  const titlebar = el('header', 'titlebar');
  const traffic = el('div', 'traffic');
  for (const c of ['r', 'y', 'g']) traffic.appendChild(el('span', c));
  const path = el('div', 'path', '/project1/null8 (128,128)');
  const langBtn = el('button', 'lang-btn');
  langBtn.title = 'language';
  langBtn.addEventListener('click', () => {
    lang = lang === 'en' ? 'ko' : 'en';
    localStorage.setItem(LANG_KEY, lang);
    applyLang();
  });
  // 후원 링크 — 컬러 이모지 + 라벨 (유일하게 컬러를 허용하는 예외)
  const coffeeBtn = el('a', 'coffee-btn', '☕️ COFFEE');
  coffeeBtn.href = 'https://buymeacoffee.com/yuemyname';
  coffeeBtn.target = '_blank';
  coffeeBtn.rel = 'noopener';
  coffeeBtn.title = 'buy me a coffee';
  titlebar.append(traffic, path, coffeeBtn, langBtn);

  // ── 스크린 (카메라 뷰) ──
  const viewport = el('div', 'viewport');
  const canvas = el('canvas');
  viewport.appendChild(canvas);
  viewport.addEventListener('click', () => handlers.onCanvasTap());

  const overlay = el('div', 'start-overlay');
  const pulse = el('div', 'pulse');
  const big = el('div', 'big');
  const sub = el('div', 'sub');
  overlay.append(pulse, big, sub);
  overlay.addEventListener('click', (e) => {
    e.stopPropagation(); // viewport 탭(다음 이펙트)과 분리
    handlers.onStart();
  });
  viewport.appendChild(overlay);

  // ── 트랜스포트 바 ──
  const transport = el('footer', 'transport');

  const fxGroup = el('div', 'group');
  const fxLabel = el('span', 'label');
  const fxLcd = el('span', 'lcd small', '—');
  fxGroup.append(fxLabel, fxLcd);

  const playBtn = el('button', 'on');
  playBtn.addEventListener('click', () => handlers.onPlayToggle());

  const snapBtn = el('button');
  snapBtn.addEventListener('click', () => handlers.onSnapshot());

  const recBtn = el('button', 'rec-btn');
  recBtn.addEventListener('click', () => handlers.onRecordToggle());

  // 녹화 경과 시간 — 녹화 중에만 표시
  const recTimeGroup = el('div', 'group');
  const recLabel = el('span', 'label');
  const recTimeLcd = el('span', 'lcd small', '00:00');
  recTimeGroup.append(recLabel, recTimeLcd);
  recTimeGroup.style.display = 'none';

  const frameGroup = el('div', 'group');
  const frameLabel = el('span', 'label');
  const frameLcd = el('span', 'lcd small', '0');
  frameGroup.append(frameLabel, frameLcd);

  const fpsGroup = el('div', 'group');
  const fpsLabel = el('span', 'label');
  const fpsLcd = el('span', 'lcd small', '60.0');
  fpsGroup.append(fpsLabel, fpsLcd);

  const tempoGroup = el('div', 'group');
  const tempoLabel = el('span', 'label');
  const tempoLcd = el('span', 'lcd small', '120');
  const bpmLabel = el('span', 'label');
  tempoLcd.style.cursor = 'pointer';
  tempoLcd.addEventListener('click', () => handlers.onTempoTap());
  tempoGroup.append(tempoLabel, tempoLcd, bpmLabel);

  // ︎: 텍스트 프레젠테이션 강제 — iOS에서 컬러 이모지로 렌더되는 것 방지
  const handsBtn = el('button', 'hands-btn', '✋︎');
  handsBtn.title = 'hand tracking';
  handsBtn.addEventListener('click', () => handlers.onHandsToggle());

  const camBtn = el('button', undefined, '⇄');
  camBtn.title = 'switch camera';
  camBtn.addEventListener('click', () => handlers.onCameraFlip());

  transport.append(
    fxGroup,
    playBtn,
    snapBtn,
    recBtn,
    recTimeGroup,
    el('div', 'push'),
    frameGroup,
    fpsGroup,
    tempoGroup,
    handsBtn,
    camBtn,
  );

  // ── TV 유닛: 타이틀바 + 스크린 + 트랜스포트가 한 덩어리 ──
  const device = el('div', 'device');
  device.append(titlebar, viewport, transport);
  root.append(device);

  /** 현재 언어로 모든 라벨 다시 그리기 */
  function applyLang(): void {
    const s = t();
    langBtn.textContent = lang === 'en' ? '한' : 'EN'; // 전환될 언어를 표시
    if (!started) {
      big.textContent = errored ? s.camError : s.start;
      if (!errored) sub.textContent = s.sub;
    }
    playBtn.textContent = playing ? s.pause : s.play;
    snapBtn.textContent = s.photo;
    recBtn.textContent = recording ? s.recStop : s.recStart;
    recLabel.textContent = s.rec;
    frameLabel.textContent = s.frame;
    fpsLabel.textContent = s.fps;
    tempoLabel.textContent = s.tempo;
    bpmLabel.textContent = s.bpm;
    fxLabel.textContent = s.fx;
    fxLcd.textContent = fx.next ? `${s.next} ${fx.name}` : fx.name;
  }

  applyLang();

  return {
    canvas,

    chromeHeight() {
      return titlebar.offsetHeight + transport.offsetHeight;
    },

    setDeviceWidth(cssW: number) {
      device.style.width = `${cssW + 4}px`; // 좌우 베젤(2px) 포함
    },

    hideStartOverlay() {
      started = true;
      overlay.classList.add('hidden');
    },

    showStartError(msg: string) {
      errored = true;
      big.textContent = t().camError;
      sub.textContent = msg;
      pulse.style.animationDuration = '0.4s'; // 에러는 빠른 점멸로 표현
    },

    setFxLabel(name: string, next = false) {
      fx = { name, next };
      fxLcd.textContent = next ? `${t().next} ${name}` : name;
    },

    setTransport(frame, fps, bpm, isPlaying) {
      frameLcd.textContent = String(frame).padStart(6, '0');
      fpsLcd.textContent = fps.toFixed(1);
      tempoLcd.textContent = String(bpm);
      if (playing !== isPlaying) {
        playing = isPlaying;
        playBtn.textContent = playing ? t().pause : t().play;
        playBtn.classList.toggle('on', playing);
      }
    },

    setRecording(on: boolean) {
      recording = on;
      recBtn.textContent = on ? t().recStop : t().recStart;
      recBtn.classList.toggle('recording', on);
      recTimeLcd.classList.toggle('rec', on); // 녹화 중 경과 시간 점멸
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
