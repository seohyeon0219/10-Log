import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import CategorySelect from '../categories/CategorySelect'
import Button from '../common/Button'
import Checkbox from '../common/Checkbox'
import Input from '../common/Input'
import UnderInput from '../common/UnderInput'
import type { TransactionCategory, TransactionType } from './transactionFormConfig'

type TransactionFormContentProps = {
  categories: TransactionCategory[]
  fixedLabel: string
  onDelete?: () => void
  onSave?: () => void
  selectedDate?: Date | null
  type: TransactionType
}

const toInputDateValue = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function TransactionFormContent({
  categories,
  fixedLabel,
  onDelete,
  onSave,
  selectedDate,
  type,
}: TransactionFormContentProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id ?? '')
  const dateValue = selectedDate ? toInputDateValue(selectedDate) : ''

  useEffect(() => {
    setSelectedCategoryId(categories[0]?.id ?? '')
  }, [categories, type])

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.currentTarget.value = event.currentTarget.value.replace(/\D/g, '')
  }

  return (
    <>
      <div className="grid gap-6">
        <UnderInput
          inputMode="numeric"
          label="금액"
          onChange={handleAmountChange}
          pattern="[0-9]*"
          placeholder="0"
          variant="amount"
        />

        <CategorySelect
          categories={categories}
          onChange={setSelectedCategoryId}
          selectedCategoryId={selectedCategoryId}
        />

        <UnderInput defaultValue={dateValue} label="날짜" suffix="" type="date" />

        <Input label="메모" placeholder="기록해두고 싶은 내용을 남겨보세요." />

        <Checkbox className="text-sm" name={`fixed-${type}`}>
          {fixedLabel}
        </Checkbox>
      </div>

      <div className="mt-8 grid grid-cols-[96px_minmax(0,1fr)] gap-3">
        <Button onClick={onDelete} variant="soft">
          삭제
        </Button>
        <Button onClick={onSave}>저장</Button>
      </div>
    </>
  )
}
