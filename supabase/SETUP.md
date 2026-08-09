# Supabase 새 환경 셋업 가이드

## 1. 프로젝트 연결

```bash
supabase login
supabase link --project-ref <PROJECT_REF>
```

## 2. Migration 실행

```bash
supabase db push
```

> migration 순서대로 전체 스키마가 생성됨. 신규 프로젝트 기준으로 아래 테이블이 만들어짐:
> `categories`, `transactions`, `monthly_promises`, `daily_reviews`, `user_profiles`, `notification_settings`

## 3. Edge Function 배포

```bash
supabase functions deploy notification-scheduler
supabase functions deploy send-test-push
supabase functions deploy generate-monthly-report
```

## 4. Secrets 설정

```bash
# 임의의 긴 문자열로 생성
openssl rand -hex 32

supabase secrets set CRON_SECRET=<위에서_생성한_값>
```

| Secret | 용도 |
|---|---|
| `CRON_SECRET` | pg_cron → Edge Function 호출 인증 |
| `SUPABASE_URL` | Supabase 자동 주입 |
| `SUPABASE_ANON_KEY` | Supabase 자동 주입 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 자동 주입 |

## 5. pg_cron 잡 등록

`supabase/migrations/20260809001000_setup_pg_cron_notifications.sql` 파일에서
`<CRON_SECRET>` 를 4단계에서 설정한 실제 값으로 교체한 뒤 SQL Editor에서 직접 실행.

> ⚠️ 이 파일에 실제 값을 커밋하지 말 것.

## 6. Expo 푸시 알림

별도 설정 불필요. Expo Push API(`https://exp.host/--/api/v2/push/send`)를 직접 호출하는 구조라 서드파티 키가 필요 없음.
