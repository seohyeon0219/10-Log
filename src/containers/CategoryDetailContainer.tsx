import { useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import BackHeader from '../components/common/BackHeader'
import SegmentedControl from '../components/common/SegmentedControl'
import ResponsiveTransactionForm from '../components/transactions/ResponsiveTransactionForm'
import { useRecentMonthsTransactions } from '../hooks/useRecentMonthsTransactions'
import { useCalendarStore } from '../stores/calendarStore'
import type { Transaction, TransactionType } from '../types/finance'
import SatisfactionIcon from '../components/common/SatisfactionIcon'
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
  const [sortOrder, setSortOrder] = useState<'date' | 'amount'>('date')

  const { previousMonthData } = useRecentMonthsTransactions(currentDate, 2)

  const filtered = useMemo(
    () => transactions.filter((tx) => tx.categoryId === categoryId && tx.type === type),
    [transactions, categoryId, type],
  )

  const categoryName = filtered[0]?.categoryName ?? ''
  const totalAmount = filtered.reduce((sum, tx) => sum + tx.amount, 0)
  const count = filtered.length
  const average = count > 0 ? Math.round(totalAmount / count) : 0

  const prevMonthTotal = useMemo(
    () => previousMonthData
      .filter((tx) => tx.categoryId === categoryId && tx.type === type)
      .reduce((sum, tx) => sum + tx.amount, 0),
    [previousMonthData, categoryId, type],
  )

  const changePercent = prevMonthTotal > 0
    ? Math.round(((totalAmount - prevMonthTotal) / prevMonthTotal) * 100)
    : null

  const allTypeTotal = useMemo(
    () => transactions.filter((tx) => tx.type === type).reduce((sum, tx) => sum + tx.amount, 0),
    [transactions, type],
  )
  const ratioPercent = allTypeTotal > 0 ? Math.round((totalAmount / allTypeTotal) * 100) : 0

  const grouped = useMemo(() => {
    const map = new Map<string, Transaction[]>()
    for (const tx of [...filtered].sort((a, b) => b.date.localeCompare(a.date))) {
      const list = map.get(tx.date) ?? []
      list.push(tx)
      map.set(tx.date, list)
    }
    return [...map.entries()]
  }, [filtered])

  const sortedFlat = useMemo(
    () => [...filtered].sort((a, b) => b.amount - a.amount),
    [filtered],
  )

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
      <div className="mb-4 rounded-2xl glass-card px-5 py-4 shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
        <p className="text-[11px] font-semibold text-gray-400">
          {month} {categoryName} {type === 'income' ? '수입' : '지출'}
        </p>
        <p className="mt-1 text-[26px] font-extrabold tabular-nums text-black leading-tight">
          {formatWon(totalAmount)}
        </p>

        {/* 전월 비교 */}
        <div className="mt-1.5 flex items-center gap-2">
          {changePercent !== null ? (
            <span
              className={[
                'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold backdrop-blur-sm',
                changePercent >= 0
                  ? 'bg-red-500/10 text-(--color-expense-red)'
                  : 'bg-blue-500/10 text-(--color-income-blue)',
              ].join(' ')}
            >
              {changePercent >= 0 ? '▲' : '▼'} {Math.abs(changePercent)}%
            </span>
          ) : null}
          <span className="text-[11px] font-semibold text-gray-400">
            지난 달 {formatWon(prevMonthTotal)}
          </span>
        </div>

        {/* 통계 박스 */}
        <div className="mt-3 flex items-center divide-x divide-black/8 rounded-[14px] bg-black/4 px-1 py-2.5 backdrop-blur-sm">
          <div className="flex flex-1 flex-col items-center gap-0.5">
            <span className="text-[10px] font-semibold text-gray-400">건수</span>
            <span className="text-[13px] font-extrabold tabular-nums text-black">{count}건</span>
          </div>
          <div className="flex flex-1 flex-col items-center gap-0.5">
            <span className="text-[10px] font-semibold text-gray-400">평균</span>
            <span className="text-[13px] font-extrabold tabular-nums text-black">{formatWon(average)}</span>
          </div>
          <div className="flex flex-1 flex-col items-center gap-0.5">
            <span className="text-[10px] font-semibold text-gray-400">전체대비</span>
            <span className="text-[13px] font-extrabold tabular-nums text-black">{ratioPercent}%</span>
          </div>
        </div>
      </div>

      {/* 정렬 토글 */}
      {filtered.length > 0 && (
        <div className="mb-3 flex justify-end">
          <SegmentedControl
            onChange={setSortOrder}
            options={[
              { label: '최신', value: 'date' as const },
              { label: '금액', value: 'amount' as const },
            ]}
            value={sortOrder}
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-sm font-semibold text-gray-400">이번 달 내역이 없어요.</p>
      ) : sortOrder === 'date' ? (
        <div className="grid gap-4">
          {grouped.map(([date, txs]) => {
            const dayTotal = txs.reduce((sum, tx) => sum + tx.amount, 0)
            return (
              <div key={date}>
                <div className="mb-1.5 flex items-center justify-between px-1">
                  <p className="text-[11px] font-bold text-gray-400">{formatMonthDay(date)}</p>
                  <p className="text-[11px] font-bold tabular-nums text-gray-400">
                    {type === 'income' ? '+' : '-'}{formatWon(dayTotal)}
                  </p>
                </div>
                <div className="grid gap-1">
                  {txs.map((tx) => (
                    <button
                      className="flex w-full items-center gap-3 rounded-[18px] bg-white/60 py-3 pl-3 pr-4 text-left backdrop-blur-sm transition active:bg-white/80"
                      key={tx.id}
                      onClick={() => setEditingTransaction(tx)}
                      type="button"
                    >
                      <div className="min-w-0 flex-1">
                        {tx.memo ? (
                          <p className="truncate text-sm font-semibold text-gray-700">{tx.memo}</p>
                        ) : (
                          <p className="text-sm font-semibold text-gray-300">메모 없음</p>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <p className={[
                          'text-[13.5px] font-extrabold tabular-nums',
                          type === 'income' ? 'text-(--color-income-blue)' : 'text-(--color-expense-red)',
                        ].join(' ')}>
                          {type === 'income' ? '+' : '-'}{formatWon(tx.amount)}
                        </p>
                        <SatisfactionIcon
                          className={tx.satisfaction ? 'text-gray-500' : 'text-gray-300'}
                          size={14}
                          value={tx.satisfaction}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="grid gap-1">
          {sortedFlat.map((tx) => (
            <button
              className="flex w-full items-center gap-3 rounded-[18px] bg-white/60 py-3 pl-3 pr-4 text-left backdrop-blur-sm transition active:bg-white/80"
              key={tx.id}
              onClick={() => setEditingTransaction(tx)}
              type="button"
            >
              <div className="min-w-0 flex-1">
                {tx.memo ? (
                  <p className="truncate text-sm font-semibold text-gray-700">{tx.memo}</p>
                ) : (
                  <p className="text-sm font-semibold text-gray-300">메모 없음</p>
                )}
                <p className="text-[11px] font-semibold text-gray-400">{formatMonthDay(tx.date)}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <p className={[
                  'text-[13.5px] font-extrabold tabular-nums',
                  type === 'income' ? 'text-(--color-income-blue)' : 'text-(--color-expense-red)',
                ].join(' ')}>
                  {type === 'income' ? '+' : '-'}{formatWon(tx.amount)}
                </p>
                <SatisfactionIcon
                  className={tx.satisfaction ? 'text-gray-500' : 'text-gray-300'}
                  size={14}
                  value={tx.satisfaction}
                />
              </div>
            </button>
          ))}
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
