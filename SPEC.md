# 개발 명세서 — Webcam FX (프로젝트명: null8)

TouchDesigner 스타일 실시간 웹캠 비주얼 이펙트 웹앱.
레퍼런스: Instagram @wxll.hx 의 TouchDesigner 웹캠 이펙트 영상 (쿼드트리 모자이크 / 스케치 / 포인트 클라우드 / 청사진).

---

## 1. 개요

| 항목 | 내용 |
|---|---|
| 목표 | 웹캠 입력에 실시간 비주얼 이펙트를 적용하고, TouchDesigner UI 감성의 트랜스포트 바로 제어하는 SPA |
| 타깃 환경 | 데스크톱/모바일 사파리·크롬 (iOS 17+, iPadOS 포함) |
| 배포 | 정적 호스팅 (Netlify / GitHub Pages / Vercel) — HTTPS 필수 (getUserMedia 제약) |
| 현재 상태 | M2 완료 — WebGL 파이프라인, SKETCH/BLUEPRINT 풀해상도 셰이더 |
| 다음 단계 | 포인트 클라우드 인스턴싱(M3) → 녹화 기능(M4) |

## 2. 기술 스택

- **v0.1**: Vanilla JS + Canvas 2D, 단일 HTML 파일, 의존성 없음
- **v1.0 (목표)**: Vite + TypeScript + WebGL2 (fragment shader 기반 이펙트)
  - 셰이더 이펙트는 GLSL로 작성, 프레임워크 없이 raw WebGL2 또는 `regl` 경량 라이브러리 사용
  - UI는 프레임워크 없이 유지 (DOM 조작 최소) — 규모가 커지면 Preact 검토
- **선택 확장**: MediaPipe Hands (손 추적 인터랙션), MediaRecorder API (영상 녹화)

## 3. 프로젝트 구조 (v1.0)

```
null8/
├── index.html
├── vite.config.ts
├── src/
│   ├── main.ts              # 부트스트랩, 카메라 초기화, 렌더 루프
│   ├── camera.ts            # getUserMedia 래퍼 (facingMode 전환 포함)
│   ├── transport.ts         # 타임코드/프레임/FPS/재생 상태 관리
│   ├── ui.ts                # 타이틀바, 이펙트 바, 트랜스포트 바 DOM
│   ├── recorder.ts          # MediaRecorder 캔버스 녹화 (webm/mp4) — M4
│   ├── gl/
│   │   ├── context.ts       # WebGL2 컨텍스트, 텍스처 업로드 유틸
│   │   └── pipeline.ts      # 셰이더 컴파일, fullscreen quad, FBO 체인
│   └── effects/
│       ├── index.ts         # 이펙트 레지스트리 (아래 인터페이스 참조)
│       ├── raw.ts
│       ├── quadtree.ts      # CPU 계산 유지 (재귀 분할) + Canvas 2D 오버레이
│       ├── sketch.ts/.frag  # Sobel GLSL (WebGL2 미지원 시 CPU 폴백)
│       ├── pointcloud.ts    # WebGL 포인트 인스턴싱 (gl.POINTS) — M3
│       ├── blueprint.ts/.frag # Bayer dither GLSL + 반전 토글 (CPU 폴백)
│       └── slitscan.frag    # 신규 (§5) — M5
└── public/
```

## 4. 핵심 인터페이스

```ts
interface Effect {
  id: string;
  name: string;                       // UI 표시명 (예: "QUADTREE MOSAIC")
  init(gl: GL, ctx2d: CanvasRenderingContext2D): void;
  render(frame: FrameData): void;     // 매 프레임 호출
  dispose(): void;
}

interface FrameData {
  videoTex: WebGLTexture;   // 웹캠 텍스처 (매 프레임 업로드)
  sample: ImageData;        // 128×N 저해상도 샘플 (CPU 이펙트용)
  time: number;             // 초 단위 경과 시간
  frame: number;            // 프레임 카운터
  beat: number;             // time * BPM/60 (템포 연동 파라미터용)
}
```

- 이펙트 전환: 캔버스 탭 = 다음 이펙트, 하단 바 = 직접 선택 (v0.1 동작 유지)
- 모든 이펙트는 `beat` 값을 받아 템포(기본 120 BPM)에 동기화된 애니메이션 가능

## 5. 이펙트 명세

### 5.1 RAW / FRAME (완료)
웹캠 미러 출력 + 흰색 프레임 사각형 오버레이.

### 5.2 QUADTREE MOSAIC (완료 → 개선)
- 128×N 샘플에서 영역 luma 분산 계산, 분산 > 임계값이면 4분할 재귀 (최대 depth 6, 최소 2px)
- 리프 노드는 평균색으로 채우고 얇은 검정 테두리
- 임계값이 `sin(time)`으로 출렁임 → **개선: beat 연동으로 변경 (M5)**
- 원본 오마주 초록 패치 유지
- v1.0: 분할 계산은 CPU 유지, 렌더만 개선 (렌더 비용이 지배적이지 않음)

