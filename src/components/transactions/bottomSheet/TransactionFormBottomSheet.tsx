import { useState } from 'react'
import CategoryManageBottomSheet from '../../categories/CategoryManageBottomSheet'
import TransactionFormContent from '../TransactionFormContent'
import {
  transactionFormTextByType,
  type TransactionCategory,
  type TransactionFormMode,
  type TransactionType,
} from '../transactionFormConfig'

type TransactionFormBottomSheetProps = {
  categories: TransactionCategory[]
  expenseCategories?: TransactionCategory[]
  incomeCategories?: TransactionCategory[]
  initialAmount?: number
  initialCategoryId?: string
  initialMemo?: string
  isOpen: boolean
  mode?: TransactionFormMode
  onClose: () => void
  onDelete?: () => void
  onSave?: () => void
  selectedDate?: Date | null
  type: TransactionType
}

export default function TransactionFormBottomSheet({
  categories,
  expenseCategories,
  incomeCategories,
  initialAmount,
  initialCategoryId,
  initialMemo,
  isOpen,
  mode = 'create',
  onClose,
  onDelete,
  onSave,
  selectedDate,
  type,
}: TransactionFormBottomSheetProps) {
  const [isCategoryManageOpen, setIsCategoryManageOpen] = useState(false)
  const formText = transactionFormTextByType[type]
  const canManageCategories = Boolean(expenseCategories?.length && incomeCategories?.length)
  const title = mode === 'edit' ? formText.editTitle : formText.createTitle

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
          <header className="mb-6 grid gap-3">
            <span aria-hidden="true" className="mx-auto h-1 w-9 rounded-full bg-gray-200" />
            <div className="flex items-start justify-between gap-4">
              <h2 className="m-0 pt-2 text-xl font-bold text-black">{title}</h2>
              <button
                aria-label="거래 입력 닫기"
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-3xl leading-none text-gray-300 active:bg-gray-100"
                onClick={onClose}
                type="button"
              >
                ×
              </button>
            </div>
          </header>

          <TransactionFormContent
            categories={categories}
            fixedLabel={formText.fixedLabel}
            initialAmount={initialAmount}
            initialCategoryId={initialCategoryId}
            initialMemo={initialMemo}
            onDelete={onDelete}
            onManageCategories={canManageCategories ? () => setIsCategoryManageOpen(true) : undefined}
            onSave={onSave}
            selectedDate={selectedDate}
            submitText={mode === 'edit' ? '수정 저장' : '저장'}
            type={type}
          />
        </div>
      </section>

      {canManageCategories ? (
        <CategoryManageBottomSheet
          expenseCategories={expenseCategories ?? []}
          incomeCategories={incomeCategories ?? []}
          isOpen={isCategoryManageOpen}
          onClose={() => setIsCategoryManageOpen(false)}
        />
      ) : null}
    </div>
  )
}
