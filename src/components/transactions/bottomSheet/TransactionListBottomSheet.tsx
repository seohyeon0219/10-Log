import BottomSheet from '../../common/BottomSheet'
import TransactionDateList, { type TransactionDateListItem } from '../TransactionDateList'

type TransactionListBottomSheetProps = {
  isOpen: boolean
  onClose: () => void
  onSelectTransaction?: (transaction: TransactionDateListItem) => void
  selectedDate: Date | null
  transactions: TransactionDateListItem[]
}

export default function TransactionListBottomSheet({
  isOpen,
  onClose,
  onSelectTransaction,
  selectedDate,
  transactions,
}: TransactionListBottomSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} maxHeightClassName="max-h-[82dvh]" onClose={onClose}>
      <TransactionDateList
        onSelectTransaction={onSelectTransaction}
        selectedDate={selectedDate}
        transactions={transactions}
      />
    </BottomSheet>
  )
}
