import { useState } from 'react'
import CalendarGrid from '../components/calendar/CalendarGrid'
import CalendarMonthHeader from '../components/calendar/CalendarMonthHeader'
import CalendarMonthlySummary from '../components/calendar/CalendarMonthlySummary'
import MonthlyPromise from '../components/calendar/MonthlyPromise'
import MonthlyPromiseBottomSheet from '../components/calendar/MonthlyPromiseBottomSheet'
import MonthlyPromiseModal from '../components/calendar/MonthlyPromiseModal'
import TransactionDateList, {
  type TransactionDateListItem,
} from '../components/transactions/TransactionDateList'
import TransactionFormModal from '../components/transactions/TransactionFormModal'
import TransactionFormBottomSheet from '../components/transactions/bottomSheet/TransactionFormBottomSheet'
import TransactionListBottomSheet from '../components/transactions/bottomSheet/TransactionListBottomSheet'
import { useCalendarStore } from '../stores/calendarStore'
import { useStatisticsStore } from '../stores/statisticsStore'

type TransactionType = 'income' | 'expense'
type TransactionFormMode = 'create' | 'edit'

const getDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function CalendarContainer() {
  const [isMonthlyPromiseModalOpen, setIsMonthlyPromiseModalOpen] = useState(false)
  const [isMonthlyPromiseBottomSheetOpen, setIsMonthlyPromiseBottomSheetOpen] = useState(false)
  const [isTransactionFormModalOpen, setIsTransactionFormModalOpen] = useState(false)
  const [isTransactionFormBottomSheetOpen, setIsTransactionFormBottomSheetOpen] = useState(false)
  const [isTransactionListBottomSheetOpen, setIsTransactionListBottomSheetOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<TransactionDateListItem | null>(null)
  const [transactionFormMode, setTransactionFormMode] = useState<TransactionFormMode>('create')
  const [transactionType, setTransactionType] = useState<TransactionType>('expense')
  const calendarDayAmounts = useCalendarStore((state) => state.calendarDayAmounts)
  const currentDate = useCalendarStore((state) => state.currentDate)
  const expenseCategories = useCalendarStore((state) => state.expenseCategories)
  const goNextMonth = useCalendarStore((state) => state.goNextMonth)
  const goPrevMonth = useCalendarStore((state) => state.goPrevMonth)
  const incomeCategories = useCalendarStore((state) => state.incomeCategories)
  const monthlySummary = useCalendarStore((state) => state.monthlySummary)
  const selectedDate = useCalendarStore((state) => state.selectedDate)
  const selectDate = useCalendarStore((state) => state.selectDate)
  const setSelectedDate = useCalendarStore((state) => state.setSelectedDate)
  const transactions = useCalendarStore((state) => state.transactions)
  const deleteMonthlyPromise = useStatisticsStore((state) => state.deleteMonthlyPromise)
  const monthlyPromise = useStatisticsStore((state) => state.monthlyPromise)
  const updateMonthlyPromise = useStatisticsStore((state) => state.updateMonthlyPromise)
  const selectedDateKey = selectedDate ? getDateKey(selectedDate) : ''
  const selectedDateTransactions = transactions.filter(
    (transaction) => transaction.date === selectedDateKey,
  )

  const prepareTransactionForm = (type: TransactionType, mode: TransactionFormMode, transaction?: TransactionDateListItem) => {
    setTransactionType(type)
    setTransactionFormMode(mode)
    setEditingTransaction(transaction ?? null)
    if (!selectedDate) {
      setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
    }
  }

  const openTransactionFormModal = (type: TransactionType) => {
    prepareTransactionForm(type, 'create')
    setIsTransactionFormModalOpen(true)
  }

  const openTransactionFormBottomSheet = (type: TransactionType) => {
    prepareTransactionForm(type, 'create')
    setIsTransactionFormBottomSheetOpen(true)
  }

  const openTransactionEditor = (transaction: TransactionDateListItem, surface: 'bottomSheet' | 'modal') => {
    if (transaction.type !== 'income' && transaction.type !== 'expense') {
      return
    }

    prepareTransactionForm(transaction.type, 'edit', { ...transaction, type: transaction.type })
    if (surface === 'bottomSheet') {
      setIsTransactionListBottomSheetOpen(false)
      setIsTransactionFormBottomSheetOpen(true)
      return
    }

    setIsTransactionFormModalOpen(true)
  }

  const selectMobileDate = (date: Date) => {
    selectDate(date)
    setIsTransactionListBottomSheetOpen(true)
  }

  const activeCategories = transactionType === 'income' ? incomeCategories : expenseCategories
  const initialCategoryId = editingTransaction
    ? activeCategories.find((category) => category.name === editingTransaction.categoryName)?.id
    : undefined

  return (
    <section className="w-full self-start">
      <div className="md:hidden">
        <CalendarMonthHeader
          currentDate={currentDate}
          onNextMonth={goNextMonth}
          onPrevMonth={goPrevMonth}
        />
        <CalendarMonthlySummary {...monthlySummary} />
      </div>

      <div className="md:hidden">
        <MonthlyPromise
          budgetAmount={monthlyPromise.budgetAmount}
          isRegistered={monthlyPromise.isRegistered}
          onEdit={() => setIsMonthlyPromiseBottomSheetOpen(true)}
          promise={monthlyPromise.promise}
        />
      </div>

      <div className="hidden md:mt-5 md:block">
        <MonthlyPromise
          budgetAmount={monthlyPromise.budgetAmount}
          isRegistered={monthlyPromise.isRegistered}
          onEdit={() => setIsMonthlyPromiseModalOpen(true)}
          promise={monthlyPromise.promise}
        />
      </div>

      <div className="mt-4 md:hidden">
        <CalendarGrid
          currentDate={currentDate}
          dayAmounts={calendarDayAmounts}
          onDateSelect={selectMobileDate}
          selectedDate={selectedDate}
        />
      </div>

      <div className="mt-2 hidden min-h-0 flex-1 grid-cols-[minmax(0,1fr)_380px] gap-8 md:grid">
        <div>
          <CalendarGrid
            currentDate={currentDate}
            dayAmounts={calendarDayAmounts}
            onDateSelect={selectDate}
            selectedDate={selectedDate}
          />
        </div>

        <aside className="mt-9 min-h-80 rounded-xl border border-gray-100 bg-white px-4 py-4">
          <TransactionDateList
            onAddExpense={() => openTransactionFormModal('expense')}
            onAddIncome={() => openTransactionFormModal('income')}
            onSelectTransaction={(transaction) => openTransactionEditor(transaction, 'modal')}
            selectedDate={selectedDate}
            transactions={selectedDateTransactions}
          />
        </aside>
      </div>

      {isMonthlyPromiseModalOpen ? (
        <MonthlyPromiseModal
          budgetAmount={monthlyPromise.budgetAmount}
          isRegistered={monthlyPromise.isRegistered}
          isOpen={isMonthlyPromiseModalOpen}
          onClose={() => setIsMonthlyPromiseModalOpen(false)}
          onDelete={deleteMonthlyPromise}
          onSave={(values) => {
            updateMonthlyPromise(values)
            setIsMonthlyPromiseModalOpen(false)
          }}
          promise={monthlyPromise.promise}
        />
      ) : null}

      <MonthlyPromiseBottomSheet
        budgetAmount={monthlyPromise.budgetAmount}
        isRegistered={monthlyPromise.isRegistered}
        isOpen={isMonthlyPromiseBottomSheetOpen}
        onClose={() => setIsMonthlyPromiseBottomSheetOpen(false)}
        onDelete={deleteMonthlyPromise}
        onSave={(values) => {
          updateMonthlyPromise(values)
          setIsMonthlyPromiseBottomSheetOpen(false)
        }}
        promise={monthlyPromise.promise}
      />

      <TransactionFormModal
        categories={activeCategories}
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
        initialAmount={editingTransaction?.amount}
        initialCategoryId={initialCategoryId}
        initialMemo={editingTransaction?.memo}
        isOpen={isTransactionFormModalOpen}
        mode={transactionFormMode}
        onClose={() => setIsTransactionFormModalOpen(false)}
        onDelete={() => setIsTransactionFormModalOpen(false)}
        onSave={() => setIsTransactionFormModalOpen(false)}
        selectedDate={selectedDate}
        type={transactionType}
      />

      <TransactionListBottomSheet
        isOpen={isTransactionListBottomSheetOpen}
        onAddExpense={() => openTransactionFormBottomSheet('expense')}
        onAddIncome={() => openTransactionFormBottomSheet('income')}
        onClose={() => setIsTransactionListBottomSheetOpen(false)}
        onSelectTransaction={(transaction) => openTransactionEditor(transaction, 'bottomSheet')}
        selectedDate={selectedDate}
        transactions={selectedDateTransactions}
      />

      <TransactionFormBottomSheet
        categories={activeCategories}
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
        initialAmount={editingTransaction?.amount}
        initialCategoryId={initialCategoryId}
        initialMemo={editingTransaction?.memo}
        isOpen={isTransactionFormBottomSheetOpen}
        mode={transactionFormMode}
        onClose={() => setIsTransactionFormBottomSheetOpen(false)}
        onDelete={() => setIsTransactionFormBottomSheetOpen(false)}
        onSave={() => setIsTransactionFormBottomSheetOpen(false)}
        selectedDate={selectedDate}
        type={transactionType}
      />
    </section>
  )
}
