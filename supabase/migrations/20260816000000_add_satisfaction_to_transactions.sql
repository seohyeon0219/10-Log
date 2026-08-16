-- transactions에 만족도 컬럼 추가
-- 거래 입력 시 만족/보통/후회를 선택적으로 기록
-- null = 스킵(선택 안 함)

alter table public.transactions
  add column if not exists satisfaction text
  check (satisfaction in ('satisfied', 'neutral', 'regret'));
