import CategoryManageModal from '../categories/CategoryManageModal'
import FormModal from '../common/FormModal'
import type { Category, TransactionFormValues, TransactionType } from '../../types/finance'
import TransactionFormContent from './TransactionFormContent'
import { transactionFormTextByType, type TransactionFormMode } from './transactionFormConfig'

type TransactionFormModalProps = {
  categories: Category[]
  expenseCategories?: Category[]
  incomeCategories?: Category[]
  initialAmount?: number
  initialCategoryId?: string
  initialIsFixed?: boolean
  initialMemo?: string
  isOpen: boolean
  mode?: TransactionFormMode
  onClose: () => void
  onCreateCategory?: Parameters<typeof CategoryManageModal>[0]['onCreateCategory']
  onDelete?: () => void
  onDeleteCategory?: Parameters<typeof CategoryManageModal>[0]['onDeleteCategory']
  onSave?: (values: TransactionFormValues) => void
  onUpdateCategory?: Parameters<typeof CategoryManageModal>[0]['onUpdateCategory']
  selectedDate?: Date | null
  type: TransactionType
}

export default function TransactionFormModal({
  categories,
  expenseCategories,
  incomeCategories,
  initialAmount,
  initialCategoryId,
  initialIsFixed,
  initialMemo,
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
        mode={mode}
        onDelete={onDelete}
        onSave={onSave}
        selectedDate={selectedDate}
        submitText={mode === 'edit' ? '수정 저장' : '저장'}
        type={type}
      />
    </FormModal>
  )
}
