-- transactions에 카테고리 스냅샷 컬럼 추가
-- 카테고리가 삭제되거나 이름/색상이 변경되어도 거래 기록 당시의 값이 유지됨

alter table public.transactions
  add column if not exists category_name  text,
  add column if not exists category_color text;

-- 기존 데이터 백필
update public.transactions t
set
  category_name  = c.name,
  category_color = c.color
from public.categories c
where t.category_id = c.id;

-- 거래 저장/수정 시 카테고리 스냅샷 자동 기록 트리거
create or replace function public.snapshot_category_on_transaction()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.category_id is not null then
    select name, color
    into new.category_name, new.category_color
    from public.categories
    where id = new.category_id;
  end if;
  return new;
end;
$$;

drop trigger if exists snapshot_category on public.transactions;
create trigger snapshot_category
before insert or update of category_id on public.transactions
for each row
execute function public.snapshot_category_on_transaction();
