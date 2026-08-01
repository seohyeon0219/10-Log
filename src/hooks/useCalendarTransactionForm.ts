import { useState } from 'react'
import { useCalendarStore } from '../stores/calendarStore'
import type { TransactionType } from '../types/finance'
import type { TransactionFormMode } from '../components/transactions/transactionFormConfig'
import type { TransactionDateListItem } from '../components/transactions/TransactionDateList'

export function useCalendarTransactionForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<TransactionDateListItem | null>(null)
  const [mode, setMode] = useState<TransactionFormMode>('create')
  const [type, setType] = useState<TransactionType>('expense')

  const addTransaction = useCalendarStore((state) => state.addTransaction)
  const deleteTransaction = useCalendarStore((state) => state.deleteTransaction)
  const expenseCategories = useCalendarStore((state) => state.expenseCategories)
  const incomeCategories = useCalendarStore((state) => state.incomeCategories)
  const currentDate = useCalendarStore((state) => state.currentDate)
  const selectedDate = useCalendarStore((state) => state.selectedDate)
  const setSelectedDate = useCalendarStore((state) => state.setSelectedDate)
  const updateTransaction = useCalendarStore((state) => state.updateTransaction)

  const activeCategories = type === 'income' ? incomeCategories : expenseCategories

  const initialCategoryId = editingTransaction
    ? editingTransaction.categoryId ??
      activeCategories.find((cat) => cat.name === editingTransaction.categoryName)?.id
    : undefined

  const prepare = (newType: TransactionType, newMode: TransactionFormMode, transaction?: TransactionDateListItem) => {
    setType(newType)
    setMode(newMode)
    setEditingTransaction(transaction ?? null)
    if (!selectedDate) {
      setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
    }
  }

  const openCreate = (newType: TransactionType) => {
    prepare(newType, 'create')
    setIsOpen(true)
  }

  const openEdit = (transaction: TransactionDateListItem) => {
    if (transaction.type !== 'income' && transaction.type !== 'expense') return
    prepare(transaction.type, 'edit', { ...transaction, type: transaction.type })
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
    setEditingTransaction(null)
  }

  const handleSave = async (values: Parameters<typeof addTransaction>[1]) => {
    if (mode === 'edit' && editingTransaction) {
      await updateTransaction(editingTransaction.id, values)
    } else {
      await addTransaction(type, values)
    }
    close()
  }

  const handleDelete = async () => {
    if (!editingTransaction) {
      close()
      return
    }
    await deleteTransaction(editingTransaction.id)
    close()
  }

  return {
    activeCategories,
    close,
    editingTransaction,
    expenseCategories,
    handleDelete,
    handleSave,
    incomeCategories,
    initialCategoryId,
    isOpen,
    mode,
    openCreate,
    openEdit,
    type,
  }
}
