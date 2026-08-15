import FormModal from '../common/FormModal'
import MonthlyPromiseFormContent from './MonthlyPromiseFormContent'

type MonthlyPromiseModalProps = {
  budgetAmount: number
  initialMode?: 'direct' | 'income'
  isRegistered: boolean
  isOpen: boolean
  onClose: () => void
  onDelete: () => Promise<void> | void
  onSave: (values: { budgetAmount: number }) => Promise<void> | void
  onUseIncomeBudget?: () => Promise<void> | void
  totalIncome?: number
}

export default function MonthlyPromiseModal({
  budgetAmount,
  initialMode,
  isRegistered,
  isOpen,
  onClose,
  onDelete,
  onSave,
  onUseIncomeBudget,
  totalIncome,
}: MonthlyPromiseModalProps) {
  return (
    <FormModal
      description={isRegistered ? '설정한 예산을 변경할 수 있어요.' : '예산을 설정하면 남은 예산과 하루 권장 금액을 확인할 수 있어요.'}
      isOpen={isOpen}
      onClose={onClose}
      title={isRegistered ? '예산 수정' : '예산 설정'}
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
    </FormModal>
  )
}
