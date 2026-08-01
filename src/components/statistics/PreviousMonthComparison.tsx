import StatisticsCard from './StatisticsCard'
import { formatAmount } from '../../utils/formatters'

type PreviousMonthComparisonItem = {
  details?: Array<{
    isEmphasized?: boolean
    label: string
    value: number
  }>
  id: string
  label: string
  rate: number
}

type PreviousMonthComparisonProps = {
  items: PreviousMonthComparisonItem[]
}

const getRateClassName = (rate: number) => {
  if (rate > 0) return 'text-(--color-income-blue)'
  if (rate < 0) return 'text-(--color-expense-red)'
  return 'text-gray-400'
}

export default function PreviousMonthComparison({ items }: PreviousMonthComparisonProps) {
  return (
    <StatisticsCard className="h-full" title="전월 비교 분석">
      <div className="mt-4 divide-y divide-black/6">
        {items.map((item) => {
          const amount = item.details?.find((d) => d.isEmphasized)?.value ?? 0
          return (
            <div key={item.id} className="flex items-center justify-between gap-4 py-3">
              <span className="text-sm font-semibold text-gray-500">{item.label}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-extrabold text-black">
                  {formatAmount(Math.abs(amount))}원
                </span>
                <span className={['text-sm font-bold', getRateClassName(item.rate)].join(' ')}>
                  {item.rate > 0 ? '+' : ''}{item.rate}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </StatisticsCard>
  )
}
