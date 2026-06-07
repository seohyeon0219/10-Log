import CategoryManageContent from './CategoryManageContent'

type Category = {
  color: string
  id: string
  name: string
}

type CategoryManageModalProps = {
  expenseCategories: Category[]
  incomeCategories: Category[]
  isOpen: boolean
  onClose: () => void
}

export default function CategoryManageModal({
  expenseCategories,
  incomeCategories,
  isOpen,
  onClose,
}: CategoryManageModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4 py-6">
      <section
        aria-modal="true"
        className="flex max-h-[88dvh] w-full max-w-[500px] flex-col rounded-2xl bg-white shadow-xl"
        role="dialog"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 px-6 pt-6 pb-4">
          <div>
            <h2 className="m-0 text-xl font-bold text-black">카테고리 관리</h2>
            <p className="mt-2 mb-0 text-sm font-medium text-gray-400">
              기록할 때 분류할 카테고리를 정리해요
            </p>
          </div>
          <button
            aria-label="카테고리 관리 닫기"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-transparent text-xl leading-none text-gray-300 transition hover:bg-gray-50 hover:text-gray-500 active:bg-gray-100"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </header>

        <div className="min-h-0 overflow-y-auto px-6 pb-6">
          <CategoryManageContent
            expenseCategories={expenseCategories}
            incomeCategories={incomeCategories}
          />
        </div>
      </section>
    </div>
  )
}
