import CategoryManageContent from './CategoryManageContent'

type Category = {
  color: string
  id: string
  name: string
}

type CategoryManageBottomSheetProps = {
  expenseCategories: Category[]
  incomeCategories: Category[]
  isOpen: boolean
  onClose: () => void
}

export default function CategoryManageBottomSheet({
  expenseCategories,
  incomeCategories,
  isOpen,
  onClose,
}: CategoryManageBottomSheetProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/35">
      <section
        aria-modal="true"
        className="fixed right-0 bottom-0 left-0 max-h-[90dvh] overflow-y-auto rounded-t-3xl bg-white px-5 pt-3 pb-[calc(20px+env(safe-area-inset-bottom))] shadow-xl md:px-6"
        role="dialog"
      >
        <div className="mx-auto w-full max-w-2xl">
          <header className="mb-5 grid gap-3">
            <span aria-hidden="true" className="mx-auto h-1 w-9 rounded-full bg-gray-200" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="m-0 pt-2 text-xl font-bold text-black">카테고리 관리</h2>
                <p className="mt-2 mb-0 text-sm font-medium text-gray-400">
                  기록할 때 분류할 카테고리를 정리해요
                </p>
              </div>
              <button
                aria-label="카테고리 관리 닫기"
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-3xl leading-none text-gray-300 active:bg-gray-100"
                onClick={onClose}
                type="button"
              >
                ×
              </button>
            </div>
          </header>

          <CategoryManageContent
            expenseCategories={expenseCategories}
            incomeCategories={incomeCategories}
          />
        </div>
      </section>
    </div>
  )
}
