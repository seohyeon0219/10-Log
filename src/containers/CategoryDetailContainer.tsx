import { useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import BackHeader from '../components/common/BackHeader'
import SegmentedControl from '../components/common/SegmentedControl'
import ResponsiveTransactionForm from '../components/transactions/ResponsiveTransactionForm'
import { useCalendarStore } from '../stores/calendarStore'
import type { Transaction, TransactionType } from '../types/finance'
import SatisfactionIcon from '../components/common/SatisfactionIcon'
import { formatMonthDay, formatWon } from '../utils/formatters'

const CATEGORY_HUE: Record<string, number> = {
  '식비': 35, '카페': 65, '생필품': 155, '교통': 195, '의료·건강': 220,
  '주거': 250, '구독': 275, '취미·여가': 305, '쇼핑': 330, '경조사·선물': 5,
}

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

  const filtered = useMemo(
    () => transactions.filter((tx) => tx.categoryId === categoryId && tx.type === type),
    [transactions, categoryId, type],
  )

  const categoryName = filtered[0]?.categoryName ?? ''
  const categoryColor = filtered[0]?.categoryColor ?? '#9ca3af'
  const totalAmount = filtered.reduce((sum, tx) => sum + tx.amount, 0)
  const count = filtered.length
  const average = count > 0 ? Math.round(totalAmount / count) : 0

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
  const hue = CATEGORY_HUE[categoryName] ?? 35
  const activeCategories = type === 'income' ? incomeCategories : expenseCategories

  const satisfactionCounts = useMemo(() => {
    const counts = { satisfied: 0, neutral: 0, regret: 0, untagged: 0 }
    for (const tx of filtered) {
      if (tx.satisfaction === 'satisfied') counts.satisfied++
      else if (tx.satisfaction === 'neutral') counts.neutral++
      else if (tx.satisfaction === 'regret') counts.regret++
      else counts.untagged++
    }
    return counts
  }, [filtered])

  const scored = count - satisfactionCounts.untagged
  const pct = (k: 'satisfied' | 'neutral' | 'regret') =>
    (scored ? (satisfactionCounts[k] / scored) * 100 : 0).toFixed(1) + '%'

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
      <div
        style={{
          marginTop: 14, marginBottom: 14,
          position: 'relative',
          borderRadius: 24,
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.62)',
          border: '1px solid rgba(255,255,255,0.92)',
          backdropFilter: 'blur(28px) saturate(150%)',
          WebkitBackdropFilter: 'blur(28px) saturate(150%)',
          boxShadow: '0 14px 34px rgba(90,75,40,0.09), inset 0 1px 0 rgba(255,255,255,0.95)',
        }}
      >
        {/* 틴트 레이어 */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(120% 100% at 0% 0%,   oklch(0.82 0.09 ${hue} / 0.30) 0%, transparent 62%),
            radial-gradient(90% 80% at 100% 10%,  oklch(0.85 0.07 ${hue + 25} / 0.22) 0%, transparent 58%)
          `,
        }} />

        {/* 내용 */}
        <div style={{ position: 'relative', padding: '19px 18px 17px' }}>

          {/* ① 총액 블록 */}
          <div>
            <div style={{ font: '500 12px/1 Pretendard', color: 'rgba(21,26,34,0.55)' }}>
              {month} {categoryName} {type === 'income' ? '수입' : '지출'}
            </div>
            <div style={{ marginTop: 9, display: 'flex', alignItems: 'baseline', gap: 5 }}>
              <span style={{ font: '600 32px/1 Pretendard', color: '#151a22', letterSpacing: '-0.035em' }}>
                {totalAmount.toLocaleString('ko-KR')}
              </span>
              <span style={{ font: '600 17px/1 Pretendard', color: 'rgba(21,26,34,0.5)' }}>원</span>
            </div>
          </div>

          {/* 구분선 */}
          <div style={{ marginTop: 16, marginBottom: 15, height: 1, background: 'rgba(21,26,34,0.09)' }} />

          {/* ② 3분할 지표 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div>
              <div style={{ font: '500 11px/1 Pretendard', color: 'rgba(21,26,34,0.5)' }}>건수</div>
              <div style={{ marginTop: 7, font: '600 16px/1 Pretendard', color: '#151a22', letterSpacing: '-0.02em' }}>
                {count}건
              </div>
            </div>
            <div style={{ paddingLeft: 14, borderLeft: '1px solid rgba(21,26,34,0.09)' }}>
              <div style={{ font: '500 11px/1 Pretendard', color: 'rgba(21,26,34,0.5)' }}>1건 평균</div>
              <div style={{ marginTop: 7, font: '600 16px/1 Pretendard', color: '#151a22', letterSpacing: '-0.02em' }}>
                {formatWon(average)}
              </div>
            </div>
            <div style={{ paddingLeft: 14, borderLeft: '1px solid rgba(21,26,34,0.09)' }}>
              <div style={{ font: '500 11px/1 Pretendard', color: 'rgba(21,26,34,0.5)' }}>전체 비중</div>
              <div style={{ marginTop: 7, font: '600 16px/1 Pretendard', color: '#151a22', letterSpacing: '-0.02em' }}>
                {ratioPercent}%
              </div>
            </div>
          </div>

          {/* 구분선 */}
          <div style={{ marginTop: 16, marginBottom: 15, height: 1, background: 'rgba(21,26,34,0.09)' }} />

          {/* ③ 감정 분포 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ font: '500 11px/1 Pretendard', color: 'rgba(21,26,34,0.5)' }}>이 분류의 감정</span>
              {satisfactionCounts.untagged > 0 && (
                <span style={{ font: '500 11px/1 Pretendard', color: 'rgba(21,26,34,0.45)' }}>
                  {satisfactionCounts.untagged}건 미입력
                </span>
              )}
            </div>
            <div style={{
              marginTop: 10, height: 7, borderRadius: 4,
              background: 'rgba(21,26,34,0.09)',
              overflow: 'hidden', display: 'flex',
            }}>
              <div style={{ width: pct('satisfied'), background: 'rgba(27,33,48,0.82)', transition: 'width .4s' }} />
              <div style={{ width: pct('neutral'), background: 'rgba(27,33,48,0.42)', transition: 'width .4s' }} />
              <div style={{ width: pct('regret'), background: 'rgba(27,33,48,0.15)', transition: 'width .4s' }} />
            </div>
            <div style={{ marginTop: 11, display: 'flex', gap: 14 }}>
              {(['satisfied', 'neutral', 'regret'] as const).map((v) => (
                <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <SatisfactionIcon className="text-(--ink-2)" size={12} value={v} />
                  <span style={{ font: '500 11px/1 Pretendard', color: 'rgba(21,26,34,0.55)' }}>
                    {v === 'satisfied' ? '만족' : v === 'neutral' ? '보통' : '후회'} {satisfactionCounts[v]}
                  </span>
                </div>
              ))}
            </div>
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
