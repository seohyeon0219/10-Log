import { useEffect, useState } from 'react'
import CalendarGrid from '../components/calendar/CalendarGrid'
import CalendarMonthHeader from '../components/calendar/CalendarMonthHeader'
import CalendarMonthlySummary from '../components/calendar/CalendarMonthlySummary'
import TransactionDateList, {
  type TransactionDateListItem,
} from '../components/transactions/TransactionDateList'
import TransactionFormModal from '../components/transactions/TransactionFormModal'
import TransactionFormBottomSheet from '../components/transactions/bottomSheet/TransactionFormBottomSheet'
import { useCalendarStore } from '../stores/calendarStore'

type TransactionType = 'income' | 'expense'
type TransactionFormMode = 'create' | 'edit'

const getDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function CalendarContainer() {
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<TransactionDateListItem | null>(null)
  const [transactionFormMode, setTransactionFormMode] = useState<TransactionFormMode>('create')
  const [transactionType, setTransactionType] = useState<TransactionType>('expense')
  const calendarDayAmounts = useCalendarStore((state) => state.calendarDayAmounts)
  const currentDate = useCalendarStore((state) => state.currentDate)
  const addCategory = useCalendarStore((state) => state.addCategory)
  const addTransaction = useCalendarStore((state) => state.addTransaction)
  const deleteCategory = useCalendarStore((state) => state.deleteCategory)
  const deleteTransaction = useCalendarStore((state) => state.deleteTransaction)
  const error = useCalendarStore((state) => state.error)
  const expenseCategories = useCalendarStore((state) => state.expenseCategories)
  const incomeCategories = useCalendarStore((state) => state.incomeCategories)
  const isLoading = useCalendarStore((state) => state.isLoading)
  const goNextMonth = useCalendarStore((state) => state.goNextMonth)
  const goPrevMonth = useCalendarStore((state) => state.goPrevMonth)
  const loadMonth = useCalendarStore((state) => state.loadMonth)
  const monthlySummary = useCalendarStore((state) => state.monthlySummary)
  const selectedDate = useCalendarStore((state) => state.selectedDate)
  const selectDate = useCalendarStore((state) => state.selectDate)
  const setSelectedDate = useCalendarStore((state) => state.setSelectedDate)
  const transactions = useCalendarStore((state) => state.transactions)
  const updateCategory = useCalendarStore((state) => state.updateCategory)
  const updateTransaction = useCalendarStore((state) => state.updateTransaction)
  const selectedDateKey = selectedDate ? getDateKey(selectedDate) : ''
  const selectedDateTransactions = transactions.filter(
    (transaction) => transaction.date === selectedDateKey,
  )

  useEffect(() => {
    void loadMonth()
  }, [loadMonth])

  const prepareTransactionForm = (type: TransactionType, mode: TransactionFormMode, transaction?: TransactionDateListItem) => {
    setTransactionType(type)
    setTransactionFormMode(mode)
    setEditingTransaction(transaction ?? null)
    if (!selectedDate) {
      setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
    }
  }

  const openTransactionForm = (type: TransactionType) => {
    prepareTransactionForm(type, 'create')
    setIsTransactionFormOpen(true)
  }

  const openTransactionEditor = (transaction: TransactionDateListItem) => {
    if (transaction.type !== 'income' && transaction.type !== 'expense') {
      return
    }

    prepareTransactionForm(transaction.type, 'edit', { ...transaction, type: transaction.type })
    setIsTransactionFormOpen(true)
  }

  const activeCategories = transactionType === 'income' ? incomeCategories : expenseCategories
  const initialCategoryId = editingTransaction
    ? editingTransaction.categoryId ??
      activeCategories.find((category) => category.name === editingTransaction.categoryName)?.id
    : undefined

  const closeTransactionForm = () => {
    setIsTransactionFormOpen(false)
    setEditingTransaction(null)
  }

  const saveTransaction = async (values: Parameters<typeof addTransaction>[1]) => {
    if (transactionFormMode === 'edit' && editingTransaction) {
      await updateTransaction(editingTransaction.id, values)
    } else {
      await addTransaction(transactionType, values)
    }

    closeTransactionForm()
  }

  const removeTransaction = async () => {
    if (!editingTransaction) {
      closeTransactionForm()
      return
    }

    await deleteTransaction(editingTransaction.id)
    closeTransactionForm()
  }

  return (
    <section className="w-full self-start animate-fade-up">
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
        <div className="mb-4 rounded-xl border border-white/60 bg-(--color-glass-white) px-4 py-3 text-sm font-semibold text-gray-500 backdrop-blur-sm">
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
          onDateSelect={selectDate}
          selectedDate={selectedDate}
        />
      </div>

      {selectedDate && (
        <div
          className="mt-4 rounded-[22px] px-5 py-5 md:hidden"
          style={{
            background: 'rgba(255,255,255,0.45)',
            backdropFilter: 'blur(20px) saturate(170%)',
            WebkitBackdropFilter: 'blur(20px) saturate(170%)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 10px 30px rgba(120,95,40,0.10)',
          }}
        >
          <TransactionDateList
            onAddExpense={() => openTransactionForm('expense')}
            onAddIncome={() => openTransactionForm('income')}
            onSelectTransaction={openTransactionEditor}
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
            onDateSelect={selectDate}
            selectedDate={selectedDate}
          />
        </div>

        <aside
          className="mt-9 min-h-80 rounded-[22px] px-5 py-5"
          style={{
            background: 'rgba(255,255,255,0.45)',
            backdropFilter: 'blur(20px) saturate(170%)',
            WebkitBackdropFilter: 'blur(20px) saturate(170%)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 10px 30px rgba(120,95,40,0.10)',
          }}
        >
          <TransactionDateList
            onAddExpense={() => openTransactionForm('expense')}
            onAddIncome={() => openTransactionForm('income')}
            onSelectTransaction={openTransactionEditor}
            selectedDate={selectedDate}
            transactions={selectedDateTransactions}
          />
        </aside>
      </div>

      <div className="hidden md:block">
        <TransactionFormModal
          categories={activeCategories}
          expenseCategories={expenseCategories}
          incomeCategories={incomeCategories}
          initialAmount={editingTransaction?.amount}
          initialCategoryId={initialCategoryId}
          initialIsFixed={editingTransaction?.isFixed}
          initialMemo={editingTransaction?.memo}
          isOpen={isTransactionFormOpen}
          mode={transactionFormMode}
          onClose={closeTransactionForm}
          onCreateCategory={addCategory}
          onDelete={removeTransaction}
          onDeleteCategory={deleteCategory}
          onSave={saveTransaction}
          onUpdateCategory={updateCategory}
          selectedDate={selectedDate}
          type={transactionType}
        />
      </div>

      <div className="md:hidden">
        <TransactionFormBottomSheet
          categories={activeCategories}
          expenseCategories={expenseCategories}
          incomeCategories={incomeCategories}
          initialAmount={editingTransaction?.amount}
          initialCategoryId={initialCategoryId}
          initialIsFixed={editingTransaction?.isFixed}
          initialMemo={editingTransaction?.memo}
          isOpen={isTransactionFormOpen}
          mode={transactionFormMode}
          onClose={closeTransactionForm}
          onCreateCategory={addCategory}
          onDelete={removeTransaction}
          onDeleteCategory={deleteCategory}
          onSave={saveTransaction}
          onUpdateCategory={updateCategory}
          selectedDate={selectedDate}
          type={transactionType}
        />
      </div>
    </section>
  )
}
