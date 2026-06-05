alter table public.categories
add column if not exists type text not null default 'expense'
check (type in ('income', 'expense'));
