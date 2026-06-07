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
    <FormModal description="이번 달 돈 관리의 기준을 정해보세요." isOpen={isOpen} onClose={onClose} title="월간 다짐 수정">
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <div className="rounded-xl bg-yellow-50 px-4 py-4 max-[380px]:px-3">
          <p className="text-base font-bold text-black">이번 달 나와의 약속</p>
          <p className="mt-1 break-keep text-sm leading-6 font-semibold text-gray-500">
            목표 예산과 한 줄 다짐은 통계 탭의 가장 위에서 계속 보여요.
          </p>
        </div>

        <div className="grid gap-5 rounded-xl border border-gray-100 bg-white p-4 max-[380px]:p-3">
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
