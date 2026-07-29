# AIRDRAW.md — null8 공중 낙서 레이어

> SPEC.md의 M6(MediaPipe 손 추적)에 이어지는 기능 명세.
> 손가락으로 허공에 그림을 그리고, 그 그림이 이펙트 위에 남는다.

---

## 1. 목표

핀치(엄지+검지) 제스처로 화면 위에 선을 그린다. 손을 떼면 획이 끝나고, 그려진 선은 화면에 계속 남는다.

**완료 기준**
- 핀치하고 손을 움직이면 끊김 없는 매끄러운 선이 그려진다
- 손을 벌리면 선이 끊긴다. 의도치 않은 끊김/이어짐이 10초 그리기 중 1회 이하
- 이펙트 어느 것을 켜도 그림이 그 위에 정상 합성된다
- iPad Safari에서 획 5,000점 누적 상태로 30fps 유지

---

## 2. 아키텍처상 위치 — 이펙트가 아니라 **레이어**

공중 낙서는 `Effect` 인터페이스로 만들지 **않는다**. 이펙트는 프레임별로 배정되지만, 낙서는 어떤 이펙트 위에도 얹혀야 하기 때문이다.

```
src/
  layers/
    airdraw.ts        # 펜 상태 머신 + 스트로크 관리 + ink 캔버스
    airdraw-ui.ts     # 색/두께/undo/clear/저장 컨트롤
  core/
    coords.ts         # cover-fit + 미러 좌표 변환 (손 추적과 공용)
```

**프레임 렌더 순서**
```
1. video 프레임 획득
2. 활성 Effect 렌더 → main canvas
3. airdraw.composite(mainCtx)      ← ink 캔버스를 통째로 drawImage
4. airdraw.drawCursor(mainCtx)     ← 손끝 표시(기존 흰 테두리 원 재사용)
```

손 추적 결과(`HandLandmarkerResult`)는 **기존 파이프라인에서 이미 계산된 것을 그대로 받아 쓴다.** `detectForVideo`를 추가로 호출하지 말 것.

---

## 3. 좌표계 (여기서 제일 많이 틀린다)

MediaPipe 랜드마크는 **비디오 프레임 기준 [0,1] 정규화 좌표**다. 캔버스는 stage 크기에 맞춰 cover-fit으로 비디오를 그리므로, 랜드마크를 그대로 `* canvas.width` 하면 어긋난다.

```ts
export function coverRect(vw: number, vh: number, cw: number, ch: number) {
  const s = Math.max(cw / vw, ch / vh);
  const w = vw * s, h = vh * s;
  return { x: (cw - w) / 2, y: (ch - h) / 2, w, h };
}

export function toCanvas(lm: {x:number; y:number}, r: Rect, mirrored: boolean) {
  const nx = mirrored ? 1 - lm.x : lm.x;
  return { x: r.x + nx * r.w, y: r.y + lm.y * r.h };
}
```

- `mirrored`는 SPEC §8 규칙을 따른다 — **전면 카메라만 true**
- `coverRect`는 이펙트 렌더에서 쓰는 것과 **반드시 같은 함수**여야 한다. 두 군데서 각자 계산하면 그림이 영상과 미묘하게 어긋난다

---

## 4. 핀치 판정

### 4.1 정규화된 비율을 쓴다

엄지-검지 픽셀 거리를 그대로 임계값과 비교하면, 손이 카메라에 가까워질 때마다 오작동한다. **손 크기로 나눈 비율**을 쓴다.

```ts
// 손바닥 폭: 검지 MCP(5) ↔ 새끼 MCP(17)
// 손목(0) 기준보다 안정적 — 손가락을 구부려도 값이 거의 안 변한다
const palm  = distPx(lm[5], lm[17]);
const pinch = distPx(lm[4], lm[8]);   // 엄지 끝 ↔ 검지 끝
const ratio = pinch / Math.max(palm, 1e-6);
```

