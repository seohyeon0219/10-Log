import CalendarDateActions from '../../calendar/CalendarDateActions'

type TransactionItem = {
  id: string
  amount: number
  categoryColor: string
  categoryName: string
  memo?: string
  type: string
}

type TransactionListBottomSheetProps = {
  isOpen: boolean
  onAddExpense?: () => void
  onAddIncome?: () => void
  onClose: () => void
  selectedDate: Date | null
  transactions: TransactionItem[]
}

const formatAmount = (amount: number) => amount.toLocaleString('ko-KR')

export default function TransactionListBottomSheet({
  isOpen,
  onAddExpense,
  onAddIncome,
  onClose,
  selectedDate,
  transactions,
}: TransactionListBottomSheetProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40">
      <section
        aria-modal="true"
        className="fixed right-0 bottom-0 left-0 max-h-dvh overflow-y-auto rounded-t-xl bg-white p-6 max-sm:px-4 max-sm:pb-4"
        role="dialog"
      >
        <header className="relative mb-4 flex w-full items-center justify-end">
          <span
            aria-hidden="true"
            className="absolute top-2 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-(--color-gray)"
          />
          <button
            aria-label="거래 내역 닫기"
            className="h-9 w-9 cursor-pointer border-0 bg-transparent text-3xl leading-none text-gray-400"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </header>

        <CalendarDateActions
          onAddExpense={onAddExpense}
          onAddIncome={onAddIncome}
          selectedDate={selectedDate}
        />

        <div className="mt-5 grid gap-0 border-t border-gray-100">
          {transactions.map((transaction) => (
            <TransactionListItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </section>
    </div>
  )
}

type TransactionListItemProps = {
  transaction: TransactionItem
}

function TransactionListItem({ transaction }: TransactionListItemProps) {
  const isIncome = transaction.type === 'income'

  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="h-3 w-3 flex-none rounded-full"
          style={{ backgroundColor: transaction.categoryColor }}
        />
        <div className="min-w-0">
          <p className="m-0 truncate text-sm font-bold text-black">{transaction.categoryName}</p>
          {transaction.memo ? (
            <p className="m-0 truncate text-xs font-medium text-(--color-dark-gray)">
              {transaction.memo}
            </p>
          ) : null}
        </div>
      </div>

      <strong
        className={[
          'shrink-0 text-right text-sm font-bold',
          isIncome ? 'text-(--color-income-blue)' : 'text-(--color-expense-red)',
        ].join(' ')}
      >
        {isIncome ? '+' : '-'}
        {formatAmount(transaction.amount)}
      </strong>
    </div>
  )
}
