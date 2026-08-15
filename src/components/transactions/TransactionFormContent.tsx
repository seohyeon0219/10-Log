import { useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import CategorySelect from '../categories/CategorySelect'
import Button from '../common/Button'
import Checkbox from '../common/Checkbox'
import UnderInput from '../common/UnderInput'
import { toDateKey } from '../../utils/dateUtils'
import type { Category, TransactionFormValues, TransactionType } from '../../types/finance'

type TransactionFormContentProps = {
  categories: Category[]
  categoryManageOverlay?: (isOpen: boolean, onClose: () => void) => ReactNode
  fixedLabel: string
  initialAmount?: number
  initialCategoryId?: string
  initialIsFixed?: boolean
  initialMemo?: string
  mode?: 'create' | 'edit'
  onDelete?: () => Promise<void> | void
  onSave?: (values: TransactionFormValues) => Promise<void> | void
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
  mode = 'create',
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
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const resolvedSelectedCategoryId = categories.some((category) => category.id === selectedCategoryId)
    ? selectedCategoryId
    : initialSelectedCategoryId

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(event.currentTarget.value.replace(/\D/g, ''))
  }

  const handleSave = async () => {
    const numericAmount = Number(amount)

    if (!numericAmount) {
      setErrorMessage('금액을 입력해주세요.')
      return
    }
    if (!resolvedSelectedCategoryId) {
      setErrorMessage('카테고리를 선택해주세요.')
      return
    }
    if (!date) {
      setErrorMessage('날짜를 입력해주세요.')
      return
    }

    setErrorMessage('')
    setIsSaving(true)

    try {
      await onSave?.({
        amount: numericAmount,
        categoryId: resolvedSelectedCategoryId,
        date,
        isFixed,
        memo,
      })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '저장하지 못했어요.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setErrorMessage('')
    setIsSaving(true)
    try {
      await onDelete?.()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '삭제하지 못했어요.')
    } finally {
      setIsSaving(false)
    }
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
          value={amount ? Number(amount).toLocaleString('ko-KR') : ''}
          variant="amount"
        />

        <div className="h-px bg-black/8" />

        <CategorySelect
          categories={categories}
          onChange={setSelectedCategoryId}
          onManageCategories={categoryManageOverlay ? () => setIsCategoryManageOpen(true) : undefined}
          selectedCategoryIds={[resolvedSelectedCategoryId]}
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

        <UnderInput
          label="메모"
          onChange={(event) => setMemo(event.currentTarget.value)}
          placeholder="기록해두고 싶은 내용을 남겨보세요."
          suffix=""
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

      {errorMessage && (
        <p className="mt-4 text-sm font-semibold text-(--color-expense-red)" role="alert">
          {errorMessage}
        </p>
      )}

      <div className={['mt-5 pt-1', mode === 'edit' ? 'grid grid-cols-[96px_minmax(0,1fr)] gap-3' : ''].join(' ')}>
        {mode === 'edit' && (
          <Button disabled={isSaving} onClick={handleDelete} variant="soft">
            삭제
          </Button>
        )}
        <Button disabled={isSaving} onClick={handleSave}>{isSaving ? '저장 중...' : submitText}</Button>
      </div>

      {categoryManageOverlay?.(isCategoryManageOpen, () => setIsCategoryManageOpen(false))}
    </>
  )
}
