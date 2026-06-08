import { create } from 'zustand'
import {
  getMockCalendarDayAmounts,
  getMockTransactions,
  mockExpenseCategories,
  mockIncomeCategories,
  mockMonthlySummary,
} from '../mocks/data'

type MonthlySummary = {
  expense: number
  fixedExpense: number
  fixedIncome: number
  income: number
}

type Category = {
  color: string
  id: string
  name: string
}

type Transaction = {
  amount: number
  categoryColor: string
  categoryName: string
  date: string
  day: number
  id: string
  memo: string
  type: 'expense' | 'income'
}

type CalendarDayAmount = {
  date: string
  expense?: number
  income?: number
}

type CalendarStore = {
  calendarDayAmounts: CalendarDayAmount[]
  clearSelectedDate: () => void
  currentDate: Date
  expenseCategories: Category[]
  goNextMonth: () => void
  goPrevMonth: () => void
  incomeCategories: Category[]
  monthlySummary: MonthlySummary
  selectedDate: Date | null
  selectDate: (date: Date) => void
  setSelectedDate: (date: Date | null) => void
  transactions: Transaction[]
}

const getDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const initialDate = new Date()

export const useCalendarStore = create<CalendarStore>((set) => ({
  calendarDayAmounts: getMockCalendarDayAmounts(initialDate),
  clearSelectedDate: () => set({ selectedDate: null }),
  currentDate: initialDate,
  expenseCategories: mockExpenseCategories,
  goNextMonth: () =>
    set((state) => {
      const newDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() + 1, 1)
      return {
        calendarDayAmounts: getMockCalendarDayAmounts(newDate),
        currentDate: newDate,
        selectedDate: null,
        transactions: getMockTransactions(newDate),
      }
    }),
  goPrevMonth: () =>
    set((state) => {
      const newDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() - 1, 1)
      return {
        calendarDayAmounts: getMockCalendarDayAmounts(newDate),
        currentDate: newDate,
        selectedDate: null,
        transactions: getMockTransactions(newDate),
      }
    }),
  incomeCategories: mockIncomeCategories,
  monthlySummary: mockMonthlySummary,
  selectedDate: null,
  selectDate: (date) =>
    set((state) => {
      if (state.selectedDate && getDateKey(state.selectedDate) === getDateKey(date)) {
        return { selectedDate: null }
      }

      return { selectedDate: date }
    }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  transactions: getMockTransactions(initialDate),
}))
