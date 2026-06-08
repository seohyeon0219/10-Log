import BottomSheet from '../common/BottomSheet'
import MonthlyPromiseFormContent from './MonthlyPromiseFormContent'

type MonthlyPromiseBottomSheetProps = {
  budgetAmount: number
  isRegistered: boolean
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
  onSave: (values: { budgetAmount: number; promise: string }) => void
  promise: string
}

export default function MonthlyPromiseBottomSheet({
  budgetAmount,
  isRegistered,
  isOpen,
  onClose,
  onDelete,
  onSave,
  promise,
}: MonthlyPromiseBottomSheetProps) {
  return (
    <BottomSheet
      description="이번 달 돈 관리의 기준을 정해보세요."
      isOpen={isOpen}
      onClose={onClose}
      title={isRegistered ? '월간 다짐 수정' : '월간 다짐 등록'}
    >
      <MonthlyPromiseFormContent
        budgetAmount={budgetAmount}
        isRegistered={isRegistered}
        onClose={onClose}
        onDelete={onDelete}
        onSave={onSave}
        promise={promise}
      />
    </BottomSheet>
  )
}
