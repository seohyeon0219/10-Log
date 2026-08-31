import type { Satisfaction, TransactionType } from '../../types/finance'
import { formatMonthDay, formatWon } from '../../utils/formatters'

export type TransactionDateListItem = {
  amount: number
  categoryId?: string
  categoryColor: string
  categoryName: string
  date?: string
  id: string
  isFixed?: boolean
  memo?: string
  satisfaction?: Satisfaction | null
  type: TransactionType
}

type TransactionDateListProps = {
  onSelectTransaction?: (transaction: TransactionDateListItem) => void
  selectedDate: Date | null
  transactions: TransactionDateListItem[]
}

export default function TransactionDateList({
  onSelectTransaction,
  selectedDate,
  transactions,
}: TransactionDateListProps) {
  if (!selectedDate) {
    return (
      <div className="flex min-h-60 items-center justify-center text-center">
        <p className="m-0 text-sm font-medium text-(--ink-3)">날짜를 선택하면 내역이 보여요</p>
      </div>
    )
  }

  const totalIncome = transactions.reduce((s, t) => t.type === 'income' ? s + t.amount : s, 0)
  const totalExpense = transactions.reduce((s, t) => t.type === 'expense' ? s + t.amount : s, 0)

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[14px] font-extrabold text-(--ink-1)">
          {formatMonthDay(selectedDate)} 내역
        </p>
      </div>

      {transactions.length > 0 && (
        <div className="mt-1.5 mb-2 flex gap-3">
          {totalIncome > 0 && (
            <span className="text-xs font-semibold text-(--color-income-blue)">
              수입 +{formatWon(totalIncome)}
            </span>
          )}
          {totalExpense > 0 && (
            <span className="text-xs font-semibold text-(--color-expense-red)">
              지출 {formatWon(totalExpense)}
            </span>
          )}
        </div>
      )}

      {transactions.length === 0 ? (
        <p className="mt-3 text-[13px] text-(--ink-3)">이 날의 기록이 아직 없어요.</p>
      ) : (
        <div className="mt-2.5 grid gap-1.5">
          {transactions.map((tx) => (
            <button
              key={tx.id}
              className="flex w-full items-center gap-[9px] rounded-[12px] px-[12px] py-[9px] text-left transition hover:brightness-95"
              onClick={onSelectTransaction ? () => onSelectTransaction(tx) : undefined}
              style={{ background: 'rgba(255,255,255,0.45)' }}
              type="button"
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: tx.categoryColor }}
              />
              <span className="min-w-0 flex-1">
                {tx.memo ? (
                  <span className="block truncate text-[13px] font-semibold text-(--ink-1)">{tx.memo}</span>
                ) : (
                  <span className="block text-[13px] font-semibold text-(--ink-3)">메모 없음</span>
                )}
                <span className="block text-[11px] font-medium text-(--ink-3)">{tx.categoryName}</span>
              </span>
              <span className={['shrink-0 text-[13px] font-semibold tabular-nums', tx.type === 'income' ? 'text-(--color-income-blue)' : 'text-(--ink-1)'].join(' ')}>
                {tx.type === 'income' ? '+' : ''}{formatWon(tx.amount)}
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  )
}
