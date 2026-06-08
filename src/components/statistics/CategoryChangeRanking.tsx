import { useState } from 'react'
import IncomeExpenseToggle from '../common/IncomeExpenseToggle'
import StatisticsCard from './StatisticsCard'

type TransactionType = 'income' | 'expense'

type CategoryChangeItem = {
  id: string
  label: string
  rate: number
}

type CategoryChangeRankingProps = {
  items: Record<TransactionType, CategoryChangeItem[]>
}

const getRateText = (rate: number) => {
  if (rate > 0) {
    return `▲ ${rate}%`
  }

  if (rate < 0) {
    return `▼ ${Math.abs(rate)}%`
  }

  return '0%'
}

const getRateClassName = (rate: number) => {
  if (rate > 0) {
    return 'text-(--color-income-blue)'
  }

  if (rate < 0) {
    return 'text-(--color-expense-red)'
  }

  return 'text-(--color-dark-gray)'
}

export default function CategoryChangeRanking({ items }: CategoryChangeRankingProps) {
  const [activeType, setActiveType] = useState<TransactionType>('expense')
  const activeItems = items[activeType]

  return (
    <StatisticsCard
      className="h-full"
      eyebrow="카테고리별 증감"
      title="지난 달에 비해 변화가 큰 항목이에요"
    >
      <div className="mt-4">
        <IncomeExpenseToggle onChange={setActiveType} value={activeType} />
      </div>

      {activeItems.length === 0 ? (
        <div className="mt-5 rounded-xl bg-gray-50 px-4 py-8 text-center text-sm font-semibold text-gray-400">
          아직 기록된 내역이 없어요.
        </div>
      ) : (
        <ol className="mt-5 grid gap-2">
          {activeItems.map((item, index) => (
            <li
              className="grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-gray-50 px-4 py-5"
              key={item.id}
            >
              <span className="text-sm font-extrabold text-gray-400">{index + 1}</span>
              <span className="min-w-0 truncate text-base font-extrabold text-black">
                {item.label}
              </span>
              <span className={['text-base font-extrabold', getRateClassName(item.rate)].join(' ')}>
                {getRateText(item.rate)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </StatisticsCard>
  )
}