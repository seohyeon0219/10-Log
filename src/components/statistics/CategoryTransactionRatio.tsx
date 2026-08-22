import { useNavigate } from 'react-router-dom'
import IncomeExpenseToggle from '../common/IncomeExpenseToggle'
import StatisticsCard from './StatisticsCard'
import type { TransactionType } from '../../types/finance'
import { formatAmount } from '../../utils/formatters'

type CategoryRatioItem = {
  amount: number
  color: string
  id: string
  label: string
}

type CategoryTransactionRatioProps = {
  items: Record<TransactionType, CategoryRatioItem[]>
  onRatioTypeChange: (type: TransactionType) => void
  ratioType: TransactionType
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
  ratioType,
}: CategoryTransactionRatioProps) {
  const navigate = useNavigate()
  const activeItems = items[ratioType]
  const totalAmount = activeItems.reduce((total, item) => total + item.amount, 0)
  const donutGradient = getDonutGradient(activeItems, totalAmount)

  const toggle = (
    <IncomeExpenseToggle onChange={onRatioTypeChange} value={ratioType} />
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
              {formatAmount(totalAmount)}
            </p>
          </div>
        </div>

        {/* 범례 */}
        <div className="grid gap-0.5">
          {activeItems.map((item) => {
            const percent = totalAmount > 0 ? Math.round((item.amount / totalAmount) * 100) : 0

            return (
              <button
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-left transition interactive-row"
                key={item.id}
                onClick={() => void navigate(`/app/stats/category/${item.id}?type=${ratioType}`)}
                type="button"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="min-w-0 flex-1 truncate text-sm font-bold text-black">
                  {item.label}
                </span>
                <span className="shrink-0 text-sm font-bold text-gray-400">{percent}%</span>
              </button>
            )
          })}
        </div>
      </div>
    </StatisticsCard>
  )
}
