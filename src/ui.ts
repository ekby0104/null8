// 타이틀바 / 이펙트 바 / 트랜스포트 바 DOM (SPEC §3, §6)

import type { Effect } from './effects/index.ts';

export interface UIHandlers {
  onStart(): void;
  onSelectEffect(id: string): void;
  onCanvasTap(): void; // 캔버스 탭 = 다음 이펙트
  onPlayToggle(): void;
  onSnapshot(): void;
  onTempoTap(): void;
}

export interface UI {
  /** Canvas 2D 이펙트용 */
  canvas2d: HTMLCanvasElement;
  /** WebGL 이펙트용 — 같은 자리에 겹쳐져 있고 모드에 따라 하나만 보인다 */
  canvasGl: HTMLCanvasElement;
  stage: HTMLElement;
  /** 활성 이펙트 종류에 맞는 캔버스를 표시한다 */
  setCanvasMode(mode: '2d' | 'gl'): void;
  /** 현재 보이는 캔버스 (스냅샷용) */
  activeCanvas(): HTMLCanvasElement;
  hideStartOverlay(): void;
  showStartError(msg: string): void;
  setActiveEffect(id: string): void;
  setTransport(timecode: string, frame: number, fps: number, bpm: number, playing: boolean): void;
  setTimelineProgress(ratio: number): void;
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

export function buildUI(root: HTMLElement, effects: Effect[], handlers: UIHandlers): UI {
  // ── 타이틀바 ──
  const titlebar = el('header', 'titlebar');
  const traffic = el('div', 'traffic');
  for (const c of ['r', 'y', 'g']) traffic.appendChild(el('span', c));
  const path = el('div', 'path', '/project1/null8 (128,128)');
  titlebar.append(traffic, path, el('div', 'spacer'));

  // ── 스테이지 ──
  const stage = el('main', 'stage');
  const viewport = el('div', 'viewport');
  const canvas2d = el('canvas');
  const canvasGl = el('canvas', 'hidden');
  viewport.append(canvas2d, canvasGl);
  viewport.addEventListener('click', () => handlers.onCanvasTap());
  let mode: '2d' | 'gl' = '2d';

  const overlay = el('div', 'start-overlay');
  const pulse = el('div', 'pulse');
  const big = el('div', 'big', 'TAP TO START');
  const sub = el('div', 'sub', 'webcam access required\nHTTPS or localhost only');
  overlay.append(pulse, big, sub);
  overlay.addEventListener('click', () => handlers.onStart(), { once: false });

  stage.append(viewport, overlay);

  // ── 이펙트 바 ──
  const fxbar = el('nav', 'fxbar');
  const fxButtons = new Map<string, HTMLButtonElement>();
  for (const fx of effects) {
    const btn = el('button', undefined, fx.name);
    btn.addEventListener('click', () => handlers.onSelectEffect(fx.id));
    fxButtons.set(fx.id, btn);
    fxbar.appendChild(btn);
  }

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

  const fpsGroup = el('div', 'group');
  const fpsLcd = el('span', 'lcd small', '60.0');
  fpsGroup.append(el('span', 'label', 'FPS'), fpsLcd);

  const tempoGroup = el('div', 'group');
  const tempoLcd = el('span', 'lcd small', '120');
  tempoLcd.style.cursor = 'pointer';
  tempoLcd.addEventListener('click', () => handlers.onTempoTap());
  tempoGroup.append(el('span', 'label', 'Tempo'), tempoLcd, el('span', 'label', 'BPM'));

  const snapBtn = el('button', undefined, '📷');
  snapBtn.title = 'snapshot';
  snapBtn.addEventListener('click', () => handlers.onSnapshot());

  transport.append(tcGroup, frameGroup, playBtn, el('div', 'push'), fpsGroup, tempoGroup, snapBtn);

  root.append(titlebar, stage, fxbar, timeline, transport);

  return {
    canvas2d,
    canvasGl,
    stage,

    setCanvasMode(next) {
      mode = next;
      canvas2d.classList.toggle('hidden', mode !== '2d');
      canvasGl.classList.toggle('hidden', mode !== 'gl');
    },

    activeCanvas() {
      return mode === 'gl' ? canvasGl : canvas2d;
    },

    hideStartOverlay() {
      overlay.classList.add('hidden');
    },

    showStartError(msg: string) {
      big.textContent = 'CAMERA ERROR';
      sub.textContent = msg;
      pulse.style.background = '#ff5f57';
    },

    setActiveEffect(id: string) {
      for (const [fxId, btn] of fxButtons) {
        btn.classList.toggle('active', fxId === id);
      }
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
  };
}
