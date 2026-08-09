# 일공로그(10-Log) 웹앱 Audit — 분석 전용

## ⛔ 이 작업의 절대 규칙 (가장 먼저 읽고, 작업 내내 유지할 것)

1. **코드를 단 한 줄도 수정하지 않는다.** 파일 생성·수정·삭제·이동 금지.
2. **단 하나의 예외**는 최종 산출물인 `docs/audit-web-2026-08.md` 리포트 작성뿐이다.
3. **Supabase MCP는 조회 전용으로만 사용한다.** 스키마·RLS 정책·트리거·함수·데이터에 대한 어떤 변경도 실행하지 않는다. 쓰기 계열 도구(`apply_migration`, 쓰기 `execute_sql` 등)는 절대 호출하지 않는다.
4. 문제를 발견해도 **고치지 않는다.** 리포트에 기록만 한다.
5. 아무리 사소하고 명백한 수정이라도 이번 세션에서는 하지 않는다.

이 작업의 목적은 **출시 전 위험 요소를 빠짐없이 찾아 문서화하는 것**이며, 개선은 다음 단계의 몫이다.

---

## 1. 이 세션의 범위

**웹앱 레포와 Supabase 백엔드만** 다룬다.

- ✅ 웹앱 소스 전체 (React / TypeScript / 상태 관리 / Supabase 연동)
- ✅ `supabase/migrations/` 및 실제 DB 상태 (RLS, 스키마, 트리거, 함수)
- ✅ Edge Functions
- ✅ 웹 측 빌드·환경변수·배포 설정
- ❌ 모바일 레포 — 별도 세션에서 진행한다
- ❌ WebView 설정, Native bridge의 앱 측 구현 — 모바일 세션 담당

**단, 웹이 앱 쪽으로 내보내는 인터페이스는 이 세션에서 문서화한다.** 모바일 audit의 입력이 되므로 아래를 반드시 정리한다.

- 웹이 `window.ReactNativeWebView.postMessage()` 로 보내는 **모든 메시지 타입과 payload 구조** (`TOKEN_REFRESHED`, `SIGNED_OUT` 등)
- 앱이 주입하는 것을 웹이 기대하는 전역 객체 (`window.__supabase` 등) — **실제로 노출되어 있는지 코드로 확인**
- 웹이 앱 환경을 감지하는 방식 (User-Agent 분기 등)
- 웹 코드 중 앱(WebView) 환경에서만 동작하는 분기 전부

---

## 2. 프로젝트 컨텍스트

### 서비스

**일공로그(10-Log)** — 개인 소비 기록 및 회고 앱. 3인 프론트엔드 팀, App Store 단독 출시 예정.
사용자가 소비 내역을 기록하고, 하루 1분 회고를 남기고, 통계로 소비 흐름을 확인한다.

앱은 이 웹앱을 WebView로 감싼 하이브리드 구조이므로, **서비스 UI와 비즈니스 로직의 대부분이 이 레포에 있다.**

### 기술 스택

React 19 + TypeScript + Vite + Tailwind CSS 4 + Zustand + React Router DOM 7 + Heroicons
Supabase (Tokyo 리전, Google OAuth + PostgreSQL + Edge Functions) / Vercel 배포

### 데이터베이스

| 테이블 | 설명 |
| --- | --- |
| `categories` | 수입·지출 카테고리 (user_id, type, name 단위 unique) |
| `transactions` | 거래 내역 (satisfaction 포함, category_id nullable / ON DELETE SET NULL) |
| `journal_entries` | 일일 회고 (한 줄 평, 만족/후회 소비) |
| `monthly_goals` | 월별 예산 목표 |
| `user_profiles` | 사용자 프로필 (`spending_goals text[]`, `push_token`, `notification_hour`) |

마이그레이션은 `supabase/migrations/` 에 날짜명 `.sql` 로 Git 관리 중이다.
**먼저 이 폴더 전체를 읽어 현재 스키마·정책 상태를 파악한 뒤 실제 DB와 대조한다.** 마이그레이션 파일과 실제 DB가 어긋나 있다면 그 자체가 발견 사항이다.

