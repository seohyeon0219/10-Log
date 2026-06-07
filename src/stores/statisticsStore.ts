import { create } from 'zustand'
import { DEFAULT_MONTHLY_PROMISE } from '../constants/budgetMessages'
import { mockMonthlyPromise } from '../mocks/data'

type MonthlyPromise = {
  budgetAmount: number
  isRegistered: boolean
  monthLabel: string
  promise: string
}

type TransactionType = 'income' | 'expense'

type StatisticsStore = {
  lineChartSelectedPointIndex: number | null
  lineChartType: TransactionType
  monthlyPromise: MonthlyPromise
  ratioSelectedCategoryId: string
  ratioType: TransactionType
  deleteMonthlyPromise: () => void
  setLineChartSelectedPointIndex: (index: number | null) => void
  setLineChartType: (type: TransactionType) => void
  setRatioSelectedCategoryId: (categoryId: string) => void
  setRatioType: (type: TransactionType) => void
  updateMonthlyPromise: (values: Pick<MonthlyPromise, 'budgetAmount' | 'promise'>) => void
}

export const useStatisticsStore = create<StatisticsStore>((set) => ({
  lineChartSelectedPointIndex: null,
  lineChartType: 'expense',
  monthlyPromise: mockMonthlyPromise,
  ratioSelectedCategoryId: 'food',
  ratioType: 'expense',
  deleteMonthlyPromise: () =>
    set((state) => ({
      monthlyPromise: {
        ...state.monthlyPromise,
        isRegistered: false,
        promise: DEFAULT_MONTHLY_PROMISE,
      },
    })),
  setLineChartSelectedPointIndex: (index) => set({ lineChartSelectedPointIndex: index }),
  setLineChartType: (type) =>
    set({
      lineChartSelectedPointIndex: null,
      lineChartType: type,
    }),
  setRatioSelectedCategoryId: (categoryId) => set({ ratioSelectedCategoryId: categoryId }),
  setRatioType: (type) =>
    set({
      ratioSelectedCategoryId: '',
      ratioType: type,
    }),
  updateMonthlyPromise: (values) =>
    set((state) => ({
      monthlyPromise: {
        ...state.monthlyPromise,
        isRegistered: true,
        ...values,
      },
    })),
}))
