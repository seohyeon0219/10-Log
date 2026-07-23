import { create } from 'zustand'
import {
  createCategory,
  createTransaction,
  deleteCategory,
  deleteMonthlyPromise,
  deleteTransaction,
  ensureDefaultCategories,
  getCalendarDayAmounts,
  getCategories,
  getMonthlyPromise,
  getMonthlySummary,
  getMonthlyTransactions,
  upsertMonthlyPromise,
  updateCategory,
  updateTransaction,
} from '../lib/financeApi'
import { DEFAULT_MONTHLY_PROMISE } from '../constants/budgetMessages'
import type {
  CalendarDayAmount,
  Category,
  MonthlyPromise,
  MonthlyPromiseValues,
  MonthlySummary,
  Transaction,
  TransactionFormValues,
  TransactionType,
} from '../types/finance'

type CalendarStore = {
  addCategory: (values: Pick<Category, 'color' | 'name' | 'type'>) => Promise<void>
  addTransaction: (type: TransactionType, values: TransactionFormValues) => Promise<void>
  calendarDayAmounts: CalendarDayAmount[]
  clearSelectedDate: () => void
  currentDate: Date
  deleteCategory: (categoryId: string) => Promise<void>
  deleteMonthlyPromise: () => Promise<void>
  deleteTransaction: (transactionId: string) => Promise<void>
  error: string | null
  expenseCategories: Category[]
  goNextMonth: () => void
  goPrevMonth: () => void
  incomeCategories: Category[]
  isLoading: boolean
  loadMonth: (date?: Date) => Promise<void>
  monthlyPromise: MonthlyPromise
  monthlySummary: MonthlySummary
  selectedDate: Date | null
  selectDate: (date: Date) => void
  setSelectedDate: (date: Date | null) => void
  transactions: Transaction[]
  updateCategory: (categoryId: string, values: Pick<Category, 'color' | 'name'>) => Promise<void>
  updateMonthlyPromise: (values: MonthlyPromiseValues) => Promise<void>
  updateTransaction: (transactionId: string, values: TransactionFormValues) => Promise<void>
}

const getDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

let defaultCategoriesEnsured = false

const initialDate = new Date()
const emptyMonthlySummary = {
  expense: 0,
  fixedExpense: 0,
  fixedIncome: 0,
  income: 0,
}
const emptyMonthlyPromise = {
  budgetAmount: 0,
  isRegistered: false,
  monthLabel: '이번 달',
  promise: DEFAULT_MONTHLY_PROMISE,
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  addCategory: async (values) => {
    await createCategory(values)
    await get().loadMonth()
  },
  addTransaction: async (type, values) => {
    await createTransaction(type, values)
    await get().loadMonth()
  },
  calendarDayAmounts: [],
  clearSelectedDate: () => set({ selectedDate: null }),
  currentDate: initialDate,
  deleteCategory: async (categoryId) => {
    await deleteCategory(categoryId)
    await get().loadMonth()
  },
  deleteMonthlyPromise: async () => {
    await deleteMonthlyPromise(get().currentDate)
    await get().loadMonth()
  },
  deleteTransaction: async (transactionId) => {
    await deleteTransaction(transactionId)
    await get().loadMonth()
  },
  error: null,
  expenseCategories: [],
  goNextMonth: () =>
    set((state) => {
      const newDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() + 1, 1)
      void get().loadMonth(newDate)

      return {
        currentDate: newDate,
        selectedDate: null,
      }
    }),
  goPrevMonth: () =>
    set((state) => {
      const newDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() - 1, 1)
      void get().loadMonth(newDate)

      return {
        currentDate: newDate,
        selectedDate: null,
      }
    }),
  incomeCategories: [],
  isLoading: false,
  loadMonth: async (date) => {
    const targetDate = date ?? get().currentDate

    set({ error: null, isLoading: true })

    try {
      if (!defaultCategoriesEnsured) {
        await ensureDefaultCategories()
        defaultCategoriesEnsured = true
      }

      const [categories, transactions, monthlyPromise] = await Promise.all([
        getCategories(),
        getMonthlyTransactions(targetDate),
        getMonthlyPromise(targetDate, DEFAULT_MONTHLY_PROMISE),
      ])

      set({
        calendarDayAmounts: getCalendarDayAmounts(transactions),
        currentDate: targetDate,
        expenseCategories: categories.filter((category) => category.type === 'expense'),
        incomeCategories: categories.filter((category) => category.type === 'income'),
        isLoading: false,
        monthlyPromise,
        monthlySummary: getMonthlySummary(transactions),
        transactions,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Supabase 데이터를 불러오지 못했어요.'

      set({
        error: message,
        isLoading: false,
      })
    }
  },
  monthlyPromise: emptyMonthlyPromise,
  monthlySummary: emptyMonthlySummary,
  selectedDate: null,
  selectDate: (date) =>
    set((state) => {
      if (state.selectedDate && getDateKey(state.selectedDate) === getDateKey(date)) {
        return { selectedDate: null }
      }

      return { selectedDate: date }
    }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  transactions: [],
  updateCategory: async (categoryId, values) => {
    await updateCategory(categoryId, values)
    await get().loadMonth()
  },
  updateMonthlyPromise: async (values) => {
    await upsertMonthlyPromise(get().currentDate, values)
    await get().loadMonth()
  },
  updateTransaction: async (transactionId, values) => {
    await updateTransaction(transactionId, values)
    await get().loadMonth(new Date(`${values.date}T00:00:00`))
  },
}))
