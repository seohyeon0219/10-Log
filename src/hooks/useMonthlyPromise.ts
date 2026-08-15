import { useState } from 'react'
import { useCalendarStore } from '../stores/calendarStore'

export function useMonthlyPromise() {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const monthlyPromise = useCalendarStore((state) => state.monthlyPromise)
  const useIncomeAsBudget = useCalendarStore((state) => state.monthlyPromise.useIncomeAsBudget)
  const updateMonthlyPromise = useCalendarStore((state) => state.updateMonthlyPromise)
  const deleteMonthlyPromise = useCalendarStore((state) => state.deleteMonthlyPromise)
  const setUseIncomeAsBudget = useCalendarStore((state) => state.setUseIncomeAsBudget)

  const handleSave = async (values: { budgetAmount: number }) => {
    await updateMonthlyPromise(values)
    setIsEditOpen(false)
  }

  const handleDelete = async () => {
    await deleteMonthlyPromise()
    setIsEditOpen(false)
  }

  const handleUseIncomeBudget = async () => {
    await setUseIncomeAsBudget(true)
    setIsEditOpen(false)
  }

  const initialMode: 'income' | 'direct' = useIncomeAsBudget && !monthlyPromise.isRegistered ? 'income' : 'direct'

  return {
    isEditOpen,
    openEdit: () => setIsEditOpen(true),
    closeEdit: () => setIsEditOpen(false),
    handleSave,
    handleDelete,
    handleUseIncomeBudget,
    initialMode,
    budgetAmount: monthlyPromise.budgetAmount,
    isRegistered: monthlyPromise.isRegistered,
  }
}