### 이미 존재하는 방어 장치 (중복 지적 금지)

아래는 이미 구현되어 있다. 존재 여부를 다시 지적하지 말고, **정말 충분한지·우회 가능한지만** 검토한다.

- `validate_transaction_owner` 트리거 — transaction의 category가 같은 사용자·같은 type인지 검증 (security definer, search_path 고정)
- `categories`, `transactions` RLS 활성화 및 `auth.uid() = user_id` 기반 정책
- `transactions.category_id` FK의 `ON DELETE SET NULL`

### 팀 내부 아키텍처 규칙 (위반 지점을 찾을 것)

일반 린트 규칙보다 **이 항목들의 위반 사례를 찾는 것이 훨씬 가치 있다.**

1. **4레이어 폴더 구조**: `pages → layouts → containers → components`. 역방향 의존이나 레이어 건너뛰기가 있는가?
2. **컴포넌트는 Zustand 스토어에 직접 접근하지 않는다.** 컨테이너가 스토어를 읽고 props로 내려준다. (`Header`, `Nav` 등 전역 네비게이션 컴포넌트만 예외)
3. **불가능한 상태 제거**: `isOpen: boolean` + `targetId` 조합 대신 `deleteTarget: Category | null` 처럼 타입 수준에서 불가능한 상태를 차단한다.
4. **커밋 컨벤션**: Conventional Commits 한국어, 관심사별 세밀한 커밋.

---

## 3. 점검 영역

체크리스트를 형식적으로 소화하지 말고, **이 프로젝트에서 실제로 문제가 되는 지점**을 찾는다.

### A. 보안 — 최우선

#### A-1. RLS / 권한 (이번 audit의 핵심)

모든 사용자 데이터 테이블에 대해 확인한다. 특히 **`user_profiles`, `journal_entries`, `monthly_goals`** 는 RLS 활성화 여부부터 확인한다.

- RLS가 활성화되어 있는가?
- SELECT / INSERT / UPDATE / DELETE 각각에 정책이 있는가? 누락된 액션은?
- INSERT 시 `user_id`를 조작해 타인 소유 데이터를 만들 수 있는가? (`WITH CHECK` 절 확인)
- UPDATE 시 `user_id`를 타인 것으로 바꿔치기할 수 있는가?
- `security definer` 함수가 권한 상승 통로가 되지 않는가? `search_path`가 고정되어 있는가?
- Edge Functions가 service role로 동작한다면 요청자 신원을 어떻게 검증하는가? **클라이언트가 보낸 user_id를 그대로 신뢰하는 부분이 있는가?**
- `user_profiles.push_token`을 타인이 조회하거나 덮어쓸 수 있는가?

**다음 공격 시나리오를 각 테이블에 대해 구체적으로 검증한다:**

```text
User A가 인증된 상태에서 User B의 UUID를 직접 지정해 요청
 → B의 데이터를 조회 / 수정 / 삭제 / 생성할 수 있는가?
```

가능하다면 **어떤 쿼리로 가능한지 재현 경로**를 리포트에 적는다.

#### A-2. Secret / 환경변수

- `service_role` 키가 소스, `.env`, 빌드 산출물, Git 히스토리 중 어디에든 노출되어 있는가? — **최우선 확인**
- anon key와 service role key를 혼동해 사용한 곳이 있는가? (anon key의 클라이언트 노출은 정상이므로 취약점으로 보고하지 말 것)
- `VITE_` 접두사가 붙은 변수 중 사실은 공개되면 안 되는 값이 있는가?
- Vercel 환경변수 설정과 코드가 기대하는 변수가 일치하는가? 프리뷰/프로덕션 분리가 되어 있는가?

발견 시 ①노출 위치 ②실제 위험도 ③키 교체 필요 여부 ④올바른 이동 방식을 함께 적는다.

#### A-3. 인증 / 인가

