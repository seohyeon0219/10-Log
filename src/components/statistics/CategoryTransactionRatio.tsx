import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import IncomeExpenseToggle from '../common/IncomeExpenseToggle'
import StatisticsCard from './StatisticsCard'
import type { Satisfaction, TransactionType } from '../../types/finance'
import { formatAmount, formatMonthDay, formatWon } from '../../utils/formatters'

const PREVIEW_COUNT = 3

type CategoryTransaction = {
  amount: number
  categoryId?: string
  date: string
  id: string
  memo: string
  satisfaction: Satisfaction | null
}

type CategoryRatioItem = {
  amount: number
  color: string
  id: string
  label: string
  transactions: CategoryTransaction[]
}

type CategoryTransactionRatioProps = {
  items: Record<TransactionType, CategoryRatioItem[]>
  onRatioTypeChange: (type: TransactionType) => void
  onSelectedCategoryIdChange: (id: string) => void
  ratioType: TransactionType
  selectedCategoryId: string
}

const getDonutGradient = (items: CategoryRatioItem[], totalAmount: number) => {
  let cursor = 0
  return items
    .map((item) => {
      const start = cursor
      const end = totalAmount > 0 ? cursor + (item.amount / totalAmount) * 100 : cursor
      cursor = end
      return `${item.color} ${start}% ${end}%`
    })
    .join(', ')
}

export default function CategoryTransactionRatio({
  items,
  onRatioTypeChange,
  onSelectedCategoryIdChange,
  ratioType,
  selectedCategoryId,
}: CategoryTransactionRatioProps) {
  const navigate = useNavigate()
  const previewRef = useRef<HTMLDivElement>(null)
  const activeItems = items[ratioType]
  const totalAmount = activeItems.reduce((total, item) => total + item.amount, 0)
  const selectedItem = activeItems.find((item) => item.id === selectedCategoryId) ?? null
  const donutGradient = getDonutGradient(activeItems, totalAmount)

  useEffect(() => {
    if (selectedCategoryId && previewRef.current) {
      previewRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [selectedCategoryId])

  const toggle = (
    <IncomeExpenseToggle
      onChange={(type) => {
        onRatioTypeChange(type)
        onSelectedCategoryIdChange('')
      }}
      value={ratioType}
    />
  )

  if (activeItems.length === 0) {
    return (
      <StatisticsCard action={toggle} title="카테고리 거래 비율">
        <div className="mt-5 rounded-xl bg-black/4 px-4 py-8 text-center text-sm font-semibold text-gray-400">
          아직 기록된 내역이 없어요.
        </div>
      </StatisticsCard>
    )
  }

  return (
    <StatisticsCard action={toggle} title="카테고리 거래 비율">
      <div className="mt-5 grid gap-5 md:grid-cols-[160px_minmax(0,1fr)] md:items-start">
        {/* 도넛 차트 */}
        <div
          className="relative mx-auto h-40 w-40 shrink-0 rounded-full"
          style={{ background: `conic-gradient(${donutGradient})` }}
        >
          <div className="absolute inset-6 grid place-items-center rounded-full bg-white/90 text-center">
            <p className="text-base font-extrabold text-black leading-tight">
              {selectedItem ? formatAmount(selectedItem.amount) : formatAmount(totalAmount)}
            </p>
          </div>
        </div>

        {/* 범례 */}
        <div className="grid gap-0.5">
          {activeItems.map((item) => {
            const percent = totalAmount > 0 ? Math.round((item.amount / totalAmount) * 100) : 0
            const isSelected = item.id === selectedCategoryId

            return (
              <button
                className={[
                  'flex items-center gap-2 rounded-xl px-3 py-2 text-left transition interactive-row',
                  isSelected ? 'bg-black/5' : '',
                ].join(' ')}
                key={item.id}
                onClick={() => onSelectedCategoryIdChange(isSelected ? '' : item.id)}
                type="button"
              >
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="min-w-0 flex-1 truncate text-sm font-bold text-black">{item.label}</span>
                <span className="shrink-0 text-sm font-bold text-gray-400">{percent}%</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 선택된 카테고리 프리뷰 */}
      {selectedItem && (
        <div className="mt-4" ref={previewRef}>
          <button
            className="mb-2 flex w-full items-center justify-between text-left transition active:opacity-60"
            onClick={() => void navigate(`/app/stats/category/${selectedItem.id}?type=${ratioType}`)}
            type="button"
          >
            <span className="text-[14px] font-extrabold text-gray-800">{selectedItem.label} 내역</span>
            <span className="flex items-center gap-0.5 text-[12px] font-bold text-gray-800">
              {selectedItem.transactions.length}건
              <ChevronRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
            </span>
          </button>
          <div className="divide-y divide-black/4">
            {selectedItem.transactions.slice(0, PREVIEW_COUNT).map((tx) => (
              <div className="flex items-center gap-3 py-2.5" key={tx.id}>
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: selectedItem.color }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-bold text-black">{formatMonthDay(tx.date)}</span>
                  {tx.memo ? (
                    <span className="block truncate text-[11.5px] text-(--color-text-sand)">{tx.memo}</span>
                  ) : null}
                </span>
                <span className={[
                  'shrink-0 text-[13px] font-extrabold tabular-nums',
                  ratioType === 'income' ? 'text-(--color-income-blue)' : 'text-(--color-expense-red)',
                ].join(' ')}>
                  {ratioType === 'income' ? '+' : '-'}{formatWon(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </StatisticsCard>
  )
}
