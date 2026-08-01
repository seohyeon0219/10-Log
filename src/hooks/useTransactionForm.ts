import { useState } from 'react'
import { useCalendarStore } from '../stores/calendarStore'
import type { TransactionFormValues, TransactionType } from '../types/finance'

export function useTransactionForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<TransactionType>('expense')
  const addTransaction = useCalendarStore((state) => state.addTransaction)

  const open = (newType: TransactionType) => {
    setType(newType)
    setIsOpen(true)
  }

  const close = () => setIsOpen(false)

  const handleSave = async (values: TransactionFormValues) => {
    await addTransaction(type, values)
    setIsOpen(false)
  }

  return { isOpen, type, open, close, handleSave }
}
