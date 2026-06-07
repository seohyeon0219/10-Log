import { useState } from 'react'
import CalendarGrid from '../../components/calendar/CalendarGrid'
import MonthlyPromise from '../../components/calendar/MonthlyPromise'
import MonthlyPromiseModal from '../../components/calendar/MonthlyPromiseModal'
import TransactionDateList, {
  type TransactionDateListItem,
} from '../../components/transactions/TransactionDateList'
import TransactionFormModal from '../../components/transactions/TransactionFormModal'
import {
  getMockCalendarDayAmounts,
  getMockTransactions,
  mockExpenseCategories,
  mockIncomeCategories,
} from '../../mocks/data'
import { useCalendarStore } from '../../stores/calendarStore'
import { useStatisticsStore } from '../../stores/statisticsStore'

type TransactionType = 'income' | 'expense'
type TransactionFormMode = 'create' | 'edit'

const getDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function DesktopCalendarContainer() {
  const [isMonthlyPromiseOpen, setIsMonthlyPromiseOpen] = useState(false)
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<TransactionDateListItem | null>(null)
  const [transactionFormMode, setTransactionFormMode] = useState<TransactionFormMode>('create')
  const [transactionType, setTransactionType] = useState<TransactionType>('expense')
  const currentDate = useCalendarStore((state) => state.currentDate)
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

  const openTransactionForm = (type: TransactionType) => {
    setTransactionType(type)
    setTransactionFormMode('create')
    setEditingTransaction(null)
    if (!selectedDate) {
      setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
    }
    setIsTransactionFormOpen(true)
  }

  const openTransactionEditor = (transaction: TransactionDateListItem) => {
    if (transaction.type !== 'income' && transaction.type !== 'expense') {
      return
    }

    setTransactionType(transaction.type)
    setTransactionFormMode('edit')
    setEditingTransaction({ ...transaction, type: transaction.type })
    setIsTransactionFormOpen(true)
  }

  const activeCategories = transactionType === 'income' ? mockIncomeCategories : mockExpenseCategories
  const initialCategoryId = editingTransaction
    ? activeCategories.find((category) => category.name === editingTransaction.categoryName)?.id
    : undefined

  return (
    <>
      <div className="mt-5">
        <MonthlyPromise
          budgetAmount={monthlyPromise.budgetAmount}
          isRegistered={monthlyPromise.isRegistered}
          onEdit={() => setIsMonthlyPromiseOpen(true)}
          promise={monthlyPromise.promise}
        />
      </div>

      <div className="mt-2 grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_380px] gap-8">
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
            onAddExpense={() => openTransactionForm('expense')}
            onAddIncome={() => openTransactionForm('income')}
            onSelectTransaction={openTransactionEditor}
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
        isOpen={isTransactionFormOpen}
        mode={transactionFormMode}
        onClose={() => setIsTransactionFormOpen(false)}
        onDelete={() => setIsTransactionFormOpen(false)}
        onSave={() => setIsTransactionFormOpen(false)}
        selectedDate={selectedDate}
        type={transactionType}
      />
    </>
  )
}
