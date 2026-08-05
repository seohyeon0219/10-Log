-- spending_goal(단일 선택)을 spending_goals(최대 3개 복수 선택)로 변경
-- 기존 단일 값은 배열의 첫 번째 원소로 마이그레이션

BEGIN;

ALTER TABLE user_profiles ADD COLUMN spending_goals text[] DEFAULT '{}';

UPDATE user_profiles
SET spending_goals = ARRAY[spending_goal]
WHERE spending_goal IS NOT NULL;

ALTER TABLE user_profiles DROP COLUMN spending_goal;

COMMIT;
