import { useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import CategorySelect from '../categories/CategorySelect'
import Button from '../common/Button'
import Checkbox from '../common/Checkbox'
import Input from '../common/Input'
import SegmentedControl from '../common/SegmentedControl'
import UnderInput from '../common/UnderInput'
import { toDateKey } from '../../utils/dateUtils'
import type { Category, Satisfaction, TransactionFormValues, TransactionType } from '../../types/finance'
import { useSettingsStore } from '../../stores/settingsStore'
import { MOOD_COLORS, MOOD_LABELS } from '../log/EmotionRateCard'

const SATISFACTION_OPTIONS: Satisfaction[] = ['satisfied', 'neutral', 'regret']

type TransactionFormContentProps = {
  categories: Category[]
  categoryManageOverlay?: (isOpen: boolean, onClose: () => void) => ReactNode
  controlledDate?: string
  onControlledDateChange?: (date: string) => void
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
  controlledDate,
  onControlledDateChange,
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
  const [internalDate, setInternalDate] = useState(selectedDate ? toDateKey(selectedDate) : '')
  const date = controlledDate ?? internalDate
  const setDate = onControlledDateChange ?? setInternalDate
  const [memo, setMemo] = useState(initialMemo ?? '')
  const [isFixed, setIsFixed] = useState(initialIsFixed)
  const [satisfaction, setSatisfaction] = useState<Satisfaction | null>(initialSatisfaction)
  const recentCategoryIds = useSettingsStore((s) => s.recentCategoryIds)
  const addRecentCategoryId = useSettingsStore((s) => s.addRecentCategoryId)
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
      addRecentCategoryId(resolvedSelectedCategoryId)
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
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl font-bold text-gray-400">
            {type === 'expense' ? '−' : '+'}
          </span>
          <input
            autoFocus
            className="min-w-0 bg-transparent text-2xl font-bold text-black outline-none placeholder:text-gray-400"
            inputMode="numeric"
            onChange={handleAmountChange}
            pattern="[0-9]*"
            placeholder="0"
            style={{ width: `${Math.max((amount || '0').length, 1) + 0.2}ch` }}
            value={amount ? Number(amount).toLocaleString('ko-KR') : ''}
          />
          <span className="text-xl font-bold text-gray-400">원</span>
        </div>

        <CategorySelect
          categories={categories}
          onChange={setSelectedCategoryId}
          onManageCategories={categoryManageOverlay ? () => setIsCategoryManageOpen(true) : undefined}
          recentCategoryIds={recentCategoryIds}
          selectedCategoryIds={[resolvedSelectedCategoryId]}
        />

        {!controlledDate && (
          <UnderInput
            label="날짜"
            onChange={(event) => setDate(event.currentTarget.value)}
            suffix=""
            type="date"
            value={date}
          />
        )}

        <Input
          onChange={(event) => setMemo(event.currentTarget.value)}
          placeholder="어디에 썼나요?"
          value={memo}
          variant="soft"
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
          <div className="grid gap-3">
            <p className="text-sm font-semibold text-gray-500">이 소비 어떠셨나요?</p>
            <SegmentedControl
              onChange={(v) => setSatisfaction(satisfaction === v ? null : v)}
              options={SATISFACTION_OPTIONS.map((v) => ({ color: MOOD_COLORS[v], label: MOOD_LABELS[v], value: v }))}
              size="lg"
              value={satisfaction}
            />
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
