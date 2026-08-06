# null8 — Claude 작업 지침

TouchDesigner 스타일 실시간 웹캠 이펙트 앱. Vite + TypeScript + WebGL2 + MediaPipe Hands.

## 문서

- `SPEC.md` — 제품 명세와 마일스톤 (M1-M6 완료)
- `AIRDRAW.md` — 공중 낙서 레이어 명세 (A1-A2 완료, §13에 확정된 제스처 설계)
- `DESIGN.md` — **디자인 시스템. UI를 만들거나 수정할 때 반드시 이 규칙을 따른다**
  (화이트 톤 모노크롬, TV 유닛 레이아웃, 반전·점멸 상태 표현, 기능색은 파랑/초록만)

## 원칙

- 디자인 변경 시 DESIGN.md 토큰/규칙을 벗어나지 않는다. 새 컬러 도입 금지
- UI 문자열은 `src/ui.ts`의 STR(한/영)에 추가한다 — 하드코딩 금지
- 제스처/핀치 판정은 `src/hands.ts` 하나로 통합되어 있다. 별도 판정 로직을 만들지 않는다
- 성능 규칙: SPEC §7 (128 샘플, dpr≤2, 텍스처 재사용) / AIRDRAW §9 (ink 증분 렌더)

## 명령

```bash
npm run dev / typecheck / build
```

배포: 이 브랜치에 푸시하면 GitHub Actions가 gh-pages로 자동 배포.
라이브: https://yuemyname.github.io/null8/
