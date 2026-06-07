import TransactionFormContent from './TransactionFormContent'
import {
  transactionFormTextByType,
  type TransactionCategory,
  type TransactionType,
} from './transactionFormConfig'

type TransactionFormModalProps = {
  categories: TransactionCategory[]
  isOpen: boolean
  onClose: () => void
  onDelete?: () => void
  onSave?: () => void
  selectedDate?: Date | null
  type: TransactionType
}

export default function TransactionFormModal({
  categories,
  isOpen,
  onClose,
  onDelete,
  onSave,
  selectedDate,
  type,
}: TransactionFormModalProps) {
  const formText = transactionFormTextByType[type]

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4 py-6">
      <section
        aria-modal="true"
        className="w-full max-w-110 rounded-2xl bg-white px-6 pt-6 pb-5 shadow-xl"
        role="dialog"
      >
        <header className="mb-8 flex items-start justify-between gap-4">
          <h2 className="m-0 pt-1 text-xl font-bold text-black">{formText.title}</h2>
          <button
            aria-label="거래 입력 닫기"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-transparent text-3xl leading-none text-gray-300 transition hover:bg-gray-50 hover:text-gray-500 active:bg-gray-100"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </header>

        <TransactionFormContent
          categories={categories}
          fixedLabel={formText.fixedLabel}
          onDelete={onDelete}
          onSave={onSave}
          selectedDate={selectedDate}
          type={type}
        />
      </section>
    </div>
  )
}
