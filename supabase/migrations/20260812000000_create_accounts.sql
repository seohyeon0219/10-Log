-- 자산(계좌) 관리 테이블 — 1단계
--
-- 배경: 예금·적금·투자 등 사용자 자산을 등록·조회하는 기능 구현.
--       거래와의 연결(2단계), 이체(3단계)는 이 마이그레이션에 포함하지 않음.
--
-- 설계 의도:
--   - type: enum 대신 text + check 제약. 향후 신용카드 등 추가 시
--     enum ALTER 없이 check 제약만 수정하면 되므로 유연성 확보.
--   - balance: 항상 양수(check >= 0). 부채는 is_liability=true + 양수로 표현.
--     "남은 대출 3,000,000원"이 "-3,000,000원"보다 자연스럽고,
--     부호 오입력을 DB 수준에서 차단함.
--   - balance_as_of: "이 잔액이 유효한 기준 시점". 2단계에서 거래 합산 시
--     이 날짜 이후의 거래만 반영하기 위한 앵커. 1단계에서는 저장만 함.
--   - is_archived: 물리 삭제 대신 보관 처리. 2단계 이후 연결된 거래 이력을
--     보존하기 위함.

begin;

create table public.accounts (
  id               uuid        primary key default gen_random_uuid(),
  user_id          uuid        not null references auth.users(id) on delete cascade,
  name             text        not null check (char_length(trim(name)) between 1 and 20),
  type             text        not null check (type in ('cash', 'deposit', 'savings', 'investment', 'etc')),
  is_liability     boolean     not null default false,
  balance          bigint      not null default 0 check (balance >= 0),
  balance_as_of    date        not null default current_date,
  memo             text                 check (char_length(memo) <= 100),
  include_in_total boolean     not null default true,
  sort_order       int         not null default 0,
  is_archived      boolean     not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index accounts_user_id_archived_sort_idx
  on public.accounts (user_id, is_archived, sort_order);

drop trigger if exists set_accounts_updated_at on public.accounts;
create trigger set_accounts_updated_at
  before update on public.accounts
  for each row
  execute function public.set_updated_at();

alter table public.accounts enable row level security;

drop policy if exists "Users can view own accounts" on public.accounts;
create policy "Users can view own accounts"
  on public.accounts
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can create own accounts" on public.accounts;
create policy "Users can create own accounts"
  on public.accounts
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own accounts" on public.accounts;
create policy "Users can update own accounts"
  on public.accounts
  for update
  to authenticated
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own accounts" on public.accounts;
create policy "Users can delete own accounts"
  on public.accounts
  for delete
  to authenticated
  using (auth.uid() = user_id);

commit;
