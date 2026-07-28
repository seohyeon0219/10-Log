import { type FormEvent, useState } from 'react'
import Button from '../common/Button'
import UnderInput from '../common/UnderInput'

type MonthlyPromiseFormContentProps = {
  budgetAmount: number
  isRegistered: boolean
  onClose: () => void
  onDelete: () => void
  onSave: (values: { budgetAmount: number }) => void
}

export default function MonthlyPromiseFormContent({
  budgetAmount,
  isRegistered,
  onClose,
  onDelete,
  onSave,
}: MonthlyPromiseFormContentProps) {
  const [budgetValue, setBudgetValue] = useState(budgetAmount > 0 ? String(budgetAmount) : '')
  const parsedBudgetAmount = Number(budgetValue.replaceAll(',', '')) || 0
  const canSave = parsedBudgetAmount > 0

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSave) return
    onSave({ budgetAmount: parsedBudgetAmount })
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
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
