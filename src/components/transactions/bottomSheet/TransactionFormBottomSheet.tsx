import CategoryManageBottomSheet from '../../categories/CategoryManageBottomSheet'
import BottomSheet from '../../common/BottomSheet'
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
            incomeCategories={incomeCategories ?? []}
            isOpen={isOpen}
            onClose={onClose}
          />
        ) : undefined}
        fixedLabel={formText.fixedLabel}
        initialAmount={initialAmount}
        initialCategoryId={initialCategoryId}
        initialMemo={initialMemo}
        onDelete={onDelete}
        onSave={onSave}
        selectedDate={selectedDate}
        submitText={mode === 'edit' ? '수정 저장' : '저장'}
        type={type}
      />
    </BottomSheet>
  )
}
