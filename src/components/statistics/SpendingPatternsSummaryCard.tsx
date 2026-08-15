import { Link } from 'react-router-dom'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import StatisticsCard from './StatisticsCard'

const PATTERN_ITEMS = ['요일별 지출 패턴', '주차별 지출', '지출 밀도']

export default function SpendingPatternsSummaryCard() {
  return (
    <StatisticsCard
      action={
        <Link className="text-gray-400 hover:text-gray-600" to="/app/stats/patterns">
          <ChevronRightIcon aria-hidden="true" className="h-4 w-4" />
        </Link>
      }
      title="지출 패턴"
    >
      <div className="mt-4 flex flex-wrap gap-2">
        {PATTERN_ITEMS.map((label) => (
          <span
            className="rounded-full bg-black/5 px-3 py-1.5 text-[13px] font-semibold text-gray-500"
            key={label}
          >
            {label}
          </span>
        ))}
      </div>
    </StatisticsCard>
  )
}
