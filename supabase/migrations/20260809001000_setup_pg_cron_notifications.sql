-- pg_cron / pg_net 확장 활성화
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 매분 실행: 알림 시간이 된 사용자에게 Push 발송
select cron.schedule(
  'notification-scheduler',
  '* * * * *',
  $$
  select net.http_post(
    url := 'https://jkynajnwiolqnpxzmgav.supabase.co/functions/v1/notification-scheduler',
    headers := '{"Content-Type": "application/json", "x-cron-secret": "<SERVICE_ROLE_KEY>"}'::jsonb,
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
    headers := '{"Content-Type": "application/json", "x-cron-secret": "<SERVICE_ROLE_KEY>"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
