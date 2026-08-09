-- pg_cron / pg_net 확장 활성화
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 새 환경 설정 필요:
-- 1. supabase secrets set CRON_SECRET=<임의의_긴_문자열>
-- 2. 아래 <CRON_SECRET> 를 해당 값으로 교체한 뒤 실행 (실제 값을 커밋하지 말 것)

-- 매분 실행: 알림 시간이 된 사용자에게 Push 발송
select cron.schedule(
  'notification-scheduler',
  '* * * * *',
  $$
  select net.http_post(
    url := 'https://jkynajnwiolqnpxzmgav.supabase.co/functions/v1/notification-scheduler',
    headers := '{"Content-Type": "application/json", "x-cron-secret": "<CRON_SECRET>"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);

-- 매월 1일 00:00 UTC (한국시간 09:00): 월간 AI 리포트 생성 및 Push 발송
select cron.schedule(
  'generate-monthly-report',
  '0 0 1 * *',
  $$
  select net.http_post(
    url := 'https://jkynajnwiolqnpxzmgav.supabase.co/functions/v1/generate-monthly-report',
    headers := '{"Content-Type": "application/json", "x-cron-secret": "<CRON_SECRET>"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
