import TransactionFormModal from './TransactionFormModal'
import TransactionFormBottomSheet from './bottomSheet/TransactionFormBottomSheet'

type Props = Parameters<typeof TransactionFormModal>[0]

export default function ResponsiveTransactionForm(props: Props) {
  return (
    <>
      <div className="hidden md:block">
        <TransactionFormModal {...props} />
      </div>
      <div className="md:hidden">
        <TransactionFormBottomSheet {...props} />
      </div>
    </>
  )
}
