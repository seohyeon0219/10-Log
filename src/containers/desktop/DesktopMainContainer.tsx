import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CalendarDateActions from '../../components/calendar/CalendarDateActions'
import CalendarGrid from '../../components/calendar/CalendarGrid'
import ListItem from '../../components/common/ListItem'
import TransactionFormModal from '../../components/transactions/TransactionFormModal'
import DesktopLayout from '../../layouts/DesktopLayout'
import {
  getMockCalendarDayAmounts,
  getMockTransactions,
  mockExpenseCategories,
  mockIncomeCategories,
} from '../../mocks/data'
import { useCalendarStore } from '../../stores/calendarStore'
import { useNavigationStore } from '../../stores/navigationStore'

type TransactionType = 'income' | 'expense'

const getDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function DesktopMainContainer() {
  const navigate = useNavigate()
  const { tabId } = useParams()
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false)
  const [transactionType, setTransactionType] = useState<TransactionType>('expense')
  const currentDate = useCalendarStore((state) => state.currentDate)
  const selectedDate = useCalendarStore((state) => state.selectedDate)
  const selectDate = useCalendarStore((state) => state.selectDate)
  const setSelectedDate = useCalendarStore((state) => state.setSelectedDate)
  const navTabs = useNavigationStore((state) => state.tabs)
  const activeTabId = tabId && navTabs.some((tab) => tab.id === tabId) ? tabId : navTabs[0].id
  const isCalendarTab = activeTabId === 'calendar'
  const selectedDateKey = selectedDate ? getDateKey(selectedDate) : ''
  const selectedDateTransactions = getMockTransactions(currentDate).filter(
    (transaction) => transaction.date === selectedDateKey,
  )

  useEffect(() => {
    if (!tabId || navTabs.some((tab) => tab.id === tabId)) {
      return
    }

    navigate('/app/calendar', { replace: true })
  }, [navigate, navTabs, tabId])

  const openTransactionForm = (type: TransactionType) => {
    setTransactionType(type)
    if (!selectedDate) {
      setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
    }
    setIsTransactionFormOpen(true)
  }

  const handleDateSelect = (date: Date) => {
    selectDate(date)
  }

  const activeTabLabel = navTabs.find((tab) => tab.id === activeTabId)?.label ?? ''

  return (
    <DesktopLayout>
      {isCalendarTab ? (
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
        </div>
      ) : null}

      {activeTabId !== 'calendar' ? (
        <section className="mt-6 min-h-80">
          <h2 className="m-0 text-xl font-bold text-black">{activeTabLabel}</h2>
        </section>
      ) : null}

      <TransactionFormModal
        categories={transactionType === 'income' ? mockIncomeCategories : mockExpenseCategories}
        isOpen={isTransactionFormOpen}
        onClose={() => setIsTransactionFormOpen(false)}
        onDelete={() => setIsTransactionFormOpen(false)}
        onSave={() => setIsTransactionFormOpen(false)}
        selectedDate={selectedDate}
        type={transactionType}
      />
    </DesktopLayout>
  )
}
