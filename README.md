# null8 — Webcam FX

TouchDesigner 스타일 실시간 웹캠 비주얼 이펙트 웹앱.
Vite + TypeScript, Canvas 2D (M1) → WebGL2 (M2+).

## 이펙트

| 탭 | 설명 |
|---|---|
| RAW / FRAME | 웹캠 미러 출력 + 흰색 프레임 오버레이 |
| QUADTREE MOSAIC | luma 분산 기반 재귀 4분할 모자이크, 초록 패치 오마주 |
| RELIEF | 미색 종이 양각 릴리프, 엣지 황록 색수차 + 그레인 |
| WAVE | 행 sin 변위 에코 등고선 + 블루 도트 디더 |
| RISO | 초록/노랑/흰 4단계 포스터라이즈, 그레인 + 판 어긋남 프린지 |
| POINT CLOUD | 22,000+점 `gl.POINTS`, sin 파동, 시안-블루, 잔상 트레일 — 재탭 = 파동 강도 순환 |
| BLUEPRINT | 4×4 Bayer 디더링 듀오톤 — 활성 탭 재탭 = 파랑↔흰 반전 |

## 조작

- **캔버스 탭**: 다음 이펙트로 전환
- **하단 이펙트 바**: 직접 선택 (활성 탭 재탭 = 변형 토글: BLUEPRINT 반전, POINT CLOUD 파동 강도)
- **트랜스포트 바**: 재생/정지, ● 녹화(mp4/webm 자동 분기), Tempo(BPM) 탭 변경, ⇄ 카메라 전환, 📷 스냅샷 저장

## 개발

```bash
npm i
npm run dev        # localhost — getUserMedia는 HTTPS 또는 localhost에서만 동작
npm run typecheck
npm run build
```

실기기(모바일) 테스트는 HTTPS가 필요하므로 `vite-plugin-mkcert` 또는 Netlify/Vercel 배포로 확인한다.

전체 명세는 [SPEC.md](./SPEC.md) 참조.
