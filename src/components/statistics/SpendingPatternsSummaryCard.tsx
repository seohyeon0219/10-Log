import { ChevronRightIcon } from '@heroicons/react/24/outline'
import StatisticsCard from './StatisticsCard'

export default function SpendingPatternsSummaryCard() {
  return (
    <StatisticsCard
      action={<ChevronRightIcon aria-hidden="true" className="h-4 w-4 text-gray-400" />}
      title="지출 패턴"
    >
      <p className="mt-2 text-[13px] font-semibold text-(--color-text-muted)">
        요일별 · 주차별 · 지출 밀도로 보는 소비 흐름
      </p>
    </StatisticsCard>
  )
}
