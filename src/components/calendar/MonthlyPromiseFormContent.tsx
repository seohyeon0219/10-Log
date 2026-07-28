import { useState } from 'react'
import Button from '../common/Button'
import UnderInput from '../common/UnderInput'

type Mode = 'direct' | 'income'

type MonthlyPromiseFormContentProps = {
  budgetAmount: number
  initialMode?: Mode
  isRegistered: boolean
  onClose: () => void
  onDelete: () => void
  onSave: (values: { budgetAmount: number }) => void
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
  const parsedBudgetAmount = Number(budgetValue.replaceAll(',', '')) || 0

  const canSave = mode === 'direct' ? parsedBudgetAmount > 0 : totalIncome > 0

  const handleSubmit = async (event: { preventDefault(): void }) => {
    event.preventDefault()
    if (!canSave) return
    if (mode === 'income') {
      await onUseIncomeBudget?.()
    } else {
      onSave({ budgetAmount: parsedBudgetAmount })
    }
  }

  return (
    <form className="grid gap-5" onSubmit={(e) => { void handleSubmit(e) }}>
      <div className="grid gap-2">
        <label className={[
          'flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition',
          mode === 'direct' ? 'border-black/20 bg-white/80' : 'border-white/70 bg-white/40',
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
          'flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition',
          totalIncome === 0 ? 'opacity-40 cursor-not-allowed' : '',
          mode === 'income' ? 'border-black/20 bg-white/80' : 'border-white/70 bg-white/40',
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
            {totalIncome > 0 && (
              <span className="ml-1.5 text-xs font-medium text-(--color-text-muted)">
                {totalIncome.toLocaleString('ko-KR')}원
              </span>
            )}
            {totalIncome === 0 && (
              <span className="ml-1.5 text-xs font-medium text-(--color-text-muted)">수입 없음</span>
            )}
          </span>
        </label>

        {mode === 'direct' && (
          <div className="rounded-xl border border-white/70 bg-white/60 p-4 max-[380px]:p-3">
            <UnderInput
              inputMode="numeric"
              label="이번 달 목표 예산"
              name="monthly-budget"
              onChange={(event) => setBudgetValue(event.target.value.replace(/\D/g, ''))}
              placeholder="200000"
              value={budgetValue}
              variant="amount"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 pt-1">
        <Button
          disabled={!isRegistered}
          onClick={() => {
            onDelete()
            onClose()
          }}
          variant="soft"
        >
          삭제
        </Button>
        <Button disabled={!canSave} type="submit">
          저장
        </Button>
      </div>
    </form>
  )
}
