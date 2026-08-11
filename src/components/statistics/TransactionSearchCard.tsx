import { useState } from 'react'
import StatisticsCard from './StatisticsCard'
import Button from '../common/Button'
import Input from '../common/Input'
import { getTransactionsByFilter } from '../../lib/financeApi'
import { toDateKey } from '../../utils/dateUtils'
import { formatMonthDay, formatWon } from '../../utils/formatters'
import type { Category, Transaction } from '../../types/finance'
import type { SelectedStatisticsTransaction } from '../../hooks/useStatsPage'

type Props = {
  expenseCategories: Category[]
  incomeCategories: Category[]
  onSelectTransaction: (tx: SelectedStatisticsTransaction) => void
}

export default function TransactionSearchCard({ expenseCategories, incomeCategories, onSelectTransaction }: Props) {
  const today = toDateKey(new Date())
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<'form' | 'results'>('form')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState(today)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      setError('시작일과 종료일을 입력해주세요.')
      return
    }
    if (startDate > endDate) {
      setError('시작일이 종료일보다 늦을 수 없어요.')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      const results = await getTransactionsByFilter(startDate, endDate, selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined)
      setTransactions(results)
      setView('results')
    } finally {
      setIsLoading(false)
    }
  }

  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)

  const grouped = transactions.reduce<Record<string, Transaction[]>>((acc, tx) => {
    ;(acc[tx.date] ??= []).push(tx)
    return acc
  }, {})
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <StatisticsCard>
      {/* 드롭다운 헤더 */}
      <button
        className="flex w-full items-center justify-between"
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
      >
        <h3 className="text-[15px] font-bold text-black">소비내역 조회</h3>
        <ChevronIcon isOpen={isOpen} />
      </button>

      {isOpen && (
        <div className="mt-5">
          {view === 'form' ? (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="시작일"
                  max={endDate || today}
                  onChange={(e) => setStartDate(e.target.value)}
                  type="date"
                  value={startDate}
                />
                <Input
                  label="종료일"
                  max={today}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  type="date"
                  value={endDate}
                />
              </div>

              {error ? (
                <p className="text-sm font-semibold text-(--color-expense-red)">{error}</p>
              ) : null}

              <div className="grid gap-4">
                <CategoryGroup
                  categories={expenseCategories}
                  label="지출"
                  selectedCategoryIds={selectedCategoryIds}
                  onToggle={(id) =>
                    setSelectedCategoryIds((prev) =>
                      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
                    )
                  }
                />
                <CategoryGroup
                  categories={incomeCategories}
                  label="수입"
                  selectedCategoryIds={selectedCategoryIds}
                  onToggle={(id) =>
                    setSelectedCategoryIds((prev) =>
                      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
                    )
                  }
                />
              </div>

              <Button disabled={isLoading} onClick={handleSearch}>
                {isLoading ? '조회 중...' : '조회하기'}
              </Button>
            </div>
          ) : (
            <div className="grid gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-400">{startDate} ~ {endDate}</p>
                  <div className="mt-1 flex gap-4">
                    {totalExpense > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400">지출</p>
                        <p className="text-[15px] font-extrabold text-(--color-expense-red)">
                          -{formatWon(totalExpense)}
                        </p>
                      </div>
                    )}
                    {totalIncome > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400">수입</p>
                        <p className="text-[15px] font-extrabold text-(--color-income-blue)">
                          +{formatWon(totalIncome)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  className="shrink-0 text-sm font-semibold text-gray-400 transition hover:text-black"
                  onClick={() => setView('form')}
                  type="button"
                >
                  필터 변경
                </button>
              </div>

              {transactions.length === 0 ? (
                <p className="py-6 text-center text-sm font-semibold text-gray-400">
                  조건에 맞는 내역이 없어요.
                </p>
              ) : (
                <div className="grid max-h-80 gap-4 overflow-y-auto">
                  {sortedDates.map((date) => (
                    <div key={date}>
                      <p className="mb-1.5 text-[12px] font-bold text-gray-500">{formatMonthDay(date)}</p>
                      <div className="grid gap-1.5">
                        {grouped[date].map((tx) => (
                          <button
                            key={tx.id}
                            className="flex w-full items-center gap-2 rounded-[14px] bg-black/4 px-3 py-2.5 text-left transition hover:bg-black/8"
                            onClick={() => onSelectTransaction(tx)}
                            type="button"
                          >
                            <span
                              className="h-2 w-2 shrink-0 rounded-full"
                              style={{ background: tx.categoryColor }}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block text-[13px] font-bold text-black">
                                {tx.categoryName}
                              </span>
                              {tx.memo && (
                                <span className="block truncate text-[11.5px] text-(--color-text-sand)">
                                  {tx.memo}
                                </span>
                              )}
                            </span>
                            <span
                              className={[
                                'shrink-0 text-[13.5px] font-extrabold',
                                tx.type === 'income'
                                  ? 'text-(--color-income-blue)'
                                  : 'text-(--color-expense-red)',
                              ].join(' ')}
                            >
                              {tx.type === 'income' ? '+' : '-'}
                              {formatWon(tx.amount)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </StatisticsCard>
  )
}

function CategoryGroup({
  categories,
  label,
  onToggle,
  selectedCategoryIds,
}: {
  categories: Category[]
  label: string
  onToggle: (id: string) => void
  selectedCategoryIds: string[]
}) {
  if (categories.length === 0) return null
  return (
    <div>
      <p className="mb-2 text-xs font-bold text-gray-400">{label}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {categories.map((category) => {
          const isSelected = selectedCategoryIds.includes(category.id)
          return (
            <button
              key={category.id}
              aria-pressed={isSelected}
              className={[
                'inline-flex min-h-11 min-w-0 cursor-pointer items-center gap-2 rounded-xl border border-white/60 bg-white/55 px-3 text-left text-sm transition',
                isSelected ? 'font-bold' : 'font-semibold text-gray-500 hover:bg-white/70',
              ].join(' ')}
              onClick={() => onToggle(category.id)}
              style={
                isSelected
                  ? {
                      backgroundColor: `${category.color}18`,
                      boxShadow: `inset 0 0 0 1.5px ${category.color}55`,
                    }
                  : undefined
              }
              type="button"
            >
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: category.color }} />
              <span className="min-w-0 truncate">{category.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={['transition-transform duration-200', isOpen ? 'rotate-180' : ''].join(' ')}
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
    >
      <path
        d="M3 6l5 5 5-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}
