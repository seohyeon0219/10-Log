create table if not exists public.daily_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  review_date date not null,
  good_transaction_id uuid references public.transactions(id) on delete set null,
  regret_transaction_id uuid references public.transactions(id) on delete set null,
  good_comment text not null default '',
  regret_comment text not null default '',
  satisfaction_rating integer not null check (satisfaction_rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, review_date)
);

create unique index if not exists daily_reviews_user_date_idx
  on public.daily_reviews(user_id, review_date);

drop trigger if exists set_daily_reviews_updated_at on public.daily_reviews;
create trigger set_daily_reviews_updated_at
before update on public.daily_reviews
for each row
execute function public.set_updated_at();

alter table public.daily_reviews enable row level security;

drop policy if exists "Users can view own daily reviews" on public.daily_reviews;
create policy "Users can view own daily reviews"
on public.daily_reviews
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create own daily reviews" on public.daily_reviews;
create policy "Users can create own daily reviews"
on public.daily_reviews
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own daily reviews" on public.daily_reviews;
create policy "Users can update own daily reviews"
on public.daily_reviews
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own daily reviews" on public.daily_reviews;
create policy "Users can delete own daily reviews"
on public.daily_reviews
for delete
to authenticated
using (auth.uid() = user_id);
