import { useEffect, useState } from 'react'
import CategorySelect from '../categories/CategorySelect'
import Button from '../common/Button'
import Checkbox from '../common/Checkbox'
import Input from '../common/Input'
import UnderInput from '../common/UnderInput'

type TransactionType = 'income' | 'expense'

type TransactionCategory = {
  color: string
  id: string
  name: string
}

type TransactionFormModalProps = {
  categories: TransactionCategory[]
  isOpen: boolean
  onClose: () => void
  onDelete?: () => void
  onSave?: () => void
  selectedDate?: Date | null
  type: TransactionType
}

const formTextByType: Record<TransactionType, { fixedLabel: string; title: string }> = {
  income: {
    fixedLabel: '고정수입',
    title: '수입을 기록해요',
  },
  expense: {
    fixedLabel: '고정지출',
    title: '지출을 기록해요',
  },
}

const toInputDateValue = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function TransactionFormModal({
  categories,
  isOpen,
  onClose,
  onDelete,
  onSave,
  selectedDate,
  type,
}: TransactionFormModalProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id ?? '')
  const formText = formTextByType[type]
  const dateValue = selectedDate ? toInputDateValue(selectedDate) : ''

  useEffect(() => {
    setSelectedCategoryId(categories[0]?.id ?? '')
  }, [categories, type])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4 py-6">
      <section
        aria-modal="true"
        className="w-full max-w-110 rounded-2xl bg-white px-6 pt-6 pb-5 shadow-xl"
        role="dialog"
      >
        <header className="mb-8 flex items-start justify-between gap-4">
          <h2 className="m-0 pt-1 text-xl font-bold text-black">{formText.title}</h2>
          <button
            aria-label="거래 입력 닫기"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-transparent text-3xl leading-none text-gray-300 hover:bg-(--color-warm-gray) hover:text-gray-500"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </header>

        <div className="grid gap-6">
          <UnderInput inputMode="numeric" label="금액" placeholder="0" />

          <CategorySelect
            categories={categories}
            onChange={setSelectedCategoryId}
            selectedCategoryId={selectedCategoryId}
          />

          <UnderInput defaultValue={dateValue} label="날짜" suffix="" type="date" />

          <Input label="메모" placeholder="기록해두고 싶은 내용을 남겨보세요." />

          <Checkbox className="text-sm" name={`fixed-${type}`}>{formText.fixedLabel}</Checkbox>
        </div>

        <div className="mt-8 grid grid-cols-[96px_minmax(0,1fr)] gap-3">
          <Button className="min-h-12 rounded-xl text-base" onClick={onDelete} variant="soft">
            삭제
          </Button>
          <Button className="min-h-12 rounded-xl text-base" onClick={onSave}>
            저장
          </Button>
        </div>
      </section>
    </div>
  )
}
