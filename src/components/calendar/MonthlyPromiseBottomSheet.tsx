import BottomSheet from '../common/BottomSheet'
import MonthlyPromiseFormContent from './MonthlyPromiseFormContent'

type MonthlyPromiseBottomSheetProps = {
  budgetAmount: number
  isRegistered: boolean
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
  onSave: (values: { budgetAmount: number }) => void
}

export default function MonthlyPromiseBottomSheet({
  budgetAmount,
  isRegistered,
  isOpen,
  onClose,
  onDelete,
  onSave,
}: MonthlyPromiseBottomSheetProps) {
  return (
    <BottomSheet
      description="이번 달 목표 예산을 설정해보세요."
      isOpen={isOpen}
      onClose={onClose}
      title={isRegistered ? '소비 목표 수정' : '소비 목표 등록'}
    >
      <MonthlyPromiseFormContent
        budgetAmount={budgetAmount}
        isRegistered={isRegistered}
        onClose={onClose}
        onDelete={onDelete}
        onSave={onSave}
      />
    </BottomSheet>
  )
}
