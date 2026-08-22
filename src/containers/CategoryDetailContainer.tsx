import { useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import BackHeader from '../components/common/BackHeader'
import ResponsiveTransactionForm from '../components/transactions/ResponsiveTransactionForm'
import { useCalendarStore } from '../stores/calendarStore'
import type { Transaction, TransactionType } from '../types/finance'
import { formatMonthDay, formatWon } from '../utils/formatters'

export default function CategoryDetailContainer() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const [searchParams] = useSearchParams()
  const type = (searchParams.get('type') ?? 'expense') as TransactionType

  const addCategory = useCalendarStore((state) => state.addCategory)
  const currentDate = useCalendarStore((state) => state.currentDate)
  const deleteCategory = useCalendarStore((state) => state.deleteCategory)
  const deleteTransaction = useCalendarStore((state) => state.deleteTransaction)
  const expenseCategories = useCalendarStore((state) => state.expenseCategories)
  const incomeCategories = useCalendarStore((state) => state.incomeCategories)
  const transactions = useCalendarStore((state) => state.transactions)
  const updateCategory = useCalendarStore((state) => state.updateCategory)
  const updateTransaction = useCalendarStore((state) => state.updateTransaction)

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const filtered = useMemo(
    () => transactions.filter((tx) => tx.categoryId === categoryId && tx.type === type),
    [transactions, categoryId, type],
  )

  const categoryName = filtered[0]?.categoryName ?? ''
  const categoryColor = filtered[0]?.categoryColor ?? '#9ca3af'
  const totalAmount = filtered.reduce((sum, tx) => sum + tx.amount, 0)
  const count = filtered.length
  const average = count > 0 ? Math.round(totalAmount / count) : 0

  const grouped = useMemo(() => {
    const map = new Map<string, Transaction[]>()
    for (const tx of [...filtered].sort((a, b) => b.date.localeCompare(a.date))) {
      const list = map.get(tx.date) ?? []
      list.push(tx)
      map.set(tx.date, list)
    }
    return [...map.entries()]
  }, [filtered])

  const month = `${currentDate.getMonth() + 1}월`
  const activeCategories = type === 'income' ? incomeCategories : expenseCategories

  const handleSave = async (values: Parameters<typeof updateTransaction>[1]) => {
    if (!editingTransaction) return
    await updateTransaction(editingTransaction.id, values)
    setEditingTransaction(null)
  }

  const handleDelete = async () => {
    if (!editingTransaction) return
    await deleteTransaction(editingTransaction.id)
    setEditingTransaction(null)
  }

  return (
    <section className="w-full self-start animate-fade-up md:mt-4">
      <BackHeader title={categoryName} to="/app/stats" />

      {/* 합계 카드 */}
      <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white/60 px-5 py-4 shadow-sm backdrop-blur-sm">
        <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: categoryColor }} />
        <div>
          <p className="text-[11px] font-semibold text-gray-400">{month} 합계</p>
          <p className="text-[22px] font-extrabold tabular-nums text-black leading-tight">
            {formatWon(totalAmount)}
          </p>
          {count > 0 && (
            <p className="mt-0.5 text-[11px] font-semibold text-gray-400">
              {count}건 · 평균 {formatWon(average)}
            </p>
          )}
        </div>
      </div>

      {grouped.length === 0 ? (
        <p className="mt-8 text-center text-sm font-semibold text-gray-400">이번 달 내역이 없어요.</p>
      ) : (
        <div className="grid gap-4">
          {grouped.map(([date, txs]) => {
            const dayTotal = txs.reduce((sum, tx) => sum + tx.amount, 0)

            return (
              <div key={date}>
                {/* 날짜 그룹 헤더 + 일 합계 */}
                <div className="mb-1.5 flex items-center justify-between px-1">
                  <p className="text-[11px] font-bold text-gray-400">{formatMonthDay(date)}</p>
                  <p className="text-[11px] font-bold tabular-nums text-gray-400">
                    {type === 'income' ? '+' : '-'}{formatWon(dayTotal)}
                  </p>
                </div>

                <div className="grid gap-1">
                  {txs.map((tx) => (
                    <button
                      className="flex w-full items-center gap-3 rounded-[18px] bg-white/60 px-4 py-3 text-left backdrop-blur-sm transition active:bg-white/80"
                      key={tx.id}
                      onClick={() => setEditingTransaction(tx)}
                      type="button"
                    >
                      <div className="min-w-0 flex-1">
                        {tx.memo ? (
                          <p className="truncate text-[12px] text-(--color-text-sand)">{tx.memo}</p>
                        ) : (
                          <p className="text-[12px] text-gray-300">메모 없음</p>
                        )}
                      </div>
                      <p className={[
                        'shrink-0 text-[13.5px] font-extrabold tabular-nums',
                        type === 'income' ? 'text-(--color-income-blue)' : 'text-(--color-expense-red)',
                      ].join(' ')}>
                        {type === 'income' ? '+' : '-'}{formatWon(tx.amount)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {editingTransaction && (
        <ResponsiveTransactionForm
          categories={activeCategories}
          expenseCategories={expenseCategories}
          incomeCategories={incomeCategories}
          initialAmount={editingTransaction.amount}
          initialCategoryId={editingTransaction.categoryId}
          initialIsFixed={editingTransaction.isFixed}
          initialMemo={editingTransaction.memo}
          initialSatisfaction={editingTransaction.satisfaction}
          isOpen
          mode="edit"
          onClose={() => setEditingTransaction(null)}
          onCreateCategory={addCategory}
          onDelete={handleDelete}
          onDeleteCategory={deleteCategory}
          onSave={handleSave}
          onUpdateCategory={updateCategory}
          selectedDate={new Date(`${editingTransaction.date}T00:00:00`)}
          type={editingTransaction.type}
        />
      )}
    </section>
  )
}
