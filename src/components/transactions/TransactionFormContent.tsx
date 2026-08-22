import { useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import CategorySelect from '../categories/CategorySelect'
import Button from '../common/Button'
import Checkbox from '../common/Checkbox'
import UnderInput from '../common/UnderInput'
import { toDateKey } from '../../utils/dateUtils'
import type { Category, Satisfaction, TransactionFormValues, TransactionType } from '../../types/finance'
import { useSettingsStore } from '../../stores/settingsStore'

const SATISFACTION_OPTIONS: { label: string; value: Satisfaction; color: string }[] = [
  { label: '만족', value: 'satisfied', color: '#22c55e' },
  { label: '보통', value: 'neutral', color: '#9ca3af' },
  { label: '후회', value: 'regret', color: '#f97316' },
]

type TransactionFormContentProps = {
  categories: Category[]
  categoryManageOverlay?: (isOpen: boolean, onClose: () => void) => ReactNode
  fixedLabel: string
  initialAmount?: number
  initialCategoryId?: string
  initialIsFixed?: boolean
  initialMemo?: string
  initialSatisfaction?: Satisfaction | null
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
  initialSatisfaction = null,
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
  const [satisfaction, setSatisfaction] = useState<Satisfaction | null>(initialSatisfaction)
  const satisfactionEmojis = useSettingsStore((s) => s.satisfactionEmojis)
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
        satisfaction: type === 'expense' ? satisfaction : null,
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
      <div className="grid gap-4">
        <UnderInput
          autoFocus
          inputMode="numeric"
          label="금액"
          onChange={handleAmountChange}
          pattern="[0-9]*"
          placeholder="0"
          value={amount ? Number(amount).toLocaleString('ko-KR') : ''}
          variant="amount"
        />

        <CategorySelect
          categories={categories}
          onChange={setSelectedCategoryId}
          onManageCategories={categoryManageOverlay ? () => setIsCategoryManageOpen(true) : undefined}
          selectedCategoryIds={[resolvedSelectedCategoryId]}
        />

        <UnderInput
          label="날짜"
          onChange={(event) => setDate(event.currentTarget.value)}
          suffix=""
          type="date"
          value={date}
        />

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

        {type === 'expense' && (
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-500">만족도</p>
            <div className="flex gap-4">
              {SATISFACTION_OPTIONS.map((option) => (
                <button
                  aria-pressed={satisfaction === option.value}
                  className="flex flex-col items-center gap-1.5"
                  key={option.value}
                  onClick={() => setSatisfaction(satisfaction === option.value ? null : option.value)}
                  type="button"
                >
                  <span
                    className={[
                      'flex h-10 w-10 items-center justify-center rounded-full text-xl transition-all duration-150',
                      satisfaction === option.value ? 'scale-110' : 'opacity-40',
                    ].join(' ')}
                    style={{
                      background: option.color,
                      boxShadow: satisfaction === option.value
                        ? `0 0 0 2px white, 0 0 0 4px ${option.color}`
                        : 'none',
                    }}
                  >
                    {satisfactionEmojis[option.value]}
                  </span>
                  <span className={[
                    'text-[11px] font-bold transition-colors',
                    satisfaction === option.value ? 'text-gray-700' : 'text-gray-400',
                  ].join(' ')}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
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
