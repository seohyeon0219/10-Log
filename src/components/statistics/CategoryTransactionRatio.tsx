import { useStatisticsStore } from '../../stores/statisticsStore'
import IncomeExpenseToggle from '../common/IncomeExpenseToggle'
import SimpleListItem from '../common/SimpleListItem'
import StatisticsCard from './StatisticsCard'

type TransactionType = 'income' | 'expense'

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
  onSelectTransaction?: (transaction: {
    amount: number
    categoryId: string
    date: string
    id: string
    memo: string
    type: TransactionType
  }) => void
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

export default function CategoryTransactionRatio({ items, onSelectTransaction }: CategoryTransactionRatioProps) {
  const ratioType = useStatisticsStore((state) => state.ratioType)
  const selectedCategoryId = useStatisticsStore((state) => state.ratioSelectedCategoryId)
  const setRatioType = useStatisticsStore((state) => state.setRatioType)
  const setSelectedCategoryId = useStatisticsStore((state) => state.setRatioSelectedCategoryId)

  const activeItems = items[ratioType]
  const totalAmount = activeItems.reduce((total, item) => total + item.amount, 0)
  const selectedItem = activeItems.find((item) => item.id === selectedCategoryId) ?? activeItems[0]
  const donutGradient = getDonutGradient(activeItems, totalAmount)
  const selectedPercent = selectedItem && totalAmount > 0 ? Math.round((selectedItem.amount / totalAmount) * 100) : 0

  if (activeItems.length === 0 || !selectedItem) {
    return (
      <StatisticsCard
        action={
          <IncomeExpenseToggle
            onChange={(type) => {
              setRatioType(type)
              setSelectedCategoryId(items[type][0]?.id ?? '')
            }}
            value={ratioType}
          />
        }
        eyebrow="카테고리 거래 비율"
        title={`이번 달 ${ratioType === 'expense' ? '지출이' : '수입이'} 어디에 모였는지 봐요`}
      >
        <div className="mt-5 rounded-xl bg-gray-50 px-4 py-8 text-center text-sm font-semibold text-gray-400">
          아직 기록된 내역이 없어요.
        </div>
      </StatisticsCard>
    )
  }

  return (
    <StatisticsCard
      action={
        <IncomeExpenseToggle
          onChange={(type) => {
            setRatioType(type)
            setSelectedCategoryId(items[type][0]?.id ?? '')
          }}
          value={ratioType}
        />
      }
      eyebrow="카테고리 거래 비율"
      title={`이번 달 ${ratioType === 'expense' ? '지출이' : '수입이'} 어디에 모였는지 봐요`}
    >
      <div className="mt-5 grid gap-5 md:grid-cols-[180px_minmax(0,1fr)] md:items-center">
        <div className="relative mx-auto h-44 w-44 rounded-full" style={{ background: `conic-gradient(${donutGradient})` }}>
          <div className="absolute inset-6 grid place-items-center rounded-full bg-white text-center">
            <p className="mt-4 text-base font-bold text-(--color-dark-gray)">{selectedItem.label}</p>
            <p className="mb-4 text-2xl font-extrabold text-black">{selectedPercent}%</p>
          </div>
        </div>

        <div className="grid gap-2">
          {activeItems.map((item) => {
            const percent = totalAmount > 0 ? Math.round((item.amount / totalAmount) * 100) : 0
            const isSelected = item.id === selectedItem.id

            return (
              <button
                className={[
                  'grid min-h-12 cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border px-4 text-left transition',
                  isSelected ? 'border-gray-200 bg-gray-50' : 'border-transparent bg-white hover:bg-gray-50',
                ].join(' ')}
                key={item.id}
                onClick={() => setSelectedCategoryId(item.id)}
                type="button"
              >
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="min-w-0 truncate text-sm font-extrabold text-black">{item.label}</span>
                <span className="text-sm font-bold text-(--color-dark-gray)">{percent}%</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.03)]">
        <div className="flex items-end justify-between gap-3 p-2">
          <div>
            <p className="text-sm font-bold text-black">{selectedItem.label} 내역</p>
          </div>
          <p className="text-sm font-extrabold text-(--color-dark-gray)">{selectedItem.amount.toLocaleString('ko-KR')}원</p>
        </div>

        <div className="mt-2 grid max-h-80 gap-1 overflow-y-auto border-t border-gray-100 pt-2 pr-1">
          {selectedItem.transactions.map((transaction) => (
            <SimpleListItem
              amount={transaction.amount}
              categoryColor={selectedItem.color}
              categoryName={selectedItem.label}
              date={transaction.date}
              key={transaction.id}
              memo={transaction.memo}
              onClick={() =>
                onSelectTransaction?.({
                  ...transaction,
                  categoryId: transaction.categoryId ?? selectedItem.id,
                  type: ratioType,
                })
              }
              type={ratioType}
            />
          ))}
        </div>
      </div>
    </StatisticsCard>
  )
}
