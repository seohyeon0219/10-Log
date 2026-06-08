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
    (current_user_id, '교통', '#4c8df6', 'expense', 30),
    (current_user_id, '쇼핑', '#ab47bc', 'expense', 40),
    (current_user_id, '취미·여가', '#7c6cff', 'expense', 50),
    (current_user_id, '생필품', '#8bc34a', 'expense', 60),
    (current_user_id, '주거·통신', '#78909c', 'expense', 70),
    (current_user_id, '의료·건강', '#26bfa6', 'expense', 80),
    (current_user_id, '경조사·선물', '#ec5f9e', 'expense', 90),
    (current_user_id, '여행', '#33c481', 'expense', 100),
    (current_user_id, '기타', '#212121', 'expense', 110),
    (current_user_id, '급여', '#1863dc', 'income', 10),
    (current_user_id, '용돈', '#4c8df6', 'income', 20),
    (current_user_id, '기타', '#212121', 'income', 30)
  on conflict (user_id, type, name) do nothing;
end;
$$;

grant execute on function public.ensure_default_categories() to authenticated;
