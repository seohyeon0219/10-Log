import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import IncomeExpenseToggle from '../common/IncomeExpenseToggle'
import StatisticsCard from './StatisticsCard'
import type { Satisfaction, TransactionType } from '../../types/finance'
import { formatCompactKorean, formatWon } from '../../utils/formatters'

const TOP_COUNT = 3

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
}: CategoryTransactionRatioProps) {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)
  const activeItems = items[ratioType]
  const totalAmount = activeItems.reduce((total, item) => total + item.amount, 0)
  const donutGradient = getDonutGradient(activeItems, totalAmount)
  const topItems = activeItems.slice(0, TOP_COUNT)
  const hasMore = activeItems.length > TOP_COUNT

  const toggle = (
    <IncomeExpenseToggle
      onChange={(type) => {
        onRatioTypeChange(type)
        onSelectedCategoryIdChange('')
        setIsExpanded(false)
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

  const renderTopRow = (item: CategoryRatioItem) => {
    const percent = totalAmount > 0 ? Math.round((item.amount / totalAmount) * 100) : 0
    return (
      <button
        className="flex items-center gap-2 rounded-xl px-3 py-1 text-left transition interactive-row w-full"
        key={item.id}
        onClick={() => void navigate(`/app/stats/category/${item.id}?type=${ratioType}`)}
        type="button"
      >
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
        <span className="min-w-0 flex-1 truncate text-xs font-medium text-(--ink-1)">{item.label}</span>
        <span className="shrink-0 text-sm font-semibold text-(--ink-1)">{percent}%</span>
      </button>
    )
  }

  const renderExpandedRow = (item: CategoryRatioItem) => {
    const percent = totalAmount > 0 ? Math.round((item.amount / totalAmount) * 100) : 0
    return (
      <button
        className="flex items-center gap-3 rounded-xl px-3 py-2 text-left transition interactive-row w-full"
        key={item.id}
        onClick={() => void navigate(`/app/stats/category/${item.id}?type=${ratioType}`)}
        type="button"
      >
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-(--ink-1)">{item.label}</span>
        <span className="shrink-0 text-sm font-semibold text-(--ink-1)">{formatWon(item.amount)}</span>
        <span className="shrink-0 text-[11px] font-medium text-(--ink-2)">{percent}%</span>
        <ChevronRightIcon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-(--ink-3)" />
      </button>
    )
  }

  return (
    <StatisticsCard action={toggle} title="카테고리 거래 비율">
      <div className="mt-5 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
        {/* 도넛 차트 */}
        <div
          className="relative h-32 w-32 shrink-0 rounded-full"
          style={{ background: `conic-gradient(${donutGradient})` }}
        >
          <div className="absolute inset-4 grid place-items-center rounded-full bg-white text-center">
            <p className="text-[18px] font-semibold leading-none text-(--ink-1)">
              {formatCompactKorean(totalAmount)}
            </p>
          </div>
        </div>

        {/* 상위 3개 범례 */}
        <div className="grid gap-0.5">
          {topItems.map(renderTopRow)}
        </div>
      </div>

      {/* 전체보기 버튼 */}
      {hasMore && (
        <button
          className="mt-3 flex w-full items-center justify-between px-3 py-2 text-left transition active:opacity-60"
          onClick={() => setIsExpanded((v) => !v)}
          type="button"
        >
          <span className="text-[13px] font-semibold text-(--ink-2)">
            {isExpanded ? '접기' : `전체보기 (${activeItems.length}개)`}
          </span>
          <ChevronRightIcon
            aria-hidden="true"
            className={['h-4 w-4 text-(--ink-3) transition-transform duration-200', isExpanded ? 'rotate-90' : ''].join(' ')}
          />
        </button>
      )}

      {/* 전체 목록 */}
      {isExpanded && (
        <div className="mt-2 grid gap-0.5">
          {activeItems.map(renderExpandedRow)}
        </div>
      )}
    </StatisticsCard>
  )
}
