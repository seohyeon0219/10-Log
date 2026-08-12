import { useState } from 'react'
import Button from '../common/Button'
import CategorySelect from '../categories/CategorySelect'
import Input from '../common/Input'
import FixedToggle from './FixedToggle'
import PeriodSelector, { getPeriodDates, type Period } from './PeriodSelector'
import { toDateKey } from '../../utils/dateUtils'

type CategoryOption = { color: string; id: string; name: string }

export type SearchFilters = {
  categoryIds: string[]
  endDate: string
  isFixed: boolean
  memo: string
  startDate: string
}

type SearchBarProps = {
  expenseCategories: CategoryOption[]
  incomeCategories: CategoryOption[]
  isLoading?: boolean
  onSearch: (filters: SearchFilters) => void
}

export default function SearchBar({
  expenseCategories,
  incomeCategories,
  isLoading,
  onSearch,
}: SearchBarProps) {
  const today = toDateKey(new Date())

  const [memo, setMemo] = useState('')
  const [period, setPeriod] = useState<Period>('thisMonth')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState(today)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [isFixed, setIsFixed] = useState(false)
  const [error, setError] = useState('')

  const toggleCategory = (id: string) =>
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (period === 'custom') {
      if (!customStart || !customEnd) {
        setError('시작일과 종료일을 입력해주세요.')
        return
      }
      if (customStart > customEnd) {
        setError('시작일이 종료일보다 늦을 수 없어요.')
        return
      }
    }
    setError('')
    const { startDate, endDate } = getPeriodDates(period, customStart, customEnd, today)
    onSearch({ memo, startDate, endDate, categoryIds: selectedCategoryIds, isFixed })
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <Input
        label="메모"
        onChange={(e) => setMemo(e.target.value)}
        placeholder="메모 내용으로 검색"
        type="text"
        value={memo}
      />

      <PeriodSelector
        customEnd={customEnd}
        customStart={customStart}
        onCustomEndChange={setCustomEnd}
        onCustomStartChange={setCustomStart}
        onPeriodChange={setPeriod}
        period={period}
        today={today}
      />

      {error ? (
        <p className="text-sm font-semibold text-(--color-expense-red)">{error}</p>
      ) : null}

      <div className="grid gap-4">
        <CategorySelect
          categories={expenseCategories}
          label="지출 카테고리"
          onChange={toggleCategory}
          selectedCategoryIds={selectedCategoryIds}
        />
        <CategorySelect
          categories={incomeCategories}
          label="수입 카테고리"
          onChange={toggleCategory}
          selectedCategoryIds={selectedCategoryIds}
        />
      </div>

      <FixedToggle checked={isFixed} onChange={setIsFixed} />

      <Button disabled={isLoading} type="submit">
        {isLoading ? '조회 중...' : '조회하기'}
      </Button>
    </form>
  )
}
