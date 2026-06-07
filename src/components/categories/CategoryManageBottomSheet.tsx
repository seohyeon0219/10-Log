import CategoryManageContent from './CategoryManageContent'
import BottomSheet from '../common/BottomSheet'

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
  return (
    <BottomSheet
      description="기록할 때 분류할 카테고리를 정리해요"
      isOpen={isOpen}
      onClose={onClose}
      title="카테고리 관리"
    >
      <CategoryManageContent
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
      />
    </BottomSheet>
  )
}
