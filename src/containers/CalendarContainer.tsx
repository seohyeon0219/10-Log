import { useEffect, useRef } from 'react'
import CalendarGrid from '../components/calendar/CalendarGrid'
import CalendarMonthHeader from '../components/calendar/CalendarMonthHeader'
import CalendarMonthlySummary from '../components/calendar/CalendarMonthlySummary'
import TransactionDateList from '../components/transactions/TransactionDateList'
import FloatingAddButton from '../components/common/FloatingAddButton'
import ResponsiveTransactionForm from '../components/transactions/ResponsiveTransactionForm'
import { useCalendarTransactionForm } from '../hooks/useCalendarTransactionForm'
import { toDateKey } from '../utils/dateUtils'
import { useCalendarStore } from '../stores/calendarStore'

export default function CalendarContainer() {
  const txForm = useCalendarTransactionForm()

  const calendarDayAmounts = useCalendarStore((state) => state.calendarDayAmounts)
  const currentDate = useCalendarStore((state) => state.currentDate)
  const addCategory = useCalendarStore((state) => state.addCategory)
  const deleteCategory = useCalendarStore((state) => state.deleteCategory)
  const error = useCalendarStore((state) => state.error)
  const isLoading = useCalendarStore((state) => state.isLoading)
  const goNextMonth = useCalendarStore((state) => state.goNextMonth)
  const goPrevMonth = useCalendarStore((state) => state.goPrevMonth)
  const loadMonth = useCalendarStore((state) => state.loadMonth)
  const monthlySummary = useCalendarStore((state) => state.monthlySummary)
  const selectedDate = useCalendarStore((state) => state.selectedDate)
  const selectDate = useCalendarStore((state) => state.selectDate)
  const transactions = useCalendarStore((state) => state.transactions)
  const updateCategory = useCalendarStore((state) => state.updateCategory)

  const selectedDateKey = selectedDate ? toDateKey(selectedDate) : ''
  const selectedDateTransactions = transactions.filter((tx) => tx.date === selectedDateKey)

  const txListRef = useRef<HTMLDivElement>(null)
  const justSelected = useRef(false)

  useEffect(() => {
    void loadMonth()
  }, [loadMonth])

  useEffect(() => {
    if (!justSelected.current) return
    justSelected.current = false
    if (!selectedDate || !txListRef.current) return
    const top = txListRef.current.getBoundingClientRect().top + window.scrollY - 16
    window.scrollTo({ top, behavior: 'smooth' })
  }, [selectedDate])

  const handleDateSelect = (date: Date) => {
    justSelected.current = true
    selectDate(date)
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

      {error ? (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-(--color-expense-red)">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="mb-4 rounded-xl border border-white/60 bg-(--color-glass-white) px-4 py-3 text-sm font-semibold text-(--ink-3) backdrop-blur-sm">
          데이터를 불러오는 중이에요.
        </div>
      ) : null}

      <div className="md:hidden">
        <CalendarMonthlySummary {...monthlySummary} />
      </div>

      <div className="mt-4 md:hidden">
        <CalendarGrid
          currentDate={currentDate}
          dayAmounts={calendarDayAmounts}
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
        />
      </div>

      {selectedDate && (
        <div className="mt-4 rounded-[26px] glass-card p-4.5 md:hidden" ref={txListRef}>
          <TransactionDateList
            onSelectTransaction={txForm.openEdit}
            selectedDate={selectedDate}
            transactions={selectedDateTransactions}
          />
        </div>
      )}

      <div className="mt-2 hidden min-h-0 flex-1 grid-cols-[minmax(0,1fr)_300px] gap-6 md:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
        <div>
          <CalendarGrid
            currentDate={currentDate}
            dayAmounts={calendarDayAmounts}
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
          />
        </div>

        <aside className="min-h-80 rounded-[26px] glass-card px-5 py-5">
          <TransactionDateList
            onSelectTransaction={txForm.openEdit}
            selectedDate={selectedDate}
            transactions={selectedDateTransactions}
          />
        </aside>
      </div>

      <ResponsiveTransactionForm
        categories={txForm.activeCategories}
        expenseCategories={txForm.expenseCategories}
        incomeCategories={txForm.incomeCategories}
        initialAmount={txForm.editingTransaction?.amount}
        initialCategoryId={txForm.initialCategoryId}
        initialIsFixed={txForm.editingTransaction?.isFixed}
        initialMemo={txForm.editingTransaction?.memo}
        initialSatisfaction={txForm.editingTransaction?.satisfaction}
        isOpen={txForm.isOpen}
        mode={txForm.mode}
        onClose={txForm.close}
        onCreateCategory={addCategory}
        onDelete={txForm.handleDelete}
        onDeleteCategory={deleteCategory}
        onSave={txForm.handleSave}
        onUpdateCategory={updateCategory}
        selectedDate={selectedDate}
        type={txForm.type}
      />

      <FloatingAddButton
        onAddExpense={() => txForm.openCreate('expense')}
        onAddIncome={() => txForm.openCreate('income')}
      />
    </section>
  )
}
