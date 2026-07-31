import { useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import CategorySelect from '../categories/CategorySelect'
import Button from '../common/Button'
import Checkbox from '../common/Checkbox'
import Input from '../common/Input'
import UnderInput from '../common/UnderInput'
import { toDateKey } from '../../utils/dateUtils'
import type { TransactionFormValues } from '../../types/finance'
import type { TransactionCategory, TransactionType } from './transactionFormConfig'

type TransactionFormContentProps = {
  categories: TransactionCategory[]
  categoryManageOverlay?: (isOpen: boolean, onClose: () => void) => ReactNode
  fixedLabel: string
  initialAmount?: number
  initialCategoryId?: string
  initialIsFixed?: boolean
  initialMemo?: string
  onDelete?: () => void
  onSave?: (values: TransactionFormValues) => void
  selectedDate?: Date | null
  submitText?: string
  type: TransactionType
}

export default function TransactionFormContent({
  categories,
  categoryManageOverlay,
  fixedLabel,
  initialAmount,
  initialCategoryId,
  initialIsFixed = false,
  initialMemo,
  onDelete,
  onSave,
  selectedDate,
  submitText = '저장',
  type,
}: TransactionFormContentProps) {
  const initialSelectedCategoryId = initialCategoryId || categories[0]?.id || ''
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialSelectedCategoryId)
  const [isCategoryManageOpen, setIsCategoryManageOpen] = useState(false)
  const [amount, setAmount] = useState(initialAmount ? String(initialAmount) : '')
  const [date, setDate] = useState(selectedDate ? toDateKey(selectedDate) : '')
  const [memo, setMemo] = useState(initialMemo ?? '')
  const [isFixed, setIsFixed] = useState(initialIsFixed)
  const resolvedSelectedCategoryId = categories.some((category) => category.id === selectedCategoryId)
    ? selectedCategoryId
    : initialSelectedCategoryId

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(event.currentTarget.value.replace(/\D/g, ''))
  }

  const handleSave = () => {
    const numericAmount = Number(amount)

    if (!numericAmount || !resolvedSelectedCategoryId || !date) {
      return
    }

    onSave?.({
      amount: numericAmount,
      categoryId: resolvedSelectedCategoryId,
      date,
      isFixed,
      memo,
    })
  }

  return (
    <>
      <div className="grid gap-5">
        <UnderInput
          inputMode="numeric"
          label="금액"
          onChange={handleAmountChange}
          pattern="[0-9]*"
          placeholder="0"
          value={amount}
          variant="amount"
        />

        <div className="h-px bg-black/8" />

        <CategorySelect
          categories={categories}
          onChange={setSelectedCategoryId}
          onManageCategories={categoryManageOverlay ? () => setIsCategoryManageOpen(true) : undefined}
          selectedCategoryId={resolvedSelectedCategoryId}
        />

        <div className="h-px bg-black/8" />

        <UnderInput
          label="날짜"
          onChange={(event) => setDate(event.currentTarget.value)}
          suffix=""
          type="date"
          value={date}
        />

        <div className="h-px bg-black/8" />

        <Input
          label="메모"
          onChange={(event) => setMemo(event.currentTarget.value)}
          placeholder="기록해두고 싶은 내용을 남겨보세요."
          value={memo}
        />

        <Checkbox
          checked={isFixed}
          className="text-sm"
          name={`fixed-${type}`}
          onChange={(event) => setIsFixed(event.currentTarget.checked)}
        >
          {fixedLabel}
        </Checkbox>
      </div>

      <div className="mt-5 grid grid-cols-[96px_minmax(0,1fr)] gap-3 pt-1">
        <Button onClick={onDelete} variant="soft">
          삭제
        </Button>
        <Button onClick={handleSave}>{submitText}</Button>
      </div>

      {categoryManageOverlay?.(isCategoryManageOpen, () => setIsCategoryManageOpen(false))}
    </>
  )
}
