-- journal_entries 고아 테이블 제거
--
-- 배경: 초기 개발 중 대시보드에서 직접 생성된 것으로 추정되며,
--       이후 회고 기능이 daily_reviews로 구현되면서 사용되지 않게 됨.
-- 확인: 마이그레이션 파일 없음, 코드 참조 0건, 데이터 0행, 참조 FK 없음.
-- 영향: 없음. 어떤 코드도 이 테이블을 사용하지 않음.

begin;

drop table if exists public.journal_entries;

commit;
