import { useState } from 'react'
import CalendarGrid from '../components/calendar/CalendarGrid'
import CalendarMonthHeader from '../components/calendar/CalendarMonthHeader'
import CalendarMonthlySummary from '../components/calendar/CalendarMonthlySummary'
import MonthlyPromise from '../components/calendar/MonthlyPromise'
import MonthlyPromiseModal from '../components/calendar/MonthlyPromiseModal'
import TransactionDateList, {
  type TransactionDateListItem,
} from '../components/transactions/TransactionDateList'
import TransactionDateActions from '../components/transactions/TransactionDateActions'
import TransactionFormModal from '../components/transactions/TransactionFormModal'
import TransactionFormBottomSheet from '../components/transactions/bottomSheet/TransactionFormBottomSheet'
import TransactionListBottomSheet from '../components/transactions/bottomSheet/TransactionListBottomSheet'
import {
  getMockCalendarDayAmounts,
  getMockTransactions,
  mockExpenseCategories,
  mockIncomeCategories,
} from '../mocks/data'
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
  const [isMonthlyPromiseOpen, setIsMonthlyPromiseOpen] = useState(false)
  const [isTransactionFormModalOpen, setIsTransactionFormModalOpen] = useState(false)
  const [isTransactionFormBottomSheetOpen, setIsTransactionFormBottomSheetOpen] = useState(false)
  const [isTransactionListBottomSheetOpen, setIsTransactionListBottomSheetOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<TransactionDateListItem | null>(null)
  const [transactionFormMode, setTransactionFormMode] = useState<TransactionFormMode>('create')
  const [transactionType, setTransactionType] = useState<TransactionType>('expense')
  const currentDate = useCalendarStore((state) => state.currentDate)
  const goNextMonth = useCalendarStore((state) => state.goNextMonth)
  const goPrevMonth = useCalendarStore((state) => state.goPrevMonth)
  const monthlySummary = useCalendarStore((state) => state.monthlySummary)
  const selectedDate = useCalendarStore((state) => state.selectedDate)
  const selectDate = useCalendarStore((state) => state.selectDate)
  const setSelectedDate = useCalendarStore((state) => state.setSelectedDate)
  const deleteMonthlyPromise = useStatisticsStore((state) => state.deleteMonthlyPromise)
  const monthlyPromise = useStatisticsStore((state) => state.monthlyPromise)
  const updateMonthlyPromise = useStatisticsStore((state) => state.updateMonthlyPromise)
  const selectedDateKey = selectedDate ? getDateKey(selectedDate) : ''
  const selectedDateTransactions = getMockTransactions(currentDate).filter(
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

  const activeCategories = transactionType === 'income' ? mockIncomeCategories : mockExpenseCategories
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

      <div className="md:mt-5">
        <MonthlyPromise
          budgetAmount={monthlyPromise.budgetAmount}
          isRegistered={monthlyPromise.isRegistered}
          onEdit={() => setIsMonthlyPromiseOpen(true)}
          promise={monthlyPromise.promise}
        />
      </div>

      <div className="mt-4 md:hidden">
        <CalendarGrid
          currentDate={currentDate}
          dayAmounts={getMockCalendarDayAmounts(currentDate)}
          onDateSelect={selectMobileDate}
          selectedDate={selectedDate}
        />
        <div className="mt-3">
          <TransactionDateActions
            onAddExpense={() => openTransactionFormBottomSheet('expense')}
            onAddIncome={() => openTransactionFormBottomSheet('income')}
            selectedDate={selectedDate}
          />
        </div>
      </div>

      <div className="mt-2 hidden min-h-0 flex-1 grid-cols-[minmax(0,1fr)_380px] gap-8 md:grid">
        <div>
          <CalendarGrid
            currentDate={currentDate}
            dayAmounts={getMockCalendarDayAmounts(currentDate)}
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

      {isMonthlyPromiseOpen ? (
        <MonthlyPromiseModal
          budgetAmount={monthlyPromise.budgetAmount}
          isRegistered={monthlyPromise.isRegistered}
          isOpen={isMonthlyPromiseOpen}
          onClose={() => setIsMonthlyPromiseOpen(false)}
          onDelete={deleteMonthlyPromise}
          onSave={(values) => {
            updateMonthlyPromise(values)
            setIsMonthlyPromiseOpen(false)
          }}
          promise={monthlyPromise.promise}
        />
      ) : null}

      <TransactionFormModal
        categories={activeCategories}
        expenseCategories={mockExpenseCategories}
        incomeCategories={mockIncomeCategories}
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
        expenseCategories={mockExpenseCategories}
        incomeCategories={mockIncomeCategories}
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
