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
    <div className="fixed inset-0 z-50 bg-black/35">
      <section
        aria-modal="true"
        className="fixed right-0 bottom-0 left-0 max-h-[82dvh] overflow-y-auto rounded-t-3xl bg-white px-5 pt-3 pb-[calc(20px+env(safe-area-inset-bottom))] shadow-xl md:px-6"
        role="dialog"
      >
        <div className="mx-auto w-full max-w-2xl">
          <header className="mb-4 grid w-full gap-2">
            <span
              aria-hidden="true"
              className="mx-auto h-1 w-9 rounded-full bg-gray-200"
            />
            <button
              aria-label="거래 내역 닫기"
              className="ml-auto flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-3xl leading-none text-gray-300 active:bg-gray-100"
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

          <div className="mt-5 grid gap-1 border-t border-gray-100 pt-2">
            {transactions.map((transaction) => (
              <TransactionListItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
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
    <div className="flex min-h-16 items-center justify-between gap-4 rounded-xl px-1 py-3.5 active:bg-gray-50">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="h-3 w-3 flex-none rounded-full"
          style={{ backgroundColor: transaction.categoryColor }}
        />
        <div className="min-w-0">
          <p className="m-0 truncate text-[15px] font-bold leading-5 text-black md:text-base">{transaction.categoryName}</p>
          {transaction.memo ? (
            <p className="m-0 mt-0.5 truncate text-[13px] leading-5 font-medium text-(--color-dark-gray)">
              {transaction.memo}
            </p>
          ) : null}
        </div>
      </div>

      <strong
        className={[
          'shrink-0 text-right text-[15px] font-bold leading-5 md:text-base',
          isIncome ? 'text-(--color-income-blue)' : 'text-(--color-expense-red)',
        ].join(' ')}
      >
        {isIncome ? '+' : '-'}
        {formatAmount(transaction.amount)}
      </strong>
    </div>
  )
}
