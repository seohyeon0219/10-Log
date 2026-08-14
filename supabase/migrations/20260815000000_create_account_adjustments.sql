create table account_adjustments (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  amount integer not null,
  date date not null,
  memo text,
  created_at timestamptz default now() not null
);

alter table account_adjustments enable row level security;

create policy "Users can manage their own adjustments"
  on account_adjustments
  for all
  using (
    account_id in (
      select id from accounts where user_id = auth.uid()
    )
  );
