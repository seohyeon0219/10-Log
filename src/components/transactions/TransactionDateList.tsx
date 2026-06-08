import ListItem from '../common/ListItem'
import TransactionDateActions from './TransactionDateActions'

export type TransactionDateListItem = {
  amount: number
  categoryId?: string
  categoryColor: string
  categoryName: string
  date?: string
  id: string
  isFixed?: boolean
  memo?: string
  type: string
}

type TransactionDateListProps = {
  emptyText?: string
  onAddExpense?: () => void
  onAddIncome?: () => void
  onSelectTransaction?: (transaction: TransactionDateListItem) => void
  selectedDate: Date | null
  transactions: TransactionDateListItem[]
}

export default function TransactionDateList({
  emptyText = '날짜를 선택하면 내역이 보여요',
  onAddExpense,
  onAddIncome,
  onSelectTransaction,
  selectedDate,
  transactions,
}: TransactionDateListProps) {
  if (!selectedDate) {
    return (
      <div className="flex min-h-60 items-center justify-center text-center">
        <p className="m-0 text-sm font-medium text-gray-400">{emptyText}</p>
      </div>
    )
  }

  return (
    <>
      <TransactionDateActions
        onAddExpense={onAddExpense}
        onAddIncome={onAddIncome}
        selectedDate={selectedDate}
      />
      <div className="mt-4 grid gap-1 border-t border-gray-100 pt-3">
        {transactions.map((transaction) => (
          <ListItem
            amount={transaction.amount}
            color={transaction.categoryColor}
            key={transaction.id}
            memo={transaction.memo}
            onClick={
              onSelectTransaction ? () => onSelectTransaction(transaction) : undefined
            }
            title={transaction.categoryName}
            type={transaction.type}
          />
        ))}
      </div>
    </>
  )
}
