import CategoryManageModal from '../categories/CategoryManageModal'
import FormModal from '../common/FormModal'
import TransactionFormContent from './TransactionFormContent'
import {
  transactionFormTextByType,
  type TransactionCategory,
  type TransactionFormMode,
  type TransactionType,
} from './transactionFormConfig'

type TransactionFormModalProps = {
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

export default function TransactionFormModal({
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
}: TransactionFormModalProps) {
  const formText = transactionFormTextByType[type]
  const canManageCategories = Boolean(expenseCategories?.length && incomeCategories?.length)
  const title = mode === 'edit' ? formText.editTitle : formText.createTitle

  return (
    <FormModal isOpen={isOpen} onClose={onClose} title={title}>
      <TransactionFormContent
        categories={categories}
        categoryManageOverlay={canManageCategories ? (isOpen, onClose) => (
          <CategoryManageModal
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
    </FormModal>
  )
}
