import BottomSheet from '../common/BottomSheet'
import MonthlyPromiseFormContent from './MonthlyPromiseFormContent'

type MonthlyPromiseBottomSheetProps = {
  budgetAmount: number
  initialMode?: 'direct' | 'income'
  isRegistered: boolean
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
  onSave: (values: { budgetAmount: number }) => void
  onUseIncomeBudget?: () => Promise<void> | void
  totalIncome?: number
}

export default function MonthlyPromiseBottomSheet({
  budgetAmount,
  initialMode,
  isRegistered,
  isOpen,
  onClose,
  onDelete,
  onSave,
  onUseIncomeBudget,
  totalIncome,
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
        initialMode={initialMode}
        isRegistered={isRegistered}
        onClose={onClose}
        onDelete={onDelete}
        onSave={onSave}
        onUseIncomeBudget={onUseIncomeBudget}
        totalIncome={totalIncome}
      />
    </BottomSheet>
  )
}
