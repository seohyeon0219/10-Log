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
      description={isRegistered ? '이번 달 목표 예산을 수정할 수 있어요.' : '예산을 설정하면 남은 예산과 하루 권장 금액을 확인할 수 있어요.'}
      isOpen={isOpen}
      onClose={onClose}
      title={isRegistered ? '소비 목표 수정' : '이번 달 목표 예산을 등록해요'}
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
