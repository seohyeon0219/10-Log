-- user_profiles 테이블 초기 생성
-- push_token, notification_hour는 20260805000000에서 제거됨
-- spending_goal은 20260805001000에서 spending_goals 배열로 교체됨

create table if not exists public.user_profiles (
  id                   uuid        primary key default gen_random_uuid(),
  user_id              uuid        not null unique references auth.users(id) on delete cascade,
  name                 text        not null default '',
  gender               text,
  age_range            text,
  spending_goal        text,
  custom_goal          text        default '',
  save_areas           text[]      default '{}',
  spending_value       text,
  report_contents      text[]      default '{}',
  report_style         text,
  onboarding_completed boolean     not null default false,
  push_token           text,
  notification_hour    integer,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

drop trigger if exists set_user_profiles_updated_at on public.user_profiles;
create trigger set_user_profiles_updated_at
before update on public.user_profiles
for each row
execute function public.set_updated_at();

alter table public.user_profiles enable row level security;

drop policy if exists "Users can view own profile" on public.user_profiles;
create policy "Users can view own profile"
on public.user_profiles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own profile" on public.user_profiles;
create policy "Users can insert own profile"
on public.user_profiles
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own profile" on public.user_profiles;
create policy "Users can update own profile"
on public.user_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
