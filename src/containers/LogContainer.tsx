import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CalendarMonthHeader from '../components/calendar/CalendarMonthHeader'
import LogTransactionList from '../components/log/LogTransactionList'
import MoodFilterBar from '../components/log/MoodFilterBar'
import ReportProgressCard from '../components/log/ReportProgressCard'
import ResponsiveTransactionForm from '../components/transactions/ResponsiveTransactionForm'
import { useCalendarStore } from '../stores/calendarStore'
import type { Satisfaction, Transaction } from '../types/finance'
import type { MoodFilter } from '../components/log/MoodFilterBar'

export default function LogContainer() {
  const addCategory = useCalendarStore((state) => state.addCategory)
  const currentDate = useCalendarStore((state) => state.currentDate)
  const deleteCategory = useCalendarStore((state) => state.deleteCategory)
  const deleteTransaction = useCalendarStore((state) => state.deleteTransaction)
  const expenseCategories = useCalendarStore((state) => state.expenseCategories)
  const goNextMonth = useCalendarStore((state) => state.goNextMonth)
  const goPrevMonth = useCalendarStore((state) => state.goPrevMonth)
  const incomeCategories = useCalendarStore((state) => state.incomeCategories)
  const loadMonth = useCalendarStore((state) => state.loadMonth)
  const transactions = useCalendarStore((state) => state.transactions)
  const updateCategory = useCalendarStore((state) => state.updateCategory)
  const updateTransaction = useCalendarStore((state) => state.updateTransaction)

  const [moodFilter, setMoodFilter] = useState<MoodFilter>(null)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  useEffect(() => {
    void loadMonth()
  }, [loadMonth])

  const moodCounts = useMemo(() => {
    const counts = { neutral: 0, regret: 0, satisfied: 0, untagged: 0 }
    for (const tx of transactions) {
      if (tx.type !== 'expense') continue
      if (tx.satisfaction === 'satisfied') counts.satisfied++
      else if (tx.satisfaction === 'neutral') counts.neutral++
      else if (tx.satisfaction === 'regret') counts.regret++
      else counts.untagged++
    }
    return counts
  }, [transactions])

  const satisfactionCount = moodCounts.satisfied + moodCounts.neutral + moodCounts.regret

  const insights = useMemo(() => {
    const map = new Map<string, { name: string; satisfied: number; regret: number; tagged: number }>()
    for (const cat of expenseCategories) {
      map.set(cat.id, { name: cat.name, satisfied: 0, regret: 0, tagged: 0 })
    }
    for (const tx of transactions) {
      if (tx.type !== 'expense' || !tx.categoryId || !tx.satisfaction) continue
      const s = map.get(tx.categoryId)
      if (!s) continue
      s.tagged++
      if (tx.satisfaction === 'satisfied') s.satisfied++
      if (tx.satisfaction === 'regret') s.regret++
    }

    const sentences: string[] = []

    let topSatisfied: { name: string; satisfied: number } | null = null
    let topRegret: { name: string; regret: number } | null = null

    for (const s of map.values()) {
      if (s.satisfied >= 2 && s.satisfied / s.tagged > 0.5) {
        if (!topSatisfied || s.satisfied > topSatisfied.satisfied) topSatisfied = s
      }
      if (s.regret >= 1) {
        if (!topRegret || s.regret > topRegret.regret) topRegret = s
      }
    }

    if (topSatisfied) sentences.push(`이번 달 ${topSatisfied.name} 지출은 대부분 만족으로 남았어요`)
    if (topRegret) sentences.push(`후회 소비가 가장 많았던 카테고리는 ${topRegret.name}예요`)

    return sentences
  }, [transactions, expenseCategories])

  const expenseTransactions = useMemo(
    () => transactions.filter((tx) => tx.type === 'expense'),
    [transactions],
  )

  const filteredTransactions = useMemo(() => {
    if (!moodFilter) return expenseTransactions
    if (moodFilter === 'untagged') return expenseTransactions.filter((tx) => !tx.satisfaction)
    return expenseTransactions.filter((tx) => tx.satisfaction === moodFilter)
  }, [expenseTransactions, moodFilter])

  const activeCategories =
    editingTransaction?.type === 'income' ? incomeCategories : expenseCategories

  const handleSave = async (values: Parameters<typeof updateTransaction>[1]) => {
    if (!editingTransaction) return
    await updateTransaction(editingTransaction.id, values)
    setEditingTransaction(null)
  }

  const handleQuickTag = async (txId: string, satisfaction: Satisfaction) => {
    const tx = transactions.find((t) => t.id === txId)
    if (!tx) return
    await updateTransaction(txId, {
      amount: tx.amount,
      categoryId: tx.categoryId,
      date: tx.date,
      isFixed: tx.isFixed,
      memo: tx.memo,
      satisfaction,
    })
  }

  const handleDelete = async () => {
    if (!editingTransaction) return
    await deleteTransaction(editingTransaction.id)
    setEditingTransaction(null)
  }

  return (
    <section className="w-full self-start animate-fade-up md:mt-4">
      <div className="mb-4 md:hidden">
        <CalendarMonthHeader
          currentDate={currentDate}
          onNextMonth={goNextMonth}
          onPrevMonth={goPrevMonth}
        />
      </div>

      <div className="grid gap-4">
        <Link to="/app/stats/review">
          <ReportProgressCard currentDate={currentDate} insights={insights} satisfactionCount={satisfactionCount} />
        </Link>

        <MoodFilterBar counts={moodCounts} onChange={setMoodFilter} selected={moodFilter} />

        <LogTransactionList
          onQuickTag={handleQuickTag}
          onTagUntagged={() => setMoodFilter('untagged')}
          transactions={filteredTransactions}
          untaggedCount={moodFilter === null ? moodCounts.untagged : 0}
        />
      </div>

      {editingTransaction && (
        <ResponsiveTransactionForm
          categories={activeCategories}
          expenseCategories={expenseCategories}
          incomeCategories={incomeCategories}
          initialAmount={editingTransaction.amount}
          initialCategoryId={editingTransaction.categoryId}
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
