import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import StatisticsCard from './StatisticsCard'
import { formatAmount } from '../../utils/formatters'

type PreviousMonthComparisonItem = {
  currentValue: number
  id: string
  label: string
  previousValue: number
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
  const [selectedId, setSelectedId] = useState<string | null>(null)
return (
    <StatisticsCard className="h-full" title="전월 비교 분석">
      <div className="mt-4 divide-y divide-black/6">
        {items.map((item) => {
          const isSelected = selectedId === item.id
          return (
            <div key={item.id}>
              <button
                className="flex w-full items-center justify-between gap-4 py-3 transition"
                onClick={() => setSelectedId(isSelected ? null : item.id)}
                type="button"
              >
                <span className={['text-sm font-semibold transition', isSelected ? 'text-black' : 'text-gray-500'].join(' ')}>
                  {item.label}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-extrabold text-black">
                    {formatAmount(Math.abs(item.currentValue))}원
                  </span>
                  <span className={['text-sm font-bold', getRateClassName(item.rate)].join(' ')}>
                    {item.rate > 0 ? '+' : ''}{item.rate}%
                  </span>
                </div>
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
                        <span className="text-xs font-medium text-gray-500">전월 {item.label}</span>
                        <strong className="text-sm font-bold text-gray-600">
                          {formatAmount(Math.abs(item.previousValue))}원
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
    </StatisticsCard>
  )
}
