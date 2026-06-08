create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  color text not null,
  type text not null check (type in ('expense', 'income')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories
  add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade,
  add column if not exists sort_order integer not null default 0,
  add column if not exists created_at timestamptz not null default now();

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid() references auth.users(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  type text not null check (type in ('expense', 'income')),
  amount integer not null check (amount > 0),
  memo text,
  date date not null,
  is_fixed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.transactions
  add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade,
  add column if not exists is_fixed boolean not null default false,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

delete from public.transactions where user_id is null;
delete from public.categories where user_id is null;

alter table public.categories
  alter column user_id set not null;

alter table public.transactions
  alter column user_id set not null;

create index if not exists categories_user_id_idx on public.categories(user_id);
create index if not exists transactions_user_id_date_idx on public.transactions(user_id, date);
create index if not exists transactions_category_id_idx on public.transactions(category_id);
create unique index if not exists categories_user_type_name_idx
  on public.categories(user_id, type, name);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_transactions_updated_at on public.transactions;
create trigger set_transactions_updated_at
before update on public.transactions
for each row
execute function public.set_updated_at();

create or replace function public.ensure_default_categories()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.categories (user_id, name, color, type, sort_order)
  values
    (current_user_id, '식비', '#f05650', 'expense', 10),
    (current_user_id, '카페', '#ffb74d', 'expense', 20),
    (current_user_id, '교통', '#007fff', 'expense', 30),
    (current_user_id, '쇼핑', '#ab47bc', 'expense', 40),
    (current_user_id, '문화', '#00a878', 'expense', 50),
    (current_user_id, '기타', '#898989', 'expense', 60),
    (current_user_id, '급여', '#1863dc', 'income', 10),
    (current_user_id, '부수입', '#4c8df6', 'income', 20),
    (current_user_id, '용돈', '#69a7ff', 'income', 30)
  on conflict (user_id, type, name) do nothing;
end;
$$;

create or replace function public.validate_transaction_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.categories
    where categories.id = new.category_id
      and categories.user_id = new.user_id
      and categories.type = new.type
  ) then
    raise exception 'Category does not belong to the transaction owner or type';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_transaction_owner on public.transactions;
create trigger validate_transaction_owner
before insert or update on public.transactions
for each row
execute function public.validate_transaction_owner();

alter table public.categories enable row level security;
alter table public.transactions enable row level security;

drop policy if exists "Users can view own categories" on public.categories;
create policy "Users can view own categories"
on public.categories
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create own categories" on public.categories;
create policy "Users can create own categories"
on public.categories
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own categories" on public.categories;
create policy "Users can update own categories"
on public.categories
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own categories" on public.categories;
create policy "Users can delete own categories"
on public.categories
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can view own transactions" on public.transactions;
create policy "Users can view own transactions"
on public.transactions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create own transactions" on public.transactions;
create policy "Users can create own transactions"
on public.transactions
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own transactions" on public.transactions;
create policy "Users can update own transactions"
on public.transactions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own transactions" on public.transactions;
create policy "Users can delete own transactions"
on public.transactions
for delete
to authenticated
using (auth.uid() = user_id);

grant execute on function public.ensure_default_categories() to authenticated;