- 프론트에서 버튼을 숨기는 것만으로 권한을 보호하는 지점이 있는가?
- 세션 만료·갱신 실패 시 처리가 되어 있는가?
- 인증되지 않은 상태로 보호된 라우트에 접근 가능한가? 라우트 가드가 렌더 이후에 동작해 데이터가 잠깐 노출되지는 않는가?
- 로그아웃 시 Zustand 스토어의 사용자 데이터가 완전히 정리되는가? 계정 전환 시 이전 사용자 데이터가 남는가?

#### A-4. 입력 검증 / 인젝션

금액, 메모, 카테고리명, 날짜, 회고 한 줄 평 등 모든 입력에 대해:

- 클라이언트 검증만 있고 DB 제약(CHECK, NOT NULL, 길이 제한)이 없는 필드는?
- 금액의 음수·초과값·소수점, 날짜의 비정상 범위가 통과하는가?
- `dangerouslySetInnerHTML` 사용처가 있는가?
- 사용자 입력이 SQL 문자열로 조립되는 곳이 있는가? (Edge Functions, DB 함수 포함)

### B. Frontend

- 책임이 여러 개 섞인 큰 컴포넌트, 과도한 props drilling, 불필요한 wrapper
- Modal / BottomSheet: Portal, z-index, 중첩 처리, open/close 상태 관리, Content와 Container의 책임 분리
- Hook: 불필요한 `useEffect`, 잘못된 dependency, cleanup 누락, effect 내 race condition, stale closure
- 파생값을 state로 저장하는 문제, 중복 state, 상태 동기화 문제
- 전역 상태와 지역 상태의 경계, 서버 상태와 UI 상태의 혼재
- loading / error / empty 상태 누락
- TypeScript: `any`, 불필요한 `as`, 중복 타입, nullable 처리 오류, Supabase 응답 타입 불일치

> 최적화를 위한 최적화는 지적하지 않는다. 불필요한 `useMemo`/`useCallback` 추가 제안 금지.

### C. Database / 성능

- PK, FK, unique, NOT NULL, default, 관계 설정의 적절성
- **인덱스 부족으로 실제 문제가 되는 쿼리** (예: 월별 조회의 `user_id + date` 복합 인덱스 유무)
- N+1 쿼리, 과도한 데이터 조회, pagination 필요 여부
- 통계 화면처럼 데이터가 누적될수록 무거워지는 쿼리
- 중복 fetching, 불필요한 API 요청

> **스키마 변경을 제안할 수는 있으나 이번 세션에서 실행하지 않는다.**

### D. 에러 처리 / 로깅

- 내부 에러·스택 트레이스·DB 에러 메시지가 사용자에게 노출되는가?
- 토큰·개인정보가 `console.log`에 남는가? 프로덕션 빌드에 console이 남는가?
- Error Boundary, 네트워크 실패, 오프라인 상태 처리
- Supabase 오류 처리 누락

### E. Dead Code

미사용 컴포넌트/훅/함수/타입/상수, unused import, 주석 처리된 오래된 코드.
**전체 사용처를 실제로 검색해 확인한 것만** 리포트에 올린다.

### F. Dependency

lockfile 기준으로 알려진 취약점, 미사용·중복 dependency. breaking change 위험이 큰 업데이트는 "권장"으로만 분류한다.

### G. Production Readiness

프로덕션 빌드 설정, 환경변수 분리, 디버그 코드, 프로덕션 URL, 개발 설정의 프로덕션 유입 여부, 백업/마이그레이션 구조.

---

## 4. 심각도 분류

| 등급 | 기준 |
| --- | --- |
| **P0** | 즉시 해결. 출시 차단. 타 사용자 데이터 접근·조작 가능, service role key 노출, 인증/권한 우회 |
| **P1** | 출시 전 해결 권장. 심각한 구조 문제, 데이터 처리 오류, 주요 성능 문제 |
| **P2** | 유지보수성·안정성 개선 |
| **P3** | 가독성·네이밍·소규모 리팩토링 |
| **P4** | 선택적 개선 |

### 심각도 판정 원칙

"보안상 좋지 않아 보인다"는 판정 근거가 아니다. 반드시 아래 순서로 검증한다.

