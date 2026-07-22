// 이펙트 레지스트리 + 핵심 인터페이스 (SPEC §4)

import { raw } from './raw.ts';
import { quadtree } from './quadtree.ts';
import { sketch } from './sketch.ts';
import { pointcloud } from './pointcloud.ts';
import { blueprint } from './blueprint.ts';

/** M1(Canvas 2D)에서는 WebGL 컨텍스트가 없다. M2에서 WebGL2RenderingContext로 채워진다. */
export type GL = WebGL2RenderingContext | null;

export interface FrameData {
  /** 웹캠 텍스처 — M2(WebGL 파이프라인)에서 업로드된다. M1은 null. */
  videoTex: WebGLTexture | null;
  /** 128×N 저해상도 샘플 (CPU 이펙트용, 미러링 반영 완료) */
  sample: ImageData;
  /** 풀해상도 소스 — M1 Canvas 2D 이펙트의 직접 드로우용 */
  video: HTMLVideoElement;
  /** 전면 카메라 여부에 따른 좌우 반전 플래그 */
  mirror: boolean;
  /** 초 단위 경과 시간 */
  time: number;
  /** 프레임 카운터 */
  frame: number;
  /** time * BPM/60 — 템포 연동 파라미터용 */
  beat: number;
}

export interface Effect {
  id: string;
  /** UI 표시명 (예: "QUADTREE MOSAIC") */
  name: string;
  init(gl: GL, ctx2d: CanvasRenderingContext2D): void;
  /** 매 프레임 호출 */
  render(frame: FrameData): void;
  dispose(): void;
}

export const effects: Effect[] = [raw, quadtree, sketch, pointcloud, blueprint];

/** r/g/b(0-255) → 지각 luma(0-255) */
export function luma(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