`distPx`는 정규화 좌표에 **프레임의 실제 w/h를 각각 곱한 뒤** 거리를 잰다. 프레임이 정사각형이 아니므로 정규화 좌표에서 바로 `hypot`을 하면 세로 방향 거리가 왜곡된다.

```ts
const distPx = (a, b) => Math.hypot((a.x - b.x) * frameW, (a.y - b.y) * frameH);
```

### 4.2 히스테리시스 + 디바운스

단일 임계값을 쓰면 경계 근처에서 선이 점선처럼 끊긴다.

```
펜 내림(pen down): ratio < 0.40  이 상태가 2프레임 연속
펜 올림(pen up)  : ratio > 0.60  이 상태가 2프레임 연속
```

두 임계값 사이(0.40~0.60)에서는 **직전 상태를 유지**한다.

### 4.3 펜 촉 위치

검지 끝(8)이 아니라 **엄지 끝과 검지 끝의 중점**을 쓴다. 핀치할 때 검지 끝 자체가 안쪽으로 이동하기 때문에, 8번만 쓰면 펜을 내리는 순간 커서가 툭 튄다. 중점을 쓰면 실제로 펜을 쥔 것 같은 감각이 난다.

```ts
const nib = midpoint(toCanvas(lm[4], r, mirrored), toCanvas(lm[8], r, mirrored));
```

---

## 5. 스트로크 자료구조와 양손 처리

```ts
type Pt = { x: number; y: number; w: number };
type Stroke = { color: string; pts: Pt[] };

type PenState = {
  down: boolean;
  onFrames: number;     // 임계값 통과 연속 프레임 수
  offFrames: number;
  ema: { x: number; y: number } | null;
  width: number;
  stroke: Stroke | null;
};

const pens = new Map<string, PenState>();   // key: handedness ("Left" | "Right")
const strokes: Stroke[] = [];
```

- 양손이 각자 독립적으로 그린다. `numHands: 2`
- 키는 `result.handednesses[i][0].categoryName`을 쓴다. 배열 인덱스는 프레임마다 순서가 바뀔 수 있어 획이 뒤섞인다
- **이번 프레임에 안 보인 손은 획을 종료**한다. 손이 화면 밖으로 나갔는데 펜이 내려간 채로 남으면, 다시 들어올 때 화면을 가로지르는 직선이 생긴다

---

## 6. 스무딩과 선 두께

```ts
// 1) 위치 EMA
pen.ema.x += (nib.x - pen.ema.x) * 0.5;
pen.ema.y += (nib.y - pen.ema.y) * 0.5;

// 2) 너무 촘촘한 점 버리기 (1.5px 미만이면 무시)
if (dist(pen.ema, lastPt) < 1.5) return;

// 3) 속도 기반 두께 — 느리게 그으면 굵고, 빠르게 그으면 가늘게
const t = Math.min(1, speed / 40);
const target = baseWidth * (1 - 0.55 * t);
pen.width += (target - pen.width) * 0.3;
```

3번은 없어도 동작하지만, 이게 있으면 선이 확연히 "손으로 그린 것" 같아진다. A3에서 붙인다.

---

## 7. 렌더링 — ink 캔버스에 증분으로 그린다

**매 프레임 전체 스트로크를 다시 그리지 않는다.** 점이 쌓일수록 O(n)으로 느려져서 iPad에서 금방 무너진다.

- 화면과 같은 크기의 오프스크린 `inkCanvas`를 하나 유지
- 새 점이 추가될 때만 **마지막 한 조각**을 ink에 덧그린다
- 매 프레임 합성은 `drawImage(inkCanvas, 0, 0)` 한 번 — O(1)

### 증분 곡선 (중점 이차 베지어)

점 3개가 모일 때마다, `p0-p1` 중점에서 `p1-p2` 중점까지 `p1`을 제어점으로 하는 이차 곡선을 그린다. 이러면 전체 경로를 다시 계산하지 않고도 곡선이 매끄럽게 이어진다.

