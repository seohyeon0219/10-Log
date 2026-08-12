import { useState, useEffect } from 'react'
import BackHeader from '../components/common/BackHeader'
import ResponsiveTransactionForm from '../components/transactions/ResponsiveTransactionForm'
import SearchBar, { type SearchFilters } from '../components/search/SearchBar'
import { getTransactionsByFilter, updateTransaction, deleteTransaction } from '../lib/financeApi'
import { formatMonthDay, formatWon } from '../utils/formatters'
import { useCalendarStore } from '../stores/calendarStore'
import type { Transaction, TransactionFormValues } from '../types/finance'

export default function SearchContainer() {
  const expenseCategories = useCalendarStore((state) => state.expenseCategories)
  const incomeCategories = useCalendarStore((state) => state.incomeCategories)
  const addCategory = useCalendarStore((state) => state.addCategory)
  const deleteCategory = useCalendarStore((state) => state.deleteCategory)
  const updateCategory = useCalendarStore((state) => state.updateCategory)
  const loadMonth = useCalendarStore((state) => state.loadMonth)

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [lastFilters, setLastFilters] = useState<SearchFilters | null>(null)

  useEffect(() => {
    void loadMonth()
  }, [loadMonth])

  const runSearch = async (filters: SearchFilters) => {
    setIsLoading(true)
    try {
      const results = await getTransactionsByFilter({
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        categoryIds: filters.categoryIds.length > 0 ? filters.categoryIds : undefined,
        memo: filters.memo || undefined,
        isFixed: filters.isFixed || undefined,
      })
      setTransactions(results)
      setHasSearched(true)
      setLastFilters(filters)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (values: TransactionFormValues) => {
    if (!selectedTransaction) return
    await updateTransaction(selectedTransaction.id, values)
    setSelectedTransaction(null)
    if (lastFilters) await runSearch(lastFilters)
  }

  const handleDelete = async () => {
    if (!selectedTransaction) return
    await deleteTransaction(selectedTransaction.id)
    setSelectedTransaction(null)
    if (lastFilters) await runSearch(lastFilters)
  }

  const activeCategories =
    selectedTransaction?.type === 'income' ? incomeCategories : expenseCategories

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)

  const grouped = transactions.reduce<Record<string, Transaction[]>>((acc, tx) => {
    ;(acc[tx.date] ??= []).push(tx)
    return acc
  }, {})
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <section className="w-full self-start animate-fade-up">
      <BackHeader />

      <SearchBar
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
        isLoading={isLoading}
        onSearch={runSearch}
      />

      {hasSearched && (
        <div className="mt-6">
          {(totalExpense > 0 || totalIncome > 0) && (
            <div className="mb-4 flex gap-4">
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
          )}

          {transactions.length === 0 ? (
            <p className="py-8 text-center text-sm font-semibold text-gray-400">
              조건에 맞는 내역이 없어요.
            </p>
          ) : (
            <div className="grid gap-4">
              {sortedDates.map((date) => (
                <div key={date}>
                  <p className="mb-1.5 text-[12px] font-bold text-gray-500">
                    {formatMonthDay(date)}
                  </p>
                  <div className="grid gap-1.5">
                    {grouped[date].map((tx) => (
                      <button
                        className="flex w-full items-center gap-2 rounded-[14px] bg-black/4 px-3 py-2.5 text-left transition hover:bg-black/8"
                        key={tx.id}
                        onClick={() => setSelectedTransaction(tx)}
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

      {selectedTransaction ? (
        <ResponsiveTransactionForm
          categories={activeCategories}
          expenseCategories={expenseCategories}
          incomeCategories={incomeCategories}
          initialAmount={selectedTransaction.amount}
          initialCategoryId={selectedTransaction.categoryId}
          initialIsFixed={selectedTransaction.isFixed}
          initialMemo={selectedTransaction.memo}
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
