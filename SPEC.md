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
| 현재 상태 | M6 완료 — 멀티 프레임 제스처 프레이밍 (프레임마다 이펙트 고정·공존) |
| 다음 단계 | 실기기 검증 (M3/M4/M6 각주), 배포 |

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
│   ├── hands.ts             # MediaPipe 손 추적 → 파라미터 제어 (동적 로드)
│   ├── recorder.ts          # MediaRecorder 캔버스 녹화 (mp4/webm 분기)
│   ├── gl/
│   │   ├── context.ts       # WebGL2 컨텍스트, 텍스처 업로드 유틸
│   │   └── pipeline.ts      # 셰이더 컴파일, fullscreen quad, FBO 체인
│   └── effects/
│       ├── index.ts         # 이펙트 레지스트리 (아래 인터페이스 참조)
│       ├── raw.ts
│       ├── quadtree.ts      # CPU 계산 유지 (재귀 분할) + Canvas 2D 오버레이
│       ├── relief.ts/.frag  # 종이 양각 릴리프 (SKETCH 대체)
│       ├── wave.ts/.frag    # 행 sin 변위 + 블루 도트 디더
│       ├── riso.ts/.frag    # 초록/노랑/흰 포스터라이즈
│       ├── pointcloud.ts/.vert/.frag # gl.POINTS, 정점 셰이더에서 비디오 샘플링
│       ├── blueprint.ts/.frag # Bayer dither GLSL + 반전 토글 (CPU 폴백)
│       └── slitscan.ts/.frag # 60프레임 히스토리 텍스처 배열 시간 왜곡
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

- **멀티 프레임 모델 (M6)**: 양손 핀치로 프레임을 만들 때마다 순서상 다음
  이펙트가 배정되고, 손을 놓으면 그 프레임은 그 이펙트로 **영구 고정**된다.
  프레임들은 누적되어 여러 이펙트가 화면에 공존하며, 새 프레임이 기존
  프레임을 **완전히 포함하면 그 기존 프레임은 제거**된다(덮어쓰기).
  시간 기반 자동 순환은 없다 — 이펙트 순서는 새 프레임 생성 시에만 전진.
- 캔버스 탭 = 마지막 프레임 제거(undo). 프레임이 없으면 다음 이펙트 예약 변경.
- 이펙트 바(탭 UI)는 제거 — 다음에 배정될 이펙트가 트랜스포트 FX 라벨에 표시
- 모든 이펙트는 `beat` 값을 받아 템포(기본 120 BPM)에 동기화된 애니메이션 가능

## 5. 이펙트 명세

### 5.1 RAW / FRAME (합성 베이스로 흡수)
웹캠 미러 출력 + 흰색 프레임 사각형은 이제 별도 이펙트가 아니라 합성
파이프라인의 베이스 레이어다: 원본 영상이 항상 깔리고, 흰 프레임 사각형
내부에만 활성 이펙트가 잘라 붙는다 (M6 제스처 프레이밍).

### 5.2 QUADTREE MOSAIC (완료 — beat 연동)
- 128×N 샘플에서 영역 luma 분산 계산, 분산 > 임계값이면 4분할 재귀 (최대 depth 6, 최소 2px)
- 리프 노드는 평균색으로 채우고 얇은 검정 테두리
- 임계값이 **beat에 동기화**되어 1마디(4비트) 주기로 출렁임, 초록 패치도 beat 단위 이동
- 분할 계산은 CPU 유지 (렌더 비용이 지배적이지 않음)

### 5.3 RELIEF (신규 — SKETCH 대체)
- ~~SKETCH (Sobel → 반전 → 종이 톤)~~ 는 결과물이 아쉬워 v0.2에서 제거
- 미색 종이 위 좌상 광원 대각 릴리프(부호 있는 그래디언트), 채널별 강도
  차이로 엣지에 은은한 황록 색수차 + 옅은 종이 그레인 (레퍼런스 IMG_6360)
- GLSL 풀해상도, WebGL2 미지원 시 128 샘플 CPU 폴백

### 5.4 POINT CLOUD (완료 — gl.POINTS)
- 그리드 200×N (16:9 기준 22,400점 — M1 CPU 대비 ~10배), 정점 셰이더에서
  비디오 텍스처를 직접 샘플링해 luma 기반 점 크기/알파/파동 변위 계산
- 잔상 트레일: preserveDrawingBuffer 위에 반투명 검정 풀스크린 오버드로우
- 추가 파라미터: `pointcloudParams.wave` (파동 강도), `.trail` (트레일 길이)
- 활성 탭 재탭 = 파동 강도 프리셋 순환 (1.0 → 2.0 → 3.5 → 0.4)
- WebGL2 미지원 시 128 샘플 CPU 폴백

### 5.5 BLUEPRINT (완료 — GLSL + 반전 토글)
- 4×4 Bayer ordered dithering + 랜덤 노이즈, 듀오톤 (흰 `#eef4fa` / 청사진 파랑 `#16489e`)
- 파랑↔흰 반전 토글: **활성 BLUEPRINT 탭을 다시 탭** (원본 1번째 컷은 파란 배경에 흰 얼굴)
- WebGL2 미지원 시 128 샘플 CPU 폴백

### 5.6 WAVE (신규)
- 행 단위 다중 주파수 sin 변위 + 변위를 키워가며 max 누적한 에코 등고선
  (윤곽이 옆으로 반복되는 잔상), 4단계 블루 팔레트 도트 디더 (레퍼런스 IMG_6365)
- GLSL, WebGL2 미지원 시 128 샘플 CPU 폴백

