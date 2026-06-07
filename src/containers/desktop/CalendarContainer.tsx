import { useState } from 'react'
import CalendarDateActions from '../../components/calendar/CalendarDateActions'
import CalendarGrid from '../../components/calendar/CalendarGrid'
import ListItem from '../../components/common/ListItem'
import TransactionFormModal from '../../components/transactions/TransactionFormModal'
import {
  getMockCalendarDayAmounts,
  getMockTransactions,
  mockExpenseCategories,
  mockIncomeCategories,
} from '../../mocks/data'
import { useCalendarStore } from '../../stores/calendarStore'

type TransactionType = 'income' | 'expense'
type TransactionFormMode = 'create' | 'edit'
type EditableTransaction = {
  amount: number
  categoryName: string
  memo?: string
  type: string
}

const getDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function DesktopCalendarContainer() {
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<EditableTransaction | null>(null)
  const [transactionFormMode, setTransactionFormMode] = useState<TransactionFormMode>('create')
  const [transactionType, setTransactionType] = useState<TransactionType>('expense')
  const currentDate = useCalendarStore((state) => state.currentDate)
  const selectedDate = useCalendarStore((state) => state.selectedDate)
  const selectDate = useCalendarStore((state) => state.selectDate)
  const setSelectedDate = useCalendarStore((state) => state.setSelectedDate)
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

  const openTransactionEditor = (transaction: EditableTransaction) => {
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
      <div className="mt-2 grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_380px] gap-8">
        <div>
          <CalendarGrid
            currentDate={currentDate}
            dayAmounts={getMockCalendarDayAmounts(currentDate)}
            onDateSelect={selectDate}
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
                  onClick={() => openTransactionEditor(transaction)}
                  title={transaction.categoryName}
                  type={transaction.type}
                />
              ))}
            </div>
          ) : null}
        </div>
        <aside className="min-h-80 rounded-lg border border-gray-100 bg-white" />
      </div>

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
