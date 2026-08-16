import CategoryManageBottomSheet from '../../categories/CategoryManageBottomSheet'
import BottomSheet from '../../common/BottomSheet'
import type { Category, Satisfaction, TransactionFormValues, TransactionType } from '../../../types/finance'
import TransactionFormContent from '../TransactionFormContent'
import { transactionFormTextByType, type TransactionFormMode } from '../transactionFormConfig'

type TransactionFormBottomSheetProps = {
  categories: Category[]
  expenseCategories?: Category[]
  incomeCategories?: Category[]
  initialAmount?: number
  initialCategoryId?: string
  initialIsFixed?: boolean
  initialMemo?: string
  initialSatisfaction?: Satisfaction | null
  isOpen: boolean
  mode?: TransactionFormMode
  onClose: () => void
  onCreateCategory?: Parameters<typeof CategoryManageBottomSheet>[0]['onCreateCategory']
  onDelete?: () => void
  onDeleteCategory?: Parameters<typeof CategoryManageBottomSheet>[0]['onDeleteCategory']
  onSave?: (values: TransactionFormValues) => void
  onUpdateCategory?: Parameters<typeof CategoryManageBottomSheet>[0]['onUpdateCategory']
  selectedDate?: Date | null
  type: TransactionType
}

export default function TransactionFormBottomSheet({
  categories,
  expenseCategories,
  incomeCategories,
  initialAmount,
  initialCategoryId,
  initialIsFixed,
  initialMemo,
  initialSatisfaction,
  isOpen,
  mode = 'create',
  onClose,
  onCreateCategory,
  onDelete,
  onDeleteCategory,
  onSave,
  onUpdateCategory,
  selectedDate,
  type,
}: TransactionFormBottomSheetProps) {
  const formText = transactionFormTextByType[type]
  const canManageCategories = Boolean(expenseCategories?.length && incomeCategories?.length)
  const title = mode === 'edit' ? formText.editTitle : formText.createTitle

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={title}>
      <TransactionFormContent
        categories={categories}
        categoryManageOverlay={canManageCategories ? (isOpen, onClose) => (
          <CategoryManageBottomSheet
            expenseCategories={expenseCategories ?? []}
            initialType={type}
            incomeCategories={incomeCategories ?? []}
            isOpen={isOpen}
            onCreateCategory={onCreateCategory}
            onClose={onClose}
            onDeleteCategory={onDeleteCategory}
            onUpdateCategory={onUpdateCategory}
          />
        ) : undefined}
        fixedLabel={formText.fixedLabel}
        initialAmount={initialAmount}
        initialCategoryId={initialCategoryId}
        initialIsFixed={initialIsFixed}
        initialMemo={initialMemo}
        initialSatisfaction={initialSatisfaction}
        mode={mode}
        onDelete={onDelete}
        onSave={onSave}
        selectedDate={selectedDate}
        submitText={mode === 'edit' ? '수정 저장' : '저장'}
        type={type}
      />
    </BottomSheet>
  )
}