### 5.7 RISO (신규)
- luma 4단계 포스터라이즈 → 짙은 초록/초록/노랑/흰 팔레트, 리소 인쇄풍
  강한 그레인, 채널 오프셋 차이로 엣지에 핑크/시안 판 어긋남 프린지
  (레퍼런스 IMG_6369)
- GLSL, WebGL2 미지원 시 128 샘플 CPU 폴백

### 5.8 SLIT-SCAN (완료)
- 480×270×60 `TEXTURE_2D_ARRAY` 링 버퍼(~31MB) — 매 프레임 videoTex를
  FBO로 현재 레이어에 다운스케일 복사 (CPU 재업로드 없음)
- 행마다 다른 과거 프레임 샘플링 (위=현재 → 아래=과거) + beat 동기 물결,
  인접 레이어 보간으로 시간축 부드럽게 — TouchDesigner cache TOP의 웹 재현
- 이펙트를 떠나면 히스토리 텍스처 해제 (메모리 절약)
- WebGL2 미지원 시 128 샘플 히스토리 CPU 폴백

## 6. UI 명세

**화이트 톤 모노크롬 + TV 유닛 레이아웃**: 흰 배경 중앙에 카메라 뷰
크기의 검정 베젤 유닛이 떠 있고, 유닛 안에 타이틀바 → 스크린(카메라 뷰)
→ 타임라인 → 트랜스포트 바가 세로로 붙어 있다. **디자인 토큰:**

```
--bg:#f4f4f2 (페이지)  --panel:#ffffff  --panel2:#ececec  --line:#dcdcdc
--accent:#141414 (베젤/액센트/타임라인)  LCD: 검정 칩 + 흰 글자
폰트: SF Mono / Menlo (시스템 모노스페이스)
```

- 컬러 액센트 없음 — 활성 상태는 반전(검정 배경+흰 글자)과 점멸로 표현
- 신호등: 그레이 스케일 3단계. 녹화 중: 버튼 반전 + 타임코드 점멸
- 프레임 테두리(캔버스 안): 조정 중 흰 점선, 고정 흰 실선. 손 감지: ✋ 반전

- **타이틀바**: mac 신호등 + `/project1/null8 (128,128)` 경로 표시
- **이펙트 프레임**: 양손 엄지+검지 핀치로 사각형 생성 (조정 중 오렌지
  테두리, 고정되면 흰색). 내부만 이펙트, 바깥은 원본 영상.
  프레임마다 이펙트가 고정되어 여러 프레임이 공존한다
- **트랜스포트 바**: `Timecode HH:MM:SS:FF (60fps)` / 프레임 카운터 / 재생·정지 / FX 라벨 / FPS / Tempo / 📷 스냅샷
- **녹화 버튼** (●) — 녹화 중 타임코드 빨강 점멸. 별도 합성 캔버스를
  캡처하므로 녹화 중 2D↔WebGL 이펙트를 전환해도 끊기지 않는다
- **카메라 전환 버튼** (⇄) — facingMode user ↔ environment, 실패 시 이전
  카메라로 자동 복귀
- **손 추적 버튼** (✋) — 탭하면 MediaPipe 번들+모델을 동적 로드 (로딩 중
  점멸, 활성 오렌지, 손 감지 시 초록). 다시 탭하면 해제

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
| M3 | 포인트 클라우드 WebGL 인스턴싱 | 점 20,000개 이상 30fps (iPad) | ✅* |
| M4 | 녹화(MediaRecorder) + 카메라 전환 | iOS에서 mp4 저장 확인 | ✅** |
| M5 | slit-scan 추가, beat 동기화 파라미터 | §5.8 명세 충족 | ✅ |
| M6 | MediaPipe 양손 핀치 프레이밍 — 프레임마다 이펙트 고정·공존 | 핀치로 프레임 생성, 복수 프레임에 서로 다른 이펙트 공존 | ✅*** |

\* M3 iPad 30fps는 실기기 미검증 (개발 환경에 GPU 없음). 22,400점 단일
드로우콜 + 정점 텍스처 페치 구조라 모바일 GPU에서 충분할 것으로 예상.

\*\* M4 iOS 실기기 저장은 미검증. 크로미엄 헤드리스에서 mp4
(avc1) 녹화·다운로드 확인 완료. isTypeSupported 분기가 iOS 사파리에서
video/mp4를 선택하도록 구현되어 있음 — 실기기(HTTPS) 확인 필요.

\*\*\* M6 구현: hand_landmarker(float16, 양손) 셀프 호스팅
(public/mediapipe/ — wasm은 predev/prebuild가 node_modules에서 복사),
카메라 시작 시 자동 활성화(✋ 버튼으로 끄기 가능), 검출 ~15Hz 스로틀,
GPU delegate 실패 시 CPU 폴백. 핀치 판정: 엄지 끝(4)-검지 끝(8) 거리를
손 크기(0↔9)에 상대화, 핀치 해제 400ms 디바운스로 검출 깜빡임 흡수.
양손 핀치 중에는 두 핀치 지점이 프레임의 대각 모서리가 되어 부드럽게
(lerp) 따라오고, 놓으면 고정된다. 프레임별 이펙트 공존을 위해 POINT
CLOUD 트레일은 전용 FBO에 누적(공유 캔버스와 분리)하고, 어떤 프레임에도
쓰이지 않는 이펙트는 dispose로 해제(SLIT-SCAN 히스토리 등). 손 추적
로드 실패 시 기본 중앙 프레임 1개로 폴백. 멀티 프레임 합성·포함 규칙·
undo는 헤드리스 검증 완료(디버그 훅 `window.__null8`), 실제 핀치 제스처
반응은 실기기 확인 필요 (가짜 카메라에는 손이 없음).

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