```text
문제 지점
 ↓ 공격자가 조작할 수 있는 값은 무엇인가?
 ↓ 그 값으로 어떤 데이터/기능에 도달하는가?
 ↓ 실제 피해가 발생하는가?
 ↓ 현재 존재하는 방어 계층은 무엇인가? (RLS, 트리거, FK 등)
 ↓ 최종 위험도
```

**이론적으로만 위험한 항목을 P0/P1로 올리지 않는다.** 재현 경로를 설명할 수 없다면 P2 이하다.
발견 항목 수를 늘리기 위한 억지 지적을 하지 않는다. **문제가 적게 발견되면 적게 보고하는 것이 정확한 결과다.**

---

## 5. 산출물

`docs/audit-web-2026-08.md` 파일 하나로 작성한다.

### 5-1. Executive Summary

- 전체 상태 요약 (3~5문장)
- **출시 차단 여부: BLOCK / CONDITIONAL / GO** 와 근거
- P0 / P1 / P2 / P3 개수
- 가장 먼저 손봐야 할 3가지

### 5-2. 발견 항목

심각도 순 정렬. 각 항목은 아래 형식을 지킨다.

```markdown
### [P0-01] 제목

- **Category**: Security / RLS
- **File**: 경로:라인 (여러 개면 모두)
- **Problem**: 무엇이 잘못되었는지
- **Attack Path**: 공격자가 어떤 값을 조작해 무엇에 도달하는지 (보안 항목만, 구체적으로)
- **Risk**: 실제 피해 범위
- **Existing Defense**: 현재 이를 막고 있는 계층 (있다면)
- **Recommended Fix**: 수정 방향 (코드 작성은 하지 않고 방향만)
- **Affected Scope**: 수정 시 영향받는 파일·기능
```

### 5-3. 웹 → 앱 인터페이스 목록

1장에서 지시한 내용을 표로 정리한다. **모바일 audit 세션이 이 섹션을 입력으로 사용하므로 빠짐없이 적는다.**

| 방향 | 이름 | payload 구조 | 발신/수신 위치 | 비고 |
| --- | --- | --- | --- | --- |

`window.__supabase`가 실제로 웹 사이드에 노출되어 있는지 여부를 코드 근거와 함께 명시한다.

### 5-4. 팀 규칙 위반

2장의 팀 규칙 4개 항목별 위반 지점 목록.

### 5-5. 검증 결과

에이전트가 실제로 실행한 명령과 그 출력만 기록한다.

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

### 5-6. 사람이 직접 확인해야 할 항목

실행할 수 없는 검증을 체크리스트로 남긴다. 실제 계정 2개로 데이터 격리 테스트, Google OAuth 플로우, 주요 화면 수동 확인 등.

**이 항목들에 대해 "확인했다" 또는 "정상 동작한다"고 절대 쓰지 않는다.** 실행하지 않은 검증을 통과했다고 기록하는 것은 이 리포트를 무용지물로 만든다.

### 5-7. 리포트 작성 규칙

- **발견 사항이 있는 항목만 작성한다.** 빈 섹션을 "특이사항 없음"으로 채우지 않는다.
- 추측과 확인된 사실을 구분한다. 확인하지 못한 것은 "미확인"으로 명시한다.
- 코드 인용은 문제 설명에 필요한 최소 범위로 한다.

---

## 6. 작업 순서

1. `supabase/migrations/` 전체 읽기 → 현재 스키마·RLS 상태 파악
2. 실제 DB 상태 조회(**읽기 전용**)해서 마이그레이션과 대조
3. **보안 영역(A) 전수 점검** — 이번 audit의 핵심
4. 웹 → 앱 인터페이스 정리 (5-3 섹션)
5. 나머지 영역(B~G) 점검
6. `npx tsc --noEmit`, `npm run lint`, `npm run build` 실행
7. 리포트 작성
8. **P0가 발견되면 리포트 작성 후 즉시 별도로 요약해 알린다.**

---

## ⛔ 마지막 확인

이 세션에서 허용된 쓰기 작업은 **`docs/audit-web-2026-08.md` 생성 단 하나뿐**이다.
코드 수정, 파일 이동/삭제, DB 변경은 전부 금지다.
