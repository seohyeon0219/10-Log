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
      <div className="grid">
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-black/6 p-1">
          <button
            className={['rounded-lg py-2.5 text-sm font-semibold transition', mode === 'direct' ? 'bg-white text-black shadow-sm' : 'text-(--color-text-sand)'].join(' ')}
            onClick={() => setMode('direct')}
            type="button"
          >
            직접 입력
          </button>
          <button
            className={['rounded-lg py-2.5 text-sm font-semibold transition', totalIncome === 0 ? 'cursor-not-allowed opacity-40' : '', mode === 'income' ? 'bg-white text-black shadow-sm' : 'text-(--color-text-sand)'].join(' ')}
            disabled={totalIncome === 0}
            onClick={() => setMode('income')}
            type="button"
          >
            수입 기준
            {totalIncome === 0 && <span className="ml-1 text-[11px]">없음</span>}
          </button>
        </div>

        <div className={['overflow-hidden transition-[max-height] duration-300 ease-out', mode === 'direct' ? 'max-h-36' : 'max-h-0'].join(' ')}>
          <div className="mt-3 glass-panel rounded-xl p-4 max-[380px]:p-3">
            <UnderInput
              inputMode="numeric"
              label="이번 달 소비 목표"
              name="monthly-budget"
              onChange={(event) => setBudgetValue(event.target.value.replace(/\D/g, ''))}
              value={budgetValue ? Number(budgetValue).toLocaleString('ko-KR') : ''}
              variant="amount"
            />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 -mx-5 bg-gradient-to-t from-white/90 to-transparent px-5 pb-safe-bottom pt-8 md:static md:mx-0 md:bg-none md:px-0 md:pb-1 md:pt-4">
        {error && (
          <p className="mb-3 text-sm font-semibold text-(--color-expense-red)" role="alert">
            {error}
          </p>
        )}
        <div className={[isRegistered ? 'grid grid-cols-[96px_minmax(0,1fr)] gap-3' : ''].join(' ')}>
          {isRegistered && (
            <Button disabled={isSaving} onClick={() => { void handleDelete() }} variant="soft">
              삭제
            </Button>
          )}
          <Button disabled={!canSave || isSaving} type="submit">
            {isSaving ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </form>
  )
}
