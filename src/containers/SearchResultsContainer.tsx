import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import BackHeader from '../components/common/BackHeader'
import ResponsiveTransactionForm from '../components/transactions/ResponsiveTransactionForm'
import { getTransactionsByFilter, updateTransaction, deleteTransaction } from '../lib/financeApi'
import { formatMonthDay, formatWon } from '../utils/formatters'
import { useCalendarStore } from '../stores/calendarStore'
import type { Transaction, TransactionFormValues } from '../types/finance'

const rowStyle = {
  background: 'rgba(255,255,255,0.62)',
  border: '1px solid rgba(255,255,255,0.92)',
  boxShadow: '0 6px 16px rgba(90,75,40,0.05), inset 0 1px 0 rgba(255,255,255,0.9)',
  backdropFilter: 'blur(22px) saturate(140%)',
  WebkitBackdropFilter: 'blur(22px) saturate(140%)',
}

export default function SearchResultsContainer() {
  const expenseCategories = useCalendarStore((state) => state.expenseCategories)
  const incomeCategories = useCalendarStore((state) => state.incomeCategories)
  const addCategory = useCalendarStore((state) => state.addCategory)
  const deleteCategory = useCalendarStore((state) => state.deleteCategory)
  const updateCategory = useCalendarStore((state) => state.updateCategory)
  const loadMonth = useCalendarStore((state) => state.loadMonth)

  const [searchParams] = useSearchParams()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  useEffect(() => {
    void loadMonth()
  }, [loadMonth])

  const getFilters = () => {
    const categoryIdsParam = searchParams.get('categoryIds')
    return {
      memo: searchParams.get('memo') ?? undefined,
      startDate: searchParams.get('startDate') ?? undefined,
      endDate: searchParams.get('endDate') ?? undefined,
      categoryIds: categoryIdsParam ? categoryIdsParam.split(',') : undefined,
      isFixed: searchParams.get('isFixed') === '1' ? true : undefined,
    }
  }

  useEffect(() => {
    setIsLoading(true)
    getTransactionsByFilter(getFilters())
      .then(setTransactions)
      .finally(() => setIsLoading(false))
  }, [searchParams])

  const refetch = async () => {
    const results = await getTransactionsByFilter(getFilters())
    setTransactions(results)
  }

  const handleSave = async (values: TransactionFormValues) => {
    if (!selectedTransaction) return
    await updateTransaction(selectedTransaction.id, values)
    setSelectedTransaction(null)
    await refetch()
  }

  const handleDelete = async () => {
    if (!selectedTransaction) return
    await deleteTransaction(selectedTransaction.id)
    setSelectedTransaction(null)
    await refetch()
  }

  const activeCategories =
    selectedTransaction?.type === 'income' ? incomeCategories : expenseCategories

  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)

  const grouped = transactions.reduce<Record<string, Transaction[]>>((acc, tx) => {
    ;(acc[tx.date] ??= []).push(tx)
    return acc
  }, {})
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <section className="w-full self-start animate-fade-up">
      <BackHeader title="검색 결과" />

      {isLoading ? (
        <p className="py-8 text-center text-sm font-semibold text-(--ink-3)">검색 중...</p>
      ) : (
        <>
          {(totalExpense > 0 || totalIncome > 0) && (
            <div className="mb-3 rounded-[26px] glass-card px-5 py-4">
              <p className="mb-2 text-xs font-semibold text-(--ink-3)">
                {transactions.length}건
              </p>
              <div className="flex gap-5">
                {totalExpense > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-(--ink-3)">지출</p>
                    <p className="text-[15px] font-extrabold text-(--color-expense-red)">
                      -{formatWon(totalExpense)}
                    </p>
                  </div>
                )}
                {totalIncome > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-(--ink-3)">수입</p>
                    <p className="text-[15px] font-extrabold text-(--color-income-blue)">
                      +{formatWon(totalIncome)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {transactions.length === 0 ? (
            <div className="rounded-[26px] glass-card px-6 py-12 text-center">
              <p className="text-sm font-semibold text-(--ink-3)">조건에 맞는 내역이 없어요.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {sortedDates.map((date) => {
                const dayTxs = grouped[date]
                const dayNet = dayTxs.reduce((s, t) => t.type === 'income' ? s + t.amount : s - t.amount, 0)
                return (
                  <div
                    className="rounded-[26px] glass-card p-4"
                    key={date}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-[12px] font-semibold text-(--ink-2)">
                        {formatMonthDay(date)}
                      </p>
                      <p className={['text-[12px] font-semibold tabular-nums', dayNet >= 0 ? 'text-(--color-income-blue)' : 'text-(--color-expense-red)'].join(' ')}>
                        {dayNet >= 0 ? `+${formatWon(dayNet)}` : `-${formatWon(Math.abs(dayNet))}`}
                      </p>
                    </div>
                    <div className="grid gap-1.5">
                      {dayTxs.map((tx) => (
                        <button
                          className="flex w-full items-center gap-[10px] rounded-[16px] px-[13px] py-[11px] text-left transition hover:brightness-95"
                          key={tx.id}
                          onClick={() => setSelectedTransaction(tx)}
                          style={rowStyle}
                          type="button"
                        >
                          <span
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ background: tx.categoryColor }}
                          />
                          <span
                            className="max-w-[30%] shrink-0 truncate rounded-full px-2.5 py-1 text-[11px] font-semibold"
                            style={{ background: `${tx.categoryColor}22`, color: tx.categoryColor }}
                          >
                            {tx.categoryName}
                          </span>
                          <span className="min-w-0 flex-1">
                            {tx.memo ? (
                              <span className="block truncate text-[14px] font-semibold text-(--ink-1)">{tx.memo}</span>
                            ) : (
                              <span className="block text-[14px] font-semibold text-(--ink-3)">메모 없음</span>
                            )}
                          </span>
                          <span className={['shrink-0 text-[14px] font-semibold tabular-nums', tx.type === 'income' ? 'text-(--color-income-blue)' : 'text-(--ink-1)'].join(' ')}>
                            {tx.type === 'income' ? '+' : ''}{formatWon(tx.amount)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {selectedTransaction ? (
        <ResponsiveTransactionForm
          categories={activeCategories}
          expenseCategories={expenseCategories}
          incomeCategories={incomeCategories}
          initialAmount={selectedTransaction.amount}
          initialCategoryId={selectedTransaction.categoryId}
          initialIsFixed={selectedTransaction.isFixed}
          initialMemo={selectedTransaction.memo}
          initialSatisfaction={selectedTransaction.satisfaction}
          isOpen
          mode="edit"
          onClose={() => setSelectedTransaction(null)}
          onCreateCategory={addCategory}
          onDelete={handleDelete}
          onDeleteCategory={deleteCategory}
          onSave={handleSave}
          onUpdateCategory={updateCategory}
          selectedDate={new Date(`${selectedTransaction.date}T00:00:00`)}
          type={selectedTransaction.type}
        />
      ) : null}
    </section>
  )
}
