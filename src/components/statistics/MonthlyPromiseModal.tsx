import { type FormEvent, useState } from 'react'
import Button from '../common/Button'
import FormModal from '../common/FormModal'
import Textarea from '../common/Textarea'
import UnderInput from '../common/UnderInput'

type MonthlyPromiseModalProps = {
  budgetAmount: number
  isOpen: boolean
  onClose: () => void
  onSave: (values: { budgetAmount: number; promise: string }) => void
  promise: string
}

export default function MonthlyPromiseModal({
  budgetAmount,
  isOpen,
  onClose,
  onSave,
  promise,
}: MonthlyPromiseModalProps) {
  const [budgetValue, setBudgetValue] = useState(String(budgetAmount))
  const [promiseValue, setPromiseValue] = useState(promise)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    onSave({
      budgetAmount: Number(budgetValue.replaceAll(',', '')) || 0,
      promise: promiseValue.trim(),
    })
  }

  return (
    <FormModal description="이번 달 목표 예산과 다짐을 정해보세요." isOpen={isOpen} onClose={onClose} title="월간 다짐 수정">
      <form className="grid gap-5" onSubmit={handleSubmit}>
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

        <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 pt-1">
          <Button onClick={onClose} variant="soft">
            취소
          </Button>
          <Button disabled={!promiseValue.trim() || Number(budgetValue) <= 0} type="submit">
            저장
          </Button>
        </div>
      </form>
    </FormModal>
  )
}
