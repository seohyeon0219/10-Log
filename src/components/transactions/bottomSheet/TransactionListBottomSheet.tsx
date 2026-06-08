import BottomSheet from '../../common/BottomSheet'
import TransactionDateList from '../TransactionDateList'

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
  onSelectTransaction?: (transaction: TransactionItem) => void
  selectedDate: Date | null
  transactions: TransactionItem[]
}

export default function TransactionListBottomSheet({
  isOpen,
  onAddExpense,
  onAddIncome,
  onClose,
  onSelectTransaction,
  selectedDate,
  transactions,
}: TransactionListBottomSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} maxHeightClassName="max-h-[82dvh]" onClose={onClose}>
      <TransactionDateList
        onAddExpense={onAddExpense}
        onAddIncome={onAddIncome}
        onSelectTransaction={onSelectTransaction}
        selectedDate={selectedDate}
        transactions={transactions}
      />
    </BottomSheet>
  )
}
