create table if not exists public.monthly_promises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  month date not null,
  budget_amount integer not null check (budget_amount >= 0),
  promise text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, month)
);

alter table public.monthly_promises
  add column if not exists user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  add column if not exists month date not null default date_trunc('month', now())::date,
  add column if not exists budget_amount integer not null default 0,
  add column if not exists promise text not null default '',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists monthly_promises_user_month_idx
  on public.monthly_promises(user_id, month);

drop trigger if exists set_monthly_promises_updated_at on public.monthly_promises;
create trigger set_monthly_promises_updated_at
before update on public.monthly_promises
for each row
execute function public.set_updated_at();

alter table public.monthly_promises enable row level security;

drop policy if exists "Users can view own monthly promises" on public.monthly_promises;
create policy "Users can view own monthly promises"
on public.monthly_promises
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create own monthly promises" on public.monthly_promises;
create policy "Users can create own monthly promises"
on public.monthly_promises
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own monthly promises" on public.monthly_promises;
create policy "Users can update own monthly promises"
on public.monthly_promises
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own monthly promises" on public.monthly_promises;
create policy "Users can delete own monthly promises"
on public.monthly_promises
for delete
to authenticated
using (auth.uid() = user_id);
