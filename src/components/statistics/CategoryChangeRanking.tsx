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

const getRateClassName = (rate: number) => {
  if (rate > 0) return 'text-(--color-income-blue)'
  if (rate < 0) return 'text-(--color-expense-red)'
  return 'text-gray-400'
}

export default function CategoryChangeRanking({ items }: CategoryChangeRankingProps) {
  const [activeType, setActiveType] = useState<TransactionType>('expense')
  const activeItems = items[activeType]

  return (
    <StatisticsCard
      action={<IncomeExpenseToggle onChange={setActiveType} value={activeType} />}
      className="h-full"
      title="카테고리 변화 랭킹"
    >
      {activeItems.length === 0 ? (
        <div className="mt-5 rounded-xl bg-gray-50 px-4 py-8 text-center text-sm font-semibold text-gray-400">
          아직 기록된 내역이 없어요.
        </div>
      ) : (
        <div className="mt-4 divide-y divide-gray-100">
          {activeItems.map((item, index) => (
            <div key={item.id} className="flex items-center gap-3 py-3">
              <span className="w-7 shrink-0 text-sm font-bold text-gray-400">{index + 1}위</span>
              <span className="min-w-0 flex-1 truncate text-sm font-extrabold text-black">
                {item.label}
              </span>
              <span className={['shrink-0 text-sm font-extrabold', getRateClassName(item.rate)].join(' ')}>
                {item.rate > 0 ? '+' : ''}{item.rate}%
              </span>
            </div>
          ))}
        </div>
      )}
    </StatisticsCard>
  )
}
