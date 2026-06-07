import { create } from 'zustand'
import { mockMonthlySummary } from '../mocks/data'

type MonthlySummary = {
  expense: number
  fixedExpense: number
  fixedIncome: number
  income: number
}

type CalendarStore = {
  clearSelectedDate: () => void
  currentDate: Date
  goNextMonth: () => void
  goPrevMonth: () => void
  monthlySummary: MonthlySummary
  selectedDate: Date | null
  selectDate: (date: Date) => void
  setSelectedDate: (date: Date | null) => void
}

const getDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  clearSelectedDate: () => set({ selectedDate: null }),
  currentDate: new Date(),
  goNextMonth: () =>
    set((state) => ({
      currentDate: new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() + 1, 1),
      selectedDate: null,
    })),
  goPrevMonth: () =>
    set((state) => ({
      currentDate: new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() - 1, 1),
      selectedDate: null,
    })),
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
}))
