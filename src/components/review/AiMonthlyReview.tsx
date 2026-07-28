import StatisticsCard from '../statistics/StatisticsCard'

type AiMonthlyReviewProps = {
  monthLabel?: string
}

export default function AiMonthlyReview({ monthLabel = '이번 달' }: AiMonthlyReviewProps) {
  return (
    <StatisticsCard eyebrow={`${monthLabel} AI 월간로그`} title="곧 만나요">
      <div className="mt-4 flex items-center gap-2">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black/25 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-black/40" />
        </span>
        <span className="text-[11px] font-bold uppercase tracking-widest text-(--color-text-muted)">
          준비 중
        </span>
      </div>

      <p className="mt-3 break-keep text-sm leading-6 font-semibold text-(--color-dark-gray)">
        다짐과 소비 흐름을 함께 읽어주는 월간로그를 준비하고 있어요.
      </p>

      <div className="mt-5 rounded-2xl border border-black/6 bg-black/3 px-4 py-4">
        <p className="text-xs font-bold uppercase tracking-widest text-(--color-text-muted)">
          포함될 내용
        </p>
        <ul className="mt-3 grid gap-2">
          {['이달의 소비 패턴 분석', '카테고리별 변화 요약', '다음 달을 위한 제안'].map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-[13px] font-semibold text-(--color-dark-gray)">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-black/25" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </StatisticsCard>
  )
}
