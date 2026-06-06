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
    <div className="fixed inset-0 z-50 bg-black/40">
      <section
        aria-modal="true"
        className="fixed right-0 bottom-0 left-0 max-h-dvh overflow-y-auto rounded-t-xl bg-white p-6 max-sm:px-4 max-sm:pb-4"
        role="dialog"
      >
        <header className="relative mb-6 flex w-full items-center justify-between gap-3">
          <span
            aria-hidden="true"
            className="absolute top-2 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-(--color-gray)"
          />
          <h2 className="m-0 min-w-0 flex-1 text-xl font-extrabold text-black">{dateLabel}</h2>
          <button
            aria-label="거래 내역 닫기"
            className="h-9 w-9 cursor-pointer border-0 bg-transparent text-3xl leading-none text-gray-400"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </header>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <button
            className="min-h-12 cursor-pointer rounded-xl border border-blue-200 bg-blue-50 font-extrabold text-(--color-income-blue)"
            onClick={onAddIncome}
            type="button"
          >
            + 수입
          </button>
          <button
            className="min-h-12 cursor-pointer rounded-xl border border-red-200 bg-red-50 font-extrabold text-(--color-expense-red)"
            onClick={onAddExpense}
            type="button"
          >
            - 지출
          </button>
        </div>

        <div className="grid gap-0">{children}</div>
      </section>
    </div>
  )
}
