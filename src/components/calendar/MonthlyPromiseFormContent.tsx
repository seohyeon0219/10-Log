import { useState } from 'react'
import Button from '../common/Button'
import UnderInput from '../common/UnderInput'

type Mode = 'direct' | 'income'

type MonthlyPromiseFormContentProps = {
  budgetAmount: number
  initialMode?: Mode
  isRegistered: boolean
  onClose: () => void
  onDelete: () => Promise<void> | void
  onSave: (values: { budgetAmount: number }) => Promise<void> | void
  onUseIncomeBudget?: () => Promise<void> | void
  totalIncome?: number
}

export default function MonthlyPromiseFormContent({
  budgetAmount,
  initialMode = 'direct',
  isRegistered,
  onClose,
  onDelete,
  onSave,
  onUseIncomeBudget,
  totalIncome = 0,
}: MonthlyPromiseFormContentProps) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const [budgetValue, setBudgetValue] = useState(budgetAmount > 0 ? String(budgetAmount) : '')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const parsedBudgetAmount = Number(budgetValue.replaceAll(',', '')) || 0

  const canSave = mode === 'direct' ? parsedBudgetAmount > 0 : totalIncome > 0

  const handleSubmit = async (event: { preventDefault(): void }) => {
    event.preventDefault()
    if (!canSave) return
    setError('')
    setIsSaving(true)
    try {
      if (mode === 'income') {
        await onUseIncomeBudget?.()
      } else {
        await onSave({ budgetAmount: parsedBudgetAmount })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장하지 못했어요.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setError('')
    setIsSaving(true)
    try {
      await onDelete()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : '삭제하지 못했어요.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form className="grid gap-5" onSubmit={(e) => { void handleSubmit(e) }}>
      <div className="grid gap-2">
        <label className={[
          'flex cursor-pointer items-center gap-3 rounded-xl p-4 transition',
          mode === 'direct' ? 'glass-button' : 'glass-panel',
        ].join(' ')}>
          <input
            checked={mode === 'direct'}
            className="accent-black"
            name="budget-mode"
            onChange={() => setMode('direct')}
            type="radio"
            value="direct"
          />
          <span className="text-sm font-semibold text-black">이번 달 소비 목표 직접 등록</span>
        </label>

        <label className={[
          'flex cursor-pointer items-center gap-3 rounded-xl p-4 transition',
          totalIncome === 0 ? 'opacity-40 cursor-not-allowed' : '',
          mode === 'income' ? 'glass-button' : 'glass-panel',
        ].join(' ')}>
          <input
            checked={mode === 'income'}
            className="accent-black"
            disabled={totalIncome === 0}
            name="budget-mode"
            onChange={() => setMode('income')}
            type="radio"
            value="income"
          />
          <span className="text-sm font-semibold text-black">
            이번 달 수입으로 자동 설정
            {totalIncome === 0 && (
              <span className="ml-1.5 text-xs font-medium text-(--color-text-muted)">수입 없음</span>
            )}
          </span>
        </label>

        {mode === 'direct' && (
          <div className="glass-panel rounded-xl p-4 max-[380px]:p-3">
            <UnderInput
              inputMode="numeric"
              label="이번 달 소비 목표"
              name="monthly-budget"
              onChange={(event) => setBudgetValue(event.target.value.replace(/\D/g, ''))}
              value={budgetValue ? Number(budgetValue).toLocaleString('ko-KR') : ''}
              variant="amount"
            />
          </div>
        )}

        <p className="mt-1 px-1 text-xs font-medium leading-relaxed text-(--color-text-muted)">
          {mode === 'direct'
            ? '설정한 금액 기준으로 사용 비율과 하루 권장 사용 금액을 보여드려요.'
            : '이번 달 총 수입 기준으로 사용 비율과 하루 권장 사용 금액을 보여드려요.'}
        </p>
      </div>

      {error && (
        <p className="text-sm font-semibold text-(--color-expense-red)" role="alert">
          {error}
        </p>
      )}

      <div className={['gap-3 pt-1', isRegistered ? 'grid grid-cols-[96px_minmax(0,1fr)]' : 'flex'].join(' ')}>
        {isRegistered && (
          <Button disabled={isSaving} onClick={() => { void handleDelete() }} variant="soft">
            삭제
          </Button>
        )}
        <Button disabled={!canSave || isSaving} type="submit">
          {isSaving ? '저장 중...' : '저장'}
        </Button>
      </div>
    </form>
  )
}
