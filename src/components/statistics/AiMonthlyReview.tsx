import StatisticsCard from './StatisticsCard'

type AiMonthlyReviewProps = {
  monthLabel?: string
}

export default function AiMonthlyReview({ monthLabel = '이번 달' }: AiMonthlyReviewProps) {
  return (
    <StatisticsCard eyebrow={`${monthLabel} AI 월간회고`} title="곧 만나요">
      <p className="mt-3 break-keep text-sm leading-6 font-semibold text-(--color-dark-gray)">
        다짐과 소비 흐름을 함께 읽어주는 월간회고를 준비하고 있어요.
      </p>
    </StatisticsCard>
  )
}
