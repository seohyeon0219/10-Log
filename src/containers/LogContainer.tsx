import { useEffect, useMemo, useState } from 'react'
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
      if (tx.satisfaction === 'satisfied') counts.satisfied++
      else if (tx.satisfaction === 'neutral') counts.neutral++
      else if (tx.satisfaction === 'regret') counts.regret++
      else counts.untagged++
    }
    return counts
  }, [transactions])

  const satisfactionCount = moodCounts.satisfied + moodCounts.neutral + moodCounts.regret

  const filteredTransactions = useMemo(() => {
    if (!moodFilter) return transactions
    if (moodFilter === 'untagged') return transactions.filter((tx) => !tx.satisfaction)
    return transactions.filter((tx) => tx.satisfaction === moodFilter)
  }, [transactions, moodFilter])

  const activeCategories =
    editingTransaction?.type === 'income' ? incomeCategories : expenseCategories

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
      <div className="mb-4 md:hidden">
        <CalendarMonthHeader
          currentDate={currentDate}
          onNextMonth={goNextMonth}
          onPrevMonth={goPrevMonth}
        />
      </div>

      <div className="grid gap-4">
        <ReportProgressCard currentDate={currentDate} satisfactionCount={satisfactionCount} />

        <MoodFilterBar counts={moodCounts} onChange={setMoodFilter} selected={moodFilter} />

        <LogTransactionList
          onSelectTransaction={setEditingTransaction}
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
