import type { TransactionType } from '../../types/finance'

export type TransactionDateListItem = {
  amount: number
  categoryId?: string
  categoryColor: string
  categoryName: string
  date?: string
  id: string
  isFixed?: boolean
  memo?: string
  type: TransactionType
}

type TransactionDateListProps = {
  onAddExpense?: () => void
  onAddIncome?: () => void
  onSelectTransaction?: (transaction: TransactionDateListItem) => void
  selectedDate: Date | null
  transactions: TransactionDateListItem[]
}

export default function TransactionDateList({
  onAddExpense,
  onAddIncome,
  onSelectTransaction,
  selectedDate,
  transactions,
}: TransactionDateListProps) {
  if (!selectedDate) {
    return (
      <div className="flex min-h-60 items-center justify-center text-center">
        <p className="m-0 text-sm font-medium text-gray-400">날짜를 선택하면 내역이 보여요</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[14px] font-extrabold text-black">
          {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 내역
        </p>
      </div>

      {transactions.length === 0 ? (
        <p className="mt-3 text-[13px] text-(--color-text-sand)">이 날의 기록이 아직 없어요.</p>
      ) : (
        <div className="mt-2.5 grid gap-1.5">
          {transactions.map((tx) => (
            <button
              key={tx.id}
              className="flex w-full items-center gap-2 rounded-[14px] bg-white/50 px-3 py-2.5 text-left transition hover:bg-white/70"
              onClick={onSelectTransaction ? () => onSelectTransaction(tx) : undefined}
              type="button"
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: tx.categoryColor }}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-bold text-black">{tx.categoryName}</span>
                {tx.memo ? (
                  <span className="block truncate text-[11.5px] text-(--color-text-sand)">{tx.memo}</span>
                ) : null}
              </span>
              <span
                className={[
                  'shrink-0 text-[13.5px] font-extrabold',
                  tx.type === 'income' ? 'text-(--color-income-blue)' : 'text-(--color-expense-red)',
                ].join(' ')}
              >
                {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString('ko-KR')}원
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  )
}
