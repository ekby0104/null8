# null8 — Webcam FX

TouchDesigner 스타일 실시간 웹캠 비주얼 이펙트 웹앱.
Vite + TypeScript, Canvas 2D (M1) → WebGL2 (M2+).

## 동작 방식

화면에는 항상 원본 웹캠이 깔리고, **흰 사각형 프레임 내부에만 이펙트가
적용**된다. 이펙트는 8비트(2마디)마다 자동 순환한다.

**양손 엄지+검지를 맞대는 핀치 제스처**를 하면 두 손 위치가 프레임의 대각
모서리가 되어 프레임이 따라오고(오렌지 테두리), 손을 놓으면 그 자리에
고정된다(흰 테두리). 손 추적은 시작 시 자동으로 켜진다.

## 이펙트 (자동 순환 순서)

| 이펙트 | 설명 |
|---|---|
| QUADTREE MOSAIC | luma 분산 기반 재귀 4분할 모자이크 — 임계값이 beat에 맞춰 호흡 |
| RELIEF | 미색 종이 양각 릴리프, 엣지 황록 색수차 + 그레인 |
| WAVE | 행 sin 변위 에코 등고선 + 블루 도트 디더 |
| RISO | 초록/노랑/흰 4단계 포스터라이즈, 그레인 + 판 어긋남 프린지 |
| POINT CLOUD | 22,000+점 `gl.POINTS`, sin 파동, 시안-블루, 잔상 트레일 |
| BLUEPRINT | 4×4 Bayer 디더링 듀오톤 — 재방문마다 파랑↔흰 반전 |
| SLIT-SCAN | 60프레임 히스토리, 행마다 다른 과거 프레임 — 시간 왜곡 + beat 물결 |

## 조작

- **캔버스 탭**: 즉시 다음 이펙트
- **양손 핀치**: 이펙트 프레임 설정
- **트랜스포트 바**: 재생/정지, ● 녹화(mp4/webm 자동 분기), FX 라벨(현재 이펙트), Tempo(BPM) 탭 변경, ✋ 손 추적 on/off, ⇄ 카메라 전환, 📷 스냅샷 저장

## 개발

```bash
npm i
npm run dev        # localhost — getUserMedia는 HTTPS 또는 localhost에서만 동작
npm run typecheck
npm run build
```

실기기(모바일) 테스트는 HTTPS가 필요하므로 `vite-plugin-mkcert` 또는 Netlify/Vercel 배포로 확인한다.

전체 명세는 [SPEC.md](./SPEC.md) 참조.
