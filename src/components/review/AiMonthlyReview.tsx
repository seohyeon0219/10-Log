import StatisticsCard from '../statistics/StatisticsCard'

type Props = {
  monthLabel?: string
}

export default function AiMonthlyReview({ monthLabel = '이번 달' }: Props) {
  return (
    <StatisticsCard
      action={
        <svg aria-hidden="true" className="text-gray-400" fill="none" height="16" viewBox="0 0 16 16" width="16">
          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </svg>
      }
      eyebrow="AI 월간로그"
      title={`나만을 위한 ${monthLabel} AI 리포트`}
    >
      <div className="mt-4 flex items-center gap-2">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black/25 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-black/40" />
        </span>
        <span className="text-[11px] font-bold uppercase tracking-widest text-(--color-text-muted)">
          준비 중
        </span>
      </div>
    </StatisticsCard>
  )
}
