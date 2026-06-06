import { useState } from 'react'
import CalendarDateActions from '../../components/calendar/CalendarDateActions'
import CalendarGrid from '../../components/calendar/CalendarGrid'
import CalendarMonthHeader from '../../components/calendar/CalendarMonthHeader'
import CalendarMonthlySummary from '../../components/calendar/CalendarMonthlySummary'
import ListItem from '../../components/common/ListItem'
import DesktopSidePanel from '../../components/sidePanel/DesktopSidePanel'
import TransactionFormModal from '../../components/transactions/TransactionFormModal'
import {
  getMockCalendarDayAmounts,
  getMockTransactions,
  mockExpenseCategories,
  mockIncomeCategories,
  mockMonthlySummary,
} from '../../mocks/data'

type TransactionType = 'income' | 'expense'

const getDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function DesktopMainContainer() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [transactionType, setTransactionType] = useState<TransactionType>('expense')
  const selectedDateKey = selectedDate ? getDateKey(selectedDate) : ''
  const selectedDateTransactions = getMockTransactions(currentDate).filter(
    (transaction) => transaction.date === selectedDateKey,
  )

  const openTransactionForm = (type: TransactionType) => {
    setTransactionType(type)
    setSelectedDate((date) => date ?? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
    setIsTransactionFormOpen(true)
  }

  const handleDateSelect = (date: Date) => {
    const dateKey = getDateKey(date)

    setSelectedDate((currentSelectedDate) => {
      if (currentSelectedDate && getDateKey(currentSelectedDate) === dateKey) {
        return null
      }

      return date
    })
  }

  const handlePrevMonth = () => {
    setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1))
    setSelectedDate(null)
  }

  const handleNextMonth = () => {
    setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))
    setSelectedDate(null)
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-360 flex-col px-4 py-6 md:px-6">
      <CalendarMonthHeader
        currentDate={currentDate}
        onNextMonth={handleNextMonth}
        onPrevMonth={handlePrevMonth}
      />

      <CalendarMonthlySummary {...mockMonthlySummary} />

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_380px] gap-8 mt-2">
        <div>
          <CalendarGrid
            currentDate={currentDate}
            dayAmounts={getMockCalendarDayAmounts(currentDate)}
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
          />
          <CalendarDateActions
            onAddExpense={() => openTransactionForm('expense')}
            onAddIncome={() => openTransactionForm('income')}
            selectedDate={selectedDate}
          />
          {selectedDate ? (
            <div className="mt-3 grid gap-1 border-t border-gray-100 pt-2">
              {selectedDateTransactions.map((transaction) => (
                <ListItem
                  amount={transaction.amount}
                  color={transaction.categoryColor}
                  key={transaction.id}
                  memo={transaction.memo}
                  title={transaction.categoryName}
                  type={transaction.type}
                />
              ))}
            </div>
          ) : null}
        </div>

        <DesktopSidePanel />
      </div>

      <TransactionFormModal
        categories={transactionType === 'income' ? mockIncomeCategories : mockExpenseCategories}
        isOpen={isTransactionFormOpen}
        onClose={() => setIsTransactionFormOpen(false)}
        onDelete={() => setIsTransactionFormOpen(false)}
        onSave={() => setIsTransactionFormOpen(false)}
        selectedDate={selectedDate}
        type={transactionType}
      />
    </main>
  )
}
