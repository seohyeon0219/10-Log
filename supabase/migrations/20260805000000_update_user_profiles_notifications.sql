-- push_token, notification_hour를 user_profiles에서 제거
-- notification_settings 별도 테이블로 분리됨 (20260805002000 참고)
alter table public.user_profiles
  drop column if exists push_token,
  drop column if exists notification_hour;
