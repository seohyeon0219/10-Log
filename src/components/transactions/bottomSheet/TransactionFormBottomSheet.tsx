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
    <div className="common-bottom-sheet-backdrop">
      <section aria-modal="true" className="common-bottom-sheet" role="dialog">
        <header>
          <span aria-hidden="true" className="bottom-sheet-handle" />
          <h2>{title}</h2>
          <button aria-label="거래 입력 닫기" className="common-sheet-close-button" onClick={onClose} type="button">
            ×
          </button>
        </header>
        {children}
      </section>
    </div>
  )
}
