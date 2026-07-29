# null8 — Webcam FX

**▶ 데모: https://ekby0104.github.io/touch-designer/**
(데스크톱/모바일 브라우저에서 바로 실행 — 카메라 권한만 허용하면 됩니다)

TouchDesigner 스타일의 실시간 웹캠 비주얼 이펙트 웹앱.
손 제스처만으로 화면 위에 이펙트 영역을 "그려서" 연주하는 인터랙티브 툴입니다.
서버 없이 브라우저에서만 동작합니다 (WebGL2 + MediaPipe Hands).

## 사용법

1. **TAP TO START** → 카메라 허용. 손 추적은 자동으로 켜집니다 (✋ 버튼 점멸 → 활성)
2. 손을 들면 **엄지·검지 끝에 흰 원**이 표시됩니다
3. 손가락을 오므려 **두 원이 겹치면 파란색** = 핀치 인식
4. **양손을 동시에 핀치**하면 두 손 위치가 사각형의 대각 모서리가 되어
   프레임이 따라옵니다 (흰 점선) — 손을 놓으면 그 자리에 고정 (흰 실선)
5. 프레임마다 **다음 이펙트가 배정되어 영구 고정**되고, 프레임들이 누적되어
   **여러 이펙트가 화면에 공존**합니다
6. 새 프레임이 기존 프레임을 완전히 덮으면 기존 프레임은 제거되고,
   **캔버스를 탭하면 마지막 프레임이 취소**됩니다
7. 화면 가장자리 근처에서 핀치하면 프레임이 화면 끝까지 스냅됩니다

## 이펙트 (배정 순서)

| 이펙트 | 설명 |
|---|---|
| QUADTREE MOSAIC | luma 분산 기반 재귀 4분할 모자이크 — 임계값이 beat에 맞춰 호흡 |
| RELIEF | 미색 종이 양각 릴리프, 엣지 황록 색수차 + 그레인 |
| WAVE | 행 sin 변위 에코 등고선 + 블루 도트 디더 |
| RISO | 초록/노랑/흰 4단계 포스터라이즈, 그레인 + 판 어긋남 프린지 |
| POINT CLOUD | 22,000+점 `gl.POINTS`, sin 파동, 시안-블루 팔레트, 잔상 트레일 |
| BLUEPRINT | 4×4 Bayer 디더링 듀오톤 — 재방문마다 파랑↔흰 반전 |
| SLIT-SCAN | 60프레임 히스토리, 행마다 다른 과거 프레임 — 시간 왜곡 + beat 물결 |

## 트랜스포트 바

카메라 뷰 바로 아래에 붙어 있습니다 (TV 유닛 레이아웃):

**FX**(다음 배정 이펙트) · **PAUSE/PLAY** · **PHOTO CAPTURE**(PNG 저장) ·
**RECORD START/STOP**(mp4/webm 자동 분기) · **REC**(녹화 경과, 점멸) ·
**F**(프레임 카운터) · **FPS** · **TEMPO**(탭으로 BPM 변경 — beat 연동
이펙트 속도가 따라감) · **✋**(손 추적 on/off) · **⇄**(전/후면 카메라 전환)

## 기술

- **Vite + TypeScript**, 프레임워크 없는 vanilla DOM
- **WebGL2** fragment shader 이펙트 (미지원 브라우저는 128px CPU 폴백)
- **MediaPipe Hands** (tasks-vision) — 양손 21 랜드마크, 셀프 호스팅
  (wasm은 빌드 시 node_modules에서 복사, 모델은 레포에 포함)
- **MediaRecorder** 캔버스 녹화 — iOS는 mp4, 그 외 webm 자동 선택
- 이펙트별 격리: POINT CLOUD 트레일은 전용 FBO, SLIT-SCAN 히스토리는
  480×270×60 `TEXTURE_2D_ARRAY` (이펙트를 떠나면 해제)

## 개발

```bash
npm i
npm run dev        # localhost — getUserMedia는 HTTPS 또는 localhost에서만 동작
npm run typecheck  # tsc --noEmit
npm run build      # dist/ 정적 빌드
```

배포는 이 브랜치에 푸시하면 GitHub Actions가 자동으로 빌드해서
GitHub Pages(`gh-pages` 브랜치)로 올립니다.

전체 명세와 마일스톤은 [SPEC.md](./SPEC.md) 참조.
