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

## 7. 대시보드 수동 설정 (파일로 관리 불가)

### Google OAuth

Authentication → Providers → Google에서 설정.

1. [Google Cloud Console](https://console.cloud.google.com)에서 OAuth 2.0 클라이언트 생성
2. Client ID / Client Secret 입력
3. 승인된 리디렉션 URI에 Supabase 콜백 URL 추가:
   `https://<PROJECT_REF>.supabase.co/auth/v1/callback`

### Redirect URLs

Authentication → URL Configuration → Redirect URLs에 아래 추가:

```
http://localhost:5173/**
http://localhost:5175/**
https://*-seohyeon0219s-projects.vercel.app/**
tenlog://auth-callback
exp://localhost:8081/--/auth-callback
exp://127.0.0.1:8081/--/auth-callback
```

> 실제 기기 테스트 시 `exp://<현재_로컬_IP>:8081/--/auth-callback` 형태로 그때그때 추가.