```ts
const m0 = mid(p0, p1), m1 = mid(p1, p2);
ictx.beginPath();
ictx.lineWidth = p1.w;
ictx.moveTo(m0.x, m0.y);
ictx.quadraticCurveTo(p1.x, p1.y, m1.x, m1.y);
ictx.stroke();
```

`lineCap`/`lineJoin`은 `'round'` 고정. 조각 사이의 미세한 틈을 둥근 캡이 메워준다.

- 점이 1개뿐인 획(툭 찍은 점) → 반지름 `w/2` 원으로 채운다
- 점이 2개 → 직선

### 전체 재그리기(`redrawInk()`)가 필요한 경우

undo / clear / 리사이즈. 이 세 가지에서만 호출한다.

---

## 8. UI

SPEC §6의 디자인 토큰을 그대로 따른다. 트랜스포트 위에 낙서 툴바를 한 줄 추가.

| 컨트롤 | 동작 |
|---|---|
| 색 스와치 5개 | `#ffffff` `#141414` `#8a8a8a` `#1f6bff` `#9cc3ff` (화이트 톤 + 파랑 액센트 디자인 기준) |
| 두께 슬라이더 | `baseWidth` 2~24px |
| ↩ 되돌리기 | 마지막 획 제거 후 `redrawInk()` |
| ✕ 전체 지우기 | `strokes = []`, ink 클리어 |
| ⬇ 저장 | 합성된 main 캔버스를 PNG로 |
| 🎥 배경 끄기 | 비디오 대신 `--bg`로 채워서 그림만 보기 |

**커서 표시** — 기존 손가락 흰 테두리 원을 재사용하되 상태를 반영한다.
- 펜 올림: 흰 테두리 빈 원
- 펜 내림: 현재 잉크 색으로 채워진 원 + 반지름을 현재 선 두께에 비례
- 엄지 끝 ↔ 검지 끝을 잇는 얇은 선을 그려서 핀치 정도를 눈으로 보이게 한다

**디버그 모드** (`?debug=1`) — 손별로 `ratio` 값과 펜 상태를 모노스페이스로 표시. §4.2 임계값 튜닝에 필요하다. iPad에서 실제로 손을 흔들어 보면서 숫자를 봐야 값이 맞춰진다.

---

## 9. 성능

- ink 캔버스 전체 재그리기는 undo/clear/리사이즈에서만
- 총 점 개수 20,000점 상한. 넘으면 가장 오래된 획부터 버린다 (버릴 때만 `redrawInk()`)
- `inkCanvas`의 컨텍스트에 `willReadFrequently`를 **주지 않는다** — 읽지 않고 쓰기만 하므로, 주면 GPU 가속이 빠진다
- DPR 상한 2 (SPEC §7 동일)

---

## 10. iOS / 브라우저 제약

- 리사이즈·화면 회전 시 캔버스 크기가 바뀌면 ink 내용이 날아간다. 저장된 점 좌표에 `newW/oldW`, `newH/oldH`를 곱한 뒤 `redrawInk()`
- 회전은 종횡비가 바뀌므로 그림이 늘어난다. v1에서는 감수하고, 회전 시 "그림이 조정됨" 토스트만 띄운다
- PNG 저장은 `<a download>` + `toDataURL('image/png')`. iOS Safari에서는 새 탭으로 열려서 길게 눌러 저장하는 흐름이 될 수 있음
- 나머지는 SPEC §8 동일 (HTTPS, `playsInline`, 사용자 제스처 이후 재생)

---

## 11. 마일스톤

| 단계 | 내용 | 완료 기준 | 상태 |
|---|---|---|---|
| A1 | `coords.ts` 좌표 변환 + 펜 촉 커서 표시 | 손끝 원이 실제 손가락과 정확히 겹침. 그리기는 아직 없음 | ✅ |
| A2 | 핀치 상태 머신 + ink 증분 그리기 | 핀치하고 움직이면 선이 그려짐. `?debug=1`로 ratio 확인 가능 | ✅ |
| A3 | EMA 스무딩 + 속도 기반 두께 | 선의 지터가 눈에 띄지 않음 | |
| A4 | 툴바 (색/두께/undo/clear/저장/배경) | 전부 동작, 레이아웃 충돌 없음 | |
| A5 | 양손 + 이펙트 위 합성 + iPad 검증 | 5,000점 상태에서 iPad 30fps | |