### 5.3 SKETCH (완료 — GLSL 풀해상도)
- Sobel 엣지 검출 → 반전 → 종이 톤 (250 기준 미색)
- fragment shader 풀해상도 처리, WebGL2 미지원 시 128 샘플 CPU 폴백

### 5.4 POINT CLOUD (완료 → WebGL 이식)
- step 2 그리드 샘플, luma 기반 점 크기/알파, sin 파동 변위, 시안-블루 팔레트
- 잔상 트레일: 반투명 검정 오버드로우
- v1.0: `gl.POINTS` 인스턴싱으로 이식 → 점 개수 10배 (원본 영상의 밀도 재현)
- 추가 파라미터: 파동 강도, 트레일 길이

### 5.5 BLUEPRINT (완료 — GLSL + 반전 토글)
- 4×4 Bayer ordered dithering + 랜덤 노이즈, 듀오톤 (흰 `#eef4fa` / 청사진 파랑 `#16489e`)
- 파랑↔흰 반전 토글: **활성 BLUEPRINT 탭을 다시 탭** (원본 1번째 컷은 파란 배경에 흰 얼굴)
- WebGL2 미지원 시 128 샘플 CPU 폴백

### 5.6 SLIT-SCAN (신규 — M5)
- 프레임 히스토리 버퍼 (최근 60프레임 텍스처 배열)에서 행마다 다른 과거 프레임 샘플링
- 시간 왜곡 효과 — TouchDesigner cache TOP 워크플로우의 웹 재현

## 6. UI 명세

TouchDesigner 다크 테마를 유지한다. **디자인 토큰:**

```
--bg:#141416  --panel:#232327  --panel2:#2c2c31  --line:#3a3a40
--orange:#e8a33d (액센트/타임라인)  --lcd:#e6f0e8 (타임코드)
폰트: SF Mono / Menlo (시스템 모노스페이스)
```

- **타이틀바**: mac 신호등 + `/project1/null8 (128,128)` 경로 표시
- **이펙트 바**: 하단 탭, 활성 탭은 오렌지 언더라인
- **트랜스포트 바**: `Timecode HH:MM:SS:FF (60fps)` / 프레임 카운터 / 재생·정지 / FPS / Tempo / 📷 스냅샷
- 신규 (M4): **녹화 버튼** (●) — 녹화 중 타임코드 빨강 점멸
- 신규 (M4): **카메라 전환 버튼** — facingMode user ↔ environment

## 7. 성능 요구사항

- 목표: iPhone/iPad 사파리에서 30fps 이상, 데스크톱 60fps
- CPU 이펙트 샘플 해상도 128 고정 (원본 컨셉 유지 + 성능 확보)
- `getImageData`는 프레임당 1회, `willReadFrequently: true` 유지
- WebGL 텍스처 업로드는 `texSubImage2D` 재사용, 매 프레임 텍스처 재생성 금지
- devicePixelRatio 상한 2

## 8. 브라우저 제약 (필수 준수)

- getUserMedia는 **HTTPS 또는 localhost에서만** 동작 — 개발은 `vite dev` (localhost), 실기기 테스트는 **HTTPS 터널(예: `vite-plugin-mkcert`) 또는 Netlify 배포**로 확인
- iOS 사파리: `video.playsInline = true` 필수, 재생은 사용자 제스처 이후
- iOS MediaRecorder: `video/mp4` 지원 여부 분기 (`MediaRecorder.isTypeSupported`)
- 카메라 미러링: 전면 카메라만 좌우 반전, 후면은 반전 없음

## 9. 마일스톤

| 단계 | 내용 | 완료 기준 | 상태 |
|---|---|---|---|
| M1 | Vite+TS 구조화, 이펙트 5종 (Canvas 2D) | 기존과 동일 동작, 타입 에러 0 | ✅ |
| M2 | WebGL 파이프라인 + sketch/blueprint 셰이더 이식 | 풀해상도에서 60fps (데스크톱) | ✅ |
| M3 | 포인트 클라우드 WebGL 인스턴싱 | 점 20,000개 이상 30fps (iPad) | |
| M4 | 녹화(MediaRecorder) + 카메라 전환 | iOS에서 mp4 저장 확인 | |
| M5 | slit-scan 추가, beat 동기화 파라미터 | 5.6 명세 충족 | |
| M6 | (선택) MediaPipe 손 추적 — 손 위치로 이펙트 파라미터 제어 | 손 흔들면 파동 강도 변화 | |

## 10. 개발 커맨드

```bash
npm i
npm run dev        # localhost 개발 서버
npm run typecheck  # tsc --noEmit
npm run build      # tsc + vite build → dist/
```

## 11. 비범위 (v1.0에서 제외)

- 계정/저장 서버, 이펙트 프리셋 공유
- TouchDesigner 파일(.toe) 호환
- 오디오 반응 (v2 후보 — Web Audio AnalyserNode로 실제 음악 비트 연동)
