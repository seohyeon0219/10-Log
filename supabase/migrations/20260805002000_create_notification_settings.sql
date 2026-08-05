create table if not exists public.notification_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  enabled boolean not null default false,
  notification_hour integer not null check (notification_hour in (9, 21, 23)),
  push_token text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create trigger set_notification_settings_updated_at
before update on public.notification_settings
for each row execute function public.set_updated_at();

alter table public.notification_settings enable row level security;

create policy "Users can manage own notification settings"
on public.notification_settings
for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
