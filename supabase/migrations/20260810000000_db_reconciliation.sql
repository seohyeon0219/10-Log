-- DB 상태와 마이그레이션 파일 정합화
--
-- 배경: 프로덕션 DB에 대시보드를 통해 직접 적용된 변경이
--       마이그레이션 파일에 반영되지 않아 새 환경에서 DB를 재현할 수 없는 문제 수정.
--       audit P1-01, P1-03 (web).
--
-- 변경 내용:
--   ② user_profiles: 대시보드에서 생성된 ALL 단일 정책 제거,
--      20260609004000_create_user_profiles.sql 기준 개별 정책(SELECT/INSERT/UPDATE)으로 복원.
--      on delete cascade로 계정 삭제 시 CASCADE가 처리하므로 DELETE 정책 불필요.
--      기존 사용자의 본인 프로필 SELECT/INSERT/UPDATE 접근 유지됨.
--   ③ categories/transactions: 마이그레이션의 개별 정책과 중복되는
--      대시보드 추가 ALL 정책 제거. PostgreSQL RLS 허용형 OR 논리에 의해
--      기존 사용자 접근에 변화 없음.
--   ④ monthly_promises: use_income_as_budget 컬럼 추가.
--      DEFAULT false로 기존 행에 영향 없음.

begin;

-- ② user_profiles: ALL 단일 정책 제거 후 개별 정책으로 교체
drop policy if exists "Users can manage their own profile" on public.user_profiles;

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

-- ③ categories/transactions: 대시보드에서 추가된 중복 ALL 정책 제거
drop policy if exists "users can manage own categories" on public.categories;
drop policy if exists "users can manage own transactions" on public.transactions;

-- ④ monthly_promises: use_income_as_budget 컬럼 추가
alter table public.monthly_promises
  add column if not exists use_income_as_budget boolean not null default false;

commit;
