import type { ReactNode } from 'react'

type TransactionListBottomSheetProps = {
  children: ReactNode
  dateLabel: string
  isOpen: boolean
  onAddExpense?: () => void
  onAddIncome?: () => void
  onClose: () => void
}

export default function TransactionListBottomSheet({
  children,
  dateLabel,
  isOpen,
  onAddExpense,
  onAddIncome,
  onClose,
}: TransactionListBottomSheetProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="common-bottom-sheet-backdrop">
      <section aria-modal="true" className="common-bottom-sheet common-transaction-list-bottom-sheet" role="dialog">
        <header>
          <span aria-hidden="true" className="bottom-sheet-handle" />
          <h2>{dateLabel}</h2>
          <button aria-label="거래 내역 닫기" className="common-sheet-close-button" onClick={onClose} type="button">
            ×
          </button>
        </header>

        <div className="common-transaction-list-actions">
          <button className="common-transaction-list-add income" onClick={onAddIncome} type="button">
            + 수입
          </button>
          <button className="common-transaction-list-add expense" onClick={onAddExpense} type="button">
            - 지출
          </button>
        </div>

        <div className="common-transaction-list-bottom-sheet-body">{children}</div>
      </section>
    </div>
  )
}
