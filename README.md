# FreshWatch AI · 신선식품 폐기저감 콘솔 (프론트엔드)

- 제안사 **CJ올리브네트웍스** · 고객사 **롯데마트**
- KT AIVLE SCHOOL 빅프로젝트 17조 · 점포 담당자용 관리자 콘솔

> 브랜딩 문구·색상은 `src/lib/brand.js` 와 `tailwind.config.js` 에서 한 번에 바꿉니다.
> 현재 색상은 CJ CI 계열 근사값이므로 공식 가이드 확보 시 교체하세요.

## 실행

```bash
npm install
npm run dev        # http://localhost:5173
```

데모 계정이 로그인 폼에 미리 입력되어 있습니다. 그대로 로그인하면 됩니다.

## 화면

| 화면 | 내용 |
| --- | --- |
| 로그인 | 브랜드 소개 + 계정 입력 (목 인증) |
| 오늘 할 일 | 승인 대기 · 폐기 위험 · 회수 예상 KPI, 주간 추이 차트, 우선 처리 3건 |
| 가격 추천 | 필터, 체크박스 선택, 할인율 ±5%p 조정(40% 상한), 추천 근거 펼치기, 일괄 승인 |
| 손익 시뮬레이션 (모달) | 할인율 슬라이더, 할인율별 기대 손익 곡선(최적점 표시), 수요 예측 대비 실적 |
| ESL 현황 | 전송 성공/실패, 재전송·수기 라벨 인쇄 |
| 성과 리포트 | 월별 손실 추이, 승인 비율, 미승인 건의 실제 결과 |

## 구조

```
src/
├─ App.jsx              레이아웃 · 라우팅(탭) · 매장 선택 · 토스트
├─ lib/
│  ├─ api.js            ★ API 레이어 (USE_MOCK 플래그)
│  └─ format.js         숫자 포맷
├─ components/ui.jsx    Kpi · Panel · DayTag · Button · Skeleton · Toast · useAsync
└─ pages/               Login · Dashboard · Recommendations · EslStatus · Performance
```

## 마감 모드

매장 시계는 **대한민국 표준시(KST)에 실시간 동기화**되며, 마감 4시간 전(18시)에 도달하면 자동 전환됩니다.
발표 시연을 위해 "시연 가속"(1초 = 1분) 또는 "마감 모드 미리 보기"로 언제든 확인할 수 있습니다.

- 마감까지 카운트다운 · 진행 바
- 1시간마다 D-Day 상품 추천 할인율 자동 +5%p 상향 (상한 40% 유지)
- 대기열이 D-Day · 손실액 순으로 자동 재정렬
- "D-Day 전량 상한 적용" 원클릭 처리

## 휴무일 반영

의무휴업(2·4주 일요일)과 공휴일을 운영 캘린더로 표시합니다.
휴업 전일에는 방문객이 +21% 증가(자체 EDA)하며, 휴업일에는 판매가 불가능하므로
전일에 D+1 상품까지 조기 처리 대상에 포함하는 규칙을 화면에 안내합니다.

## 브랜딩

- 브랜드 색상: 롯데마트 레드(#E60012) — `tailwind.config.js` 의 `brand` 팔레트
- 심볼: `public/lotte-mart.png` 에 공식 로고(심볼 단독, 정사각 투명 PNG)를 넣으면 자동 적용
  파일이 없으면 내장 심볼이 표시됩니다.
- 문구(제안사·고객사·버전): `src/lib/brand.js`

## 승인 구조 (2단 결재)

| 할인율 | 결재 |
| --- | --- |
| 0 ~ 30% | 담당자 승인 → ESL 즉시 반영 |
| 31 ~ 40% | 담당자 승인 → **점장 최종 승인** → ESL 반영 |

- 할인율은 **1%p 단위**로 0~40% 범위에서 조정합니다 (본사 지침 상한 40%).
- 임계값은 `src/lib/api.js` 의 `APPROVAL_THRESHOLD` 또는 정책 설정 팝업에서 변경합니다.
- 점장 결재 대기 건은 홈 화면 상단에 별도 영역으로 표시되며, 점장·본사 계정에서만 승인/반려할 수 있습니다.

## 권한 (역할별 접근)

| 역할 | 점포 화면 | 본사 화면 | 정책 설정 |
| --- | --- | --- | --- |
| 신선팀 담당자 | O | X | X |
| 점장 | O | X | O |
| 본사 운영팀 | O | O | O |

로그인 화면에서 역할을 선택해 시연할 수 있습니다.

## 백엔드 연결

`src/lib/api.js` 의 `USE_MOCK = false` 로 바꾸면 실제 서버를 호출합니다.
`vite.config.js` 의 proxy 주석을 해제해 백엔드 주소를 지정하세요.

### 필요한 엔드포인트

| 메서드 | 경로 | 응답 |
| --- | --- | --- |
| POST | `/api/login` | `{ user, stores }` |
| GET | `/api/summary?store_id=` | `{ pending, risk_amount, expected_recovery, by_category, waste_trend }` |
| GET | `/api/recommendations?store_id=` | 상품 배열 (아래 스키마) |
| POST | `/api/approve` | `{ approved, esl_sent, esl_failed }` |
| GET | `/api/esl/status?store_id=` | `{ sent_today, applied, failed, logs }` |
| GET | `/api/kpi?store_id=&period=` | `{ waste_rate, saved_amount, approval_rate, monthly, rejected }` |

```json
{
  "product_id": "P001",
  "product_name": "한우 등심 300g",
  "category": "축산",
  "days_until_expiry": 0,
  "stock_quantity": 8,
  "cost": 38000,
  "regular_price": 52000,
  "recommended_rate": 0.40,
  "expected_loss": 304000,
  "sell_probability": 0.78,
  "esl_applicable": true,
  "reason": "오늘 미판매 시 폐기 손실 30.4만원 · 40% 할인 시 판매확률 78%"
}
```

> 승인 시 `approved_rate` 와 `recommended_rate` 를 **함께** 저장해달라고 요청하세요.
> 담당자가 AI 추천을 얼마나 조정하는지 분석하는 데이터가 됩니다.

## 배포

```bash
npm run build      # dist/ 생성
```

`dist/` 를 S3 정적 호스팅에 업로드하거나 EC2 nginx 에 올리면 됩니다.
백엔드가 준비되기 전에도 목 데이터로 동작하므로 시연이 가능합니다.
