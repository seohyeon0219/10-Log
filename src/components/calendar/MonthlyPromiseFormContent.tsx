import { type FormEvent, useState } from 'react'
import Button from '../common/Button'
import Textarea from '../common/Textarea'
import UnderInput from '../common/UnderInput'

type MonthlyPromiseFormContentProps = {
  budgetAmount: number
  isRegistered: boolean
  onClose: () => void
  onDelete: () => void
  onSave: (values: { budgetAmount: number; promise: string }) => void
  promise: string
}

export default function MonthlyPromiseFormContent({
  budgetAmount,
  isRegistered,
  onClose,
  onDelete,
  onSave,
  promise,
}: MonthlyPromiseFormContentProps) {
  const [budgetValue, setBudgetValue] = useState(String(budgetAmount))
  const [promiseValue, setPromiseValue] = useState(isRegistered ? promise : '')
  const parsedBudgetAmount = Number(budgetValue.replaceAll(',', '')) || 0
  const trimmedPromise = promiseValue.trim()
  const canSave = Boolean(trimmedPromise) || parsedBudgetAmount > 0

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSave) {
      return
    }

    onSave({
      budgetAmount: parsedBudgetAmount > 0 ? parsedBudgetAmount : budgetAmount,
      promise: trimmedPromise || promise.trim(),
    })
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="rounded-xl border border-amber-100/70 bg-amber-50/70 px-4 py-4 max-[380px]:px-3">
        <p className="text-base font-bold text-black">이번 달 나와의 약속</p>
        <p className="mt-1 break-keep text-sm leading-6 font-medium text-gray-500">
          목표 예산과 한 줄 다짐은 캘린더 화면에서 계속 보여요.
        </p>
      </div>

      <div className="grid gap-5 rounded-xl border border-white/70 bg-white/60 p-4 max-[380px]:p-3">
        <UnderInput
          inputMode="numeric"
          label="이번 달 목표 예산"
          name="monthly-budget"
          onChange={(event) => setBudgetValue(event.target.value.replace(/\D/g, ''))}
          placeholder="200000"
          value={budgetValue}
          variant="amount"
        />
        <Textarea
          label="한 줄 다짐"
          maxLength={60}
          name="monthly-promise"
          onChange={(event) => setPromiseValue(event.target.value)}
          placeholder="이번 달 돈 관리 다짐을 적어보세요."
          value={promiseValue}
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
