import CategoryManageContent from './CategoryManageContent'
import FormModal from '../common/FormModal'

type Category = {
  color: string
  id: string
  name: string
}

type CategoryManageModalProps = {
  expenseCategories: Category[]
  incomeCategories: Category[]
  isOpen: boolean
  onCreateCategory?: Parameters<typeof CategoryManageContent>[0]['onCreateCategory']
  onDeleteCategory?: Parameters<typeof CategoryManageContent>[0]['onDeleteCategory']
  onUpdateCategory?: Parameters<typeof CategoryManageContent>[0]['onUpdateCategory']
  onClose: () => void
}

export default function CategoryManageModal({
  expenseCategories,
  incomeCategories,
  isOpen,
  onCreateCategory,
  onClose,
  onDeleteCategory,
  onUpdateCategory,
}: CategoryManageModalProps) {
  return (
    <FormModal
      description="기록할 때 분류할 카테고리를 정리해요"
      isOpen={isOpen}
      onClose={onClose}
      title="카테고리 관리"
    >
      <CategoryManageContent
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
        onCreateCategory={onCreateCategory}
        onDeleteCategory={onDeleteCategory}
        onUpdateCategory={onUpdateCategory}
      />
    </FormModal>
  )
}
