import type { ReactNode } from 'react'

type TransactionFormBottomSheetProps = {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  title: string
}

export default function TransactionFormBottomSheet({
  children,
  isOpen,
  onClose,
  title,
}: TransactionFormBottomSheetProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-[rgb(17_17_17_/_40%)]">
      <section
        aria-modal="true"
        className="fixed right-0 bottom-0 left-0 max-h-[min(80dvh,640px)] overflow-y-auto rounded-t-[var(--radius-12)] bg-[var(--color-white)] p-6 max-[480px]:px-4 max-[480px]:pb-4"
        role="dialog"
      >
        <header className="relative mb-6 flex w-full items-center justify-between gap-3">
          <span
            aria-hidden="true"
            className="absolute top-[var(--spacing-8)] left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-[var(--color-gray)]"
          />
          <h2 className="m-0 min-w-0 flex-1 text-xl font-extrabold text-[var(--color-black)]">{title}</h2>
          <button
            aria-label="거래 입력 닫기"
            className="h-9 w-9 cursor-pointer border-0 bg-transparent text-3xl leading-none text-gray-400"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </header>
        {children}
      </section>
    </div>
  )
}
