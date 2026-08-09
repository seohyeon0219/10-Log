-- notification_settings 확장
-- 1. frequency / notification_time / weekday / timezone / last_sent_at 추가
-- 2. notification_hour 제거 (notification_time으로 마이그레이션)
-- 3. push_token nullable 변경

-- 새 컬럼 추가
alter table public.notification_settings
  add column if not exists frequency       text        not null default 'daily'
    check (frequency in ('daily', 'weekly')),
  add column if not exists notification_time time       not null default '21:00',
  add column if not exists weekday         smallint
    check (weekday between 1 and 7),
  add column if not exists timezone        text        not null default 'Asia/Seoul',
  add column if not exists last_sent_at    timestamptz;

-- 기존 notification_hour → notification_time 마이그레이션
update public.notification_settings
set notification_time = make_time(notification_hour, 0, 0)
where notification_hour is not null;

-- notification_hour 제거 (check constraint 포함 자동 삭제)
alter table public.notification_settings
  drop column if exists notification_hour;

-- push_token nullable 변경 (권한 거부 / 시뮬레이터 대응)
alter table public.notification_settings
  alter column push_token drop not null;