---

## 12. 튜닝 상수

한 곳에 모아둔다. A2 이후 iPad에서 직접 조정할 값들이다.

```ts
export const AIRDRAW = {
  pinchOn:    0.40,   // 이 비율 미만이면 펜 내림
  pinchOff:   0.60,   // 이 비율 초과면 펜 올림
  stateFrames:   2,   // 상태 전환에 필요한 연속 프레임
  posSmooth:  0.50,   // 위치 EMA 계수
  minDist:    1.50,   // 이보다 가까운 점은 버림 (px)
  baseWidth:  6,      // 기본 선 두께 (px)
  speedRef:   40,     // 이 속도에서 두께가 최소 (px/frame)
  thinRatio:  0.55,   // 최대 속도에서 줄어드는 두께 비율
  widthSmooth: 0.30,  // 두께 EMA 계수
  maxPoints:  20000,
};
```

---

## 13. 확정된 설계 (A2에서 결정)

- **제스처 공존 규칙 (A안 채택)**: **한 손만 핀치 = 그리기**, **양손 동시
  핀치 = 프레임 제스처**. 획은 시작 후 250ms 동안 ink에 커밋하지 않고
  벡터로만 표시하다가, 그 사이 양손 핀치로 전환되면 소급 취소한다 —
  프레임을 만들려다 생기는 부스러기 획 방지.
- **핀치 판정 통합**: 프레이밍·마커·낙서가 §4 판정(손바닥 폭 5↔17 기준,
  종횡비 보정 distPx, 0.40/0.60 히스테리시스 + 2프레임 디바운스) 하나를
  공유한다. 기존의 손목 기준·단일 임계 판정은 제거됨.
- **검출 주기**: 손이 보이면 ~30Hz(그리기 궤적), 없으면 ~10Hz(배터리).
- **지우개 흔들기 제스처**: 손바닥을 펴고(네 손가락 중 3개 이상 신전,
  핀치 아님) 좌우로 1.1초 안에 3회 이상 방향 반전(스윙 폭 ≥ 프레임의
  5%)하면 **낙서만 지우기**. 발동 시 흰색 플래시, 쿨다운 1.5초.
- **주먹 리셋 제스처**: 주먹(신전 손가락 ≤1)을 1초 유지하면 **전체
  리셋**(낙서 + 프레임 + 이펙트 순서). 유지 중 손바닥 위에 진행 링이
  차오르고 도중에 펴면 취소. 쿨다운 2초. 주먹 상태에서는 엄지-검지가
  가까워도 핀치로 판정하지 않는다 (오인 방지).
- 마커: 그리기(한 손 핀치) 초록 / 프레이밍(양손) 파랑 / 주먹 진행 링 흰색.
- **브러쉬 헤일로**: 선 아래에 대비색 외곽선 레이어(밝은 잉크 → 어두운
  헤일로, 어두운 잉크 → 흰 헤일로, 폭 +5px)를 깔아 어떤 배경에서도
  선이 또렷하다. 헤일로는 별도 캔버스에 그려 조각 이음새에 틈이 없다.
- 물감통 팔레트는 시도 후 원복 (색 변경 UI는 A4 툴바에서 재검토).

---

## 14. 비범위 (v1 제외)

- 지우개 제스처, 도형 인식, 레이어 개념
- 그림 저장/불러오기 (PNG 내보내기만 지원)
- 그림이 이펙트의 입력으로 들어가는 피드백 (v2 후보 — 그린 선을 마스크로 써서 그 영역만 이펙트 적용)
- 회전 시 그림 종횡비 보정
