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

const rowStyle = {
  background: 'rgba(255,255,255,0.62)',
  border: '1px solid rgba(255,255,255,0.92)',
  boxShadow: '0 6px 16px rgba(90,75,40,0.05), inset 0 1px 0 rgba(255,255,255,0.9)',
  backdropFilter: 'blur(22px) saturate(140%)',
  WebkitBackdropFilter: 'blur(22px) saturate(140%)',
}

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
  const categoryColor = filtered[0]?.categoryColor ?? '#9ca3af'
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

  const renderRow = (tx: Transaction, showDate = false) => (
    <button
      className="flex w-full items-center gap-[10px] rounded-[16px] px-[13px] py-[11px] text-left transition hover:brightness-95"
      key={tx.id}
      onClick={() => setEditingTransaction(tx)}
      style={rowStyle}
      type="button"
    >
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: categoryColor }} />
      <span className="min-w-0 flex-1">
        {tx.memo ? (
          <span className="block truncate text-[14px] font-semibold text-(--ink-1)">{tx.memo}</span>
        ) : (
          <span className="block text-[14px] font-semibold text-(--ink-3)">메모 없음</span>
        )}
        {showDate && (
          <span className="block text-[11px] font-medium text-(--ink-3)">{formatMonthDay(tx.date)}</span>
        )}
      </span>
      <div className="flex shrink-0 items-center gap-2">
        <span className={['text-[14px] font-semibold tabular-nums', type === 'income' ? 'text-(--color-income-blue)' : 'text-(--ink-1)'].join(' ')}>
          {type === 'income' ? '+' : ''}{formatWon(tx.amount)}
        </span>
        <SatisfactionIcon
          className={tx.satisfaction ? 'text-(--ink-2)' : 'text-(--ink-3)'}
          size={14}
          value={tx.satisfaction}
        />
      </div>
    </button>
  )

  return (
    <section className="w-full self-start animate-fade-up md:mt-4">
      <BackHeader title={categoryName} to="/app/stats" />

      {/* 합계 카드 */}
      <div className="mb-4 rounded-[26px] glass-card px-5 py-4">
        <p className="text-[11px] font-semibold text-(--ink-3)">
          {month} {categoryName} {type === 'income' ? '수입' : '지출'}
        </p>
        <p className="mt-1 text-[26px] font-extrabold tabular-nums text-(--ink-1) leading-tight">
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
          <span className="text-[11px] font-semibold text-(--ink-3)">
            지난 달 {formatWon(prevMonthTotal)}
          </span>
        </div>

        {/* 통계 박스 */}
        <div className="mt-3 flex items-center divide-x divide-black/8 rounded-[14px] bg-black/4 px-1 py-2.5 backdrop-blur-sm">
          <div className="flex flex-1 flex-col items-center gap-0.5">
            <span className="text-[10px] font-semibold text-(--ink-3)">건수</span>
            <span className="text-[13px] font-extrabold tabular-nums text-(--ink-1)">{count}건</span>
          </div>
          <div className="flex flex-1 flex-col items-center gap-0.5">
            <span className="text-[10px] font-semibold text-(--ink-3)">평균</span>
            <span className="text-[13px] font-extrabold tabular-nums text-(--ink-1)">{formatWon(average)}</span>
          </div>
          <div className="flex flex-1 flex-col items-center gap-0.5">
            <span className="text-[10px] font-semibold text-(--ink-3)">전체대비</span>
            <span className="text-[13px] font-extrabold tabular-nums text-(--ink-1)">{ratioPercent}%</span>
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
        <p className="mt-8 text-center text-sm font-semibold text-(--ink-3)">이번 달 내역이 없어요.</p>
      ) : sortOrder === 'date' ? (
        <div className="grid gap-4">
          {grouped.map(([date, txs]) => {
            const dayTotal = txs.reduce((sum, tx) => sum + tx.amount, 0)
            return (
              <div key={date}>
                <div className="mb-1.5 flex items-center justify-between px-1">
                  <span className="text-[12px] font-semibold text-(--ink-2)">{formatMonthDay(date)}</span>
                  <span className={['text-[12px] font-semibold tabular-nums', type === 'income' ? 'text-(--color-income-blue)' : 'text-(--ink-2)'].join(' ')}>
                    {type === 'income' ? '+' : ''}{formatWon(dayTotal)}
                  </span>
                </div>
                <div className="grid gap-1.5">
                  {txs.map((tx) => renderRow(tx, false))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="grid gap-1.5">
          {sortedFlat.map((tx) => renderRow(tx, true))}
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
