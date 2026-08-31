import { useState } from 'react'
import StatisticsCard from './StatisticsCard'
import Button from '../common/Button'
import CategorySelect from '../categories/CategorySelect'
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

  const toggleCategory = (id: string) =>
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    )

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      setError('시작일과 종료일을 입력해주세요.')
      return
    }
    if (startDate > endDate) {
      setError('시작일이 종료일보다 늦을 수 없어요.')
      return
    }
    if (selectedCategoryIds.length === 0) {
      setError('카테고리를 하나 이상 선택해주세요.')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      const results = await getTransactionsByFilter({ startDate, endDate, categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined })
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
              <div className="flex divide-x divide-black/10 overflow-hidden rounded-2xl glass-input">
                <div className="flex-1 px-3 py-2.5">
                  <p className="text-xs font-semibold text-gray-500">시작일</p>
                  <input
                    className="mt-1 w-full bg-transparent text-sm font-medium text-black outline-none"
                    max={endDate || today}
                    onChange={(e) => setStartDate(e.target.value)}
                    type="date"
                    value={startDate}
                  />
                </div>
                <div className="flex-1 px-3 py-2.5">
                  <p className="text-xs font-semibold text-gray-500">종료일</p>
                  <input
                    className="mt-1 w-full bg-transparent text-sm font-medium text-black outline-none"
                    max={today}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    type="date"
                    value={endDate}
                  />
                </div>
              </div>

              {error ? (
                <p className="text-sm font-semibold text-(--color-expense-red)">{error}</p>
              ) : null}

              <div className="grid gap-4">
                <CategorySelect
                  categories={expenseCategories}
                  label="지출"
                  onChange={toggleCategory}
                  selectedCategoryIds={selectedCategoryIds}
                />
                <CategorySelect
                  categories={incomeCategories}
                  label="수입"
                  onChange={toggleCategory}
                  selectedCategoryIds={selectedCategoryIds}
                />
              </div>

              <Button disabled={isLoading} onClick={handleSearch}>
                {isLoading ? '검색 중...' : '검색'}
              </Button>
            </div>
          ) : (
            <div className="grid gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-400">{startDate} ~ {endDate}</p>
                  <div className="mt-3 flex gap-4">
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
                      <p className="mb-1.5 text-[12px] font-semibold text-(--ink-2)">{formatMonthDay(date)}</p>
                      <div className="grid gap-1.5">
                        {grouped[date].map((tx) => (
                          <button
                            key={tx.id}
                            className="flex w-full items-center gap-[9px] rounded-[12px] px-3 py-[9px] text-left transition hover:brightness-95"
                            onClick={() => onSelectTransaction(tx)}
                            style={{ background: 'rgba(255,255,255,0.45)' }}
                            type="button"
                          >
                            <span
                              className="h-2 w-2 shrink-0 rounded-full"
                              style={{ background: tx.categoryColor }}
                            />
                            <span className="min-w-0 flex-1">
                              {tx.memo ? (
                                <span className="block truncate text-[13px] font-semibold text-(--ink-1)">
                                  {tx.memo}
                                </span>
                              ) : (
                                <span className="block text-[13px] font-semibold text-(--ink-3)">메모 없음</span>
                              )}
                              <span className="block text-[11px] font-medium text-(--ink-3)">{tx.categoryName}</span>
                            </span>
                            <span
                              className={[
                                'shrink-0 text-[13px] font-semibold tabular-nums',
                                tx.type === 'income'
                                  ? 'text-(--color-income-blue)'
                                  : 'text-(--ink-1)',
                              ].join(' ')}
                            >
                              {tx.type === 'income' ? '+' : ''}{formatWon(tx.amount)}
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
