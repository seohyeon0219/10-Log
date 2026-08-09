import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import IncomeExpenseToggle from '../common/IncomeExpenseToggle'
import StatisticsCard from './StatisticsCard'
import { formatAmount, getRateClassName } from '../../utils/formatters'
import type { TransactionType } from '../../types/finance'

type CategoryChangeItem = {
  currentAmount: number
  id: string
  label: string
  previousAmount: number
  rate: number
}

type CategoryChangeRankingProps = {
  items: Record<TransactionType, CategoryChangeItem[]>
}

export default function CategoryChangeRanking({ items }: CategoryChangeRankingProps) {
  const [activeType, setActiveType] = useState<TransactionType>('expense')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const activeItems = items[activeType]

  const handleTypeChange = (type: TransactionType) => {
    setActiveType(type)
    setSelectedId(null)
  }

  return (
    <StatisticsCard
      action={<IncomeExpenseToggle onChange={handleTypeChange} value={activeType} />}
      className="h-full"
      title="카테고리 변화 랭킹"
    >
      {activeItems.length === 0 ? (
        <div className="mt-5 rounded-xl bg-black/4 px-4 py-8 text-center text-sm font-semibold text-gray-400">
          아직 기록된 내역이 없어요.
        </div>
      ) : (
        <div className="mt-4 divide-y divide-black/6">
          {activeItems.map((item, index) => {
            const isSelected = selectedId === item.id
            return (
              <div key={item.id}>
                <button
                  className="flex w-full items-center gap-3 py-3 text-left transition"
                  onClick={() => setSelectedId(isSelected ? null : item.id)}
                  type="button"
                >
                  <span className="w-7 shrink-0 text-sm font-bold text-gray-400">{index + 1}위</span>
                  <span className={['min-w-0 flex-1 truncate text-sm font-extrabold transition', isSelected ? 'text-black' : 'text-gray-700'].join(' ')}>
                    {item.label}
                  </span>
                  <span className={['shrink-0 text-sm font-extrabold', getRateClassName(item.rate)].join(' ')}>
                    {item.rate > 0 ? '+' : ''}{item.rate}%
                  </span>
                </button>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      animate={{ height: 'auto', opacity: 1 }}
                      className="overflow-hidden"
                      exit={{ height: 0, opacity: 0 }}
                      initial={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                      <div className="border-t border-black/8" />
                      <div className="grid gap-2 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500">전월</span>
                          <strong className="text-sm font-bold text-gray-600">
                            {formatAmount(item.previousAmount)}원
                          </strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500">이번 달</span>
                          <strong className="text-sm font-bold text-black">
                            {formatAmount(item.currentAmount)}원
                          </strong>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      )}
    </StatisticsCard>
  )
}
