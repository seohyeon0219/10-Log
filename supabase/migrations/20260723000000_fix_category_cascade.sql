-- category_id를 nullable로 변경하고 FK를 ON DELETE SET NULL로 교체
-- 카테고리 삭제 시 연결된 내역의 category_id가 null로 설정되고,
-- 프론트에서 null 카테고리는 "미분류"로 표시됨

alter table public.transactions
  alter column category_id drop not null;

alter table public.transactions
  drop constraint if exists transactions_category_id_fkey;

alter table public.transactions
  add constraint transactions_category_id_fkey
  foreign key (category_id)
  references public.categories(id)
  on delete set null;

-- validate_transaction_owner 트리거가 category_id가 null인 경우도 허용하도록 수정
create or replace function public.validate_transaction_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.category_id is null then
    return new;
  end if;

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
