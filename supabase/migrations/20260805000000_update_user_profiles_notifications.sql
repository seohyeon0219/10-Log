alter table public.user_profiles
  add column if not exists push_token text,
  add column if not exists notification_hour integer check (notification_hour in (9, 21, 23));
