import IncomeExpenseToggle from '../common/IncomeExpenseToggle'
import StatisticsCard from './StatisticsCard'
import type { TransactionType } from '../../types/finance'
import { formatAmount, formatMonthDay, formatWon } from '../../utils/formatters'

type CategoryTransaction = {
  amount: number
  categoryId?: string
  date: string
  id: string
  memo: string
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
  onSelectTransaction?: (transaction: {
    amount: number
    categoryId: string
    date: string
    id: string
    memo: string
    type: TransactionType
  }) => void
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
  onSelectTransaction,
  onSelectedCategoryIdChange,
  ratioType,
  selectedCategoryId,
}: CategoryTransactionRatioProps) {
  const activeItems = items[ratioType]
  const totalAmount = activeItems.reduce((total, item) => total + item.amount, 0)
  const selectedItem = activeItems.find((item) => item.id === selectedCategoryId) ?? null
  const donutGradient = getDonutGradient(activeItems, totalAmount)

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
            const isSelected = selectedItem !== null && item.id === selectedItem.id

            return (
              <button
                className={[
                  'flex items-center gap-2 rounded-xl px-3 py-2 text-left transition interactive-row',
                  isSelected ? 'bg-black/5' : '',
                ].join(' ')}
                key={item.id}
                onClick={() => onSelectedCategoryIdChange(item.id)}
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

      {/* 선택된 카테고리 거래 내역 */}
      {selectedItem && (
        <div className="mt-4">
          <p className="text-[14px] font-extrabold text-black">{selectedItem.label} 내역</p>
          {selectedItem.transactions.length === 0 ? (
            <p className="mt-3 text-[13px] text-(--color-text-sand)">이 카테고리의 내역이 없어요.</p>
          ) : (
            <div className="mt-2.5 grid max-h-64 gap-1.5 overflow-y-auto">
              {selectedItem.transactions.map((tx) => (
                <button
                  key={tx.id}
                  className="flex w-full items-center gap-2 rounded-[14px] bg-white/50 px-3 py-2.5 text-left"
                  onClick={() =>
                    onSelectTransaction?.({
                      ...tx,
                      categoryId: tx.categoryId ?? selectedItem.id,
                      type: ratioType,
                    })
                  }
                  type="button"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: selectedItem.color }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-bold text-black">
                      {formatMonthDay(tx.date)}
                    </span>
                    {tx.memo ? (
                      <span className="block truncate text-[11.5px] text-(--color-text-sand)">
                        {tx.memo}
                      </span>
                    ) : null}
                  </span>
                  <span
                    className={[
                      'shrink-0 text-[13.5px] font-extrabold',
                      ratioType === 'income' ? 'text-(--color-income-blue)' : 'text-(--color-expense-red)',
                    ].join(' ')}
                  >
                    {ratioType === 'income' ? '+' : '-'}
                    {formatWon(tx.amount)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </StatisticsCard>
  )
}
