-- accounts.type check 제약에 부채 전용 타입 추가
-- 기존: cash, deposit, savings, investment, etc
-- 추가: loan, card, other_debt

alter table public.accounts
  drop constraint if exists accounts_type_check;

alter table public.accounts
  add constraint accounts_type_check
  check (type in ('cash', 'deposit', 'savings', 'investment', 'etc', 'loan', 'card', 'other_debt'));
