import { useEffect, useRef, useState } from 'react'
import CategoryManageBottomSheet from '../../categories/CategoryManageBottomSheet'
import BottomSheet from '../../common/BottomSheet'
import type { Category, Satisfaction, TransactionFormValues, TransactionType } from '../../../types/finance'
import TransactionFormContent from '../TransactionFormContent'
import { transactionFormTextByType, type TransactionFormMode } from '../transactionFormConfig'
import { toDateKey } from '../../../utils/dateUtils'

type TransactionFormBottomSheetProps = {
  categories: Category[]
  expenseCategories?: Category[]
  incomeCategories?: Category[]
  initialAmount?: number
  initialCategoryId?: string
  initialIsFixed?: boolean
  initialMemo?: string
  initialSatisfaction?: Satisfaction | null
  isOpen: boolean
  mode?: TransactionFormMode
  onClose: () => void
  onCreateCategory?: Parameters<typeof CategoryManageBottomSheet>[0]['onCreateCategory']
  onDelete?: () => void
  onDeleteCategory?: Parameters<typeof CategoryManageBottomSheet>[0]['onDeleteCategory']
  onSave?: (values: TransactionFormValues) => void
  onUpdateCategory?: Parameters<typeof CategoryManageBottomSheet>[0]['onUpdateCategory']
  selectedDate?: Date | null
  type: TransactionType
}

const todayKey = toDateKey(new Date())

const formatDateLabel = (dateKey: string) => {
  if (!dateKey || dateKey === todayKey) return '오늘'
  const [, month, day] = dateKey.split('-')
  return `${Number(month)}월 ${Number(day)}일`
}

export default function TransactionFormBottomSheet({
  categories,
  expenseCategories,
  incomeCategories,
  initialAmount,
  initialCategoryId,
  initialIsFixed,
  initialMemo,
  initialSatisfaction,
  isOpen,
  mode = 'create',
  onClose,
  onCreateCategory,
  onDelete,
  onDeleteCategory,
  onSave,
  onUpdateCategory,
  selectedDate,
  type,
}: TransactionFormBottomSheetProps) {
  const formText = transactionFormTextByType[type]
  const canManageCategories = Boolean(expenseCategories?.length && incomeCategories?.length)
  const title = mode === 'edit' ? formText.editTitle : formText.createTitle

  const [date, setDate] = useState(() => selectedDate ? toDateKey(selectedDate) : todayKey)
  const dateInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setDate(selectedDate ? toDateKey(selectedDate) : todayKey)
    }
  }, [isOpen, selectedDate])

  const titleRight = (
    <div className="relative">
      <button
        className="rounded-full bg-black/6 px-3 py-1 text-[13px] font-semibold text-gray-600 transition hover:bg-black/10"
        onClick={() => dateInputRef.current?.showPicker()}
        type="button"
      >
        {formatDateLabel(date)}
      </button>
      <input
        className="pointer-events-none absolute inset-0 opacity-0"
        max={todayKey}
        onChange={(e) => setDate(e.target.value)}
        ref={dateInputRef}
        tabIndex={-1}
        type="date"
        value={date}
      />
    </div>
  )

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} scrollToBottom={mode === 'edit' && type === 'expense'} title={title} titleRight={titleRight}>
      <TransactionFormContent
        categories={categories}
        categoryManageOverlay={canManageCategories ? (isOpen, onClose) => (
          <CategoryManageBottomSheet
            expenseCategories={expenseCategories ?? []}
            initialType={type}
            incomeCategories={incomeCategories ?? []}
            isOpen={isOpen}
            onCreateCategory={onCreateCategory}
            onClose={onClose}
            onDeleteCategory={onDeleteCategory}
            onUpdateCategory={onUpdateCategory}
          />
        ) : undefined}
        controlledDate={date}
        fixedLabel={formText.fixedLabel}
        initialAmount={initialAmount}
        initialCategoryId={initialCategoryId}
        initialIsFixed={initialIsFixed}
        initialMemo={initialMemo}
        initialSatisfaction={initialSatisfaction}
        mode={mode}
        onControlledDateChange={setDate}
        onDelete={onDelete}
        onSave={onSave}
        selectedDate={selectedDate}
        submitText={mode === 'edit' ? '수정 저장' : '저장'}
        type={type}
      />
    </BottomSheet>
  )
}
