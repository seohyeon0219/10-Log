import { create } from 'zustand'
import { DEFAULT_MONTHLY_PROMISE } from '../constants/budgetMessages'
import {
  mockCategoryChangeRanking,
  mockCategoryTransactionRatio,
  mockMonthlyMoneySummary,
  mockMonthlyPromise,
  mockPreviousMonthComparison,
  mockSpendingTransactionLineChart,
} from '../mocks/data'

type MonthlyPromise = {
  budgetAmount: number
  isRegistered: boolean
  monthLabel: string
  promise: string
}

type MonthlyMoneySummary = {
  budgetAmount: number
  remainingDays: number
  spentAmount: number
}

type PreviousMonthComparisonDetail = {
  isEmphasized?: boolean
  label: string
  value: number
}

type PreviousMonthComparisonItem = {
  details: PreviousMonthComparisonDetail[]
  id: string
  label: string
  rate: number
}

type CategoryChangeRankingItem = {
  id: string
  label: string
  rate: number
}

type CategoryChangeRanking = {
  expense: CategoryChangeRankingItem[]
  income: CategoryChangeRankingItem[]
}

type CategoryTransaction = {
  amount: number
  date: string
  id: string
  memo: string
}

type CategoryTransactionRatioItem = {
  amount: number
  color: string
  id: string
  label: string
  transactions: CategoryTransaction[]
}

type CategoryTransactionRatio = {
  expense: CategoryTransactionRatioItem[]
  income: CategoryTransactionRatioItem[]
}

type LineChartPoint = {
  amount: number
  month: string
}

type SpendingTransactionLineChart = {
  expense: LineChartPoint[]
  income: LineChartPoint[]
}

type TransactionType = 'income' | 'expense'

type StatisticsStore = {
  categoryChangeRanking: CategoryChangeRanking
  categoryTransactionRatio: CategoryTransactionRatio
  lineChartSelectedPointIndex: number | null
  lineChartType: TransactionType
  monthlyMoneySummary: MonthlyMoneySummary
  monthlyPromise: MonthlyPromise
  previousMonthComparison: PreviousMonthComparisonItem[]
  ratioSelectedCategoryId: string
  ratioType: TransactionType
  spendingTransactionLineChart: SpendingTransactionLineChart
  deleteMonthlyPromise: () => void
  setLineChartSelectedPointIndex: (index: number | null) => void
  setLineChartType: (type: TransactionType) => void
  setRatioSelectedCategoryId: (categoryId: string) => void
  setRatioType: (type: TransactionType) => void
  updateMonthlyPromise: (values: Pick<MonthlyPromise, 'budgetAmount' | 'promise'>) => void
}

export const useStatisticsStore = create<StatisticsStore>((set) => ({
  categoryChangeRanking: mockCategoryChangeRanking,
  categoryTransactionRatio: mockCategoryTransactionRatio,
  lineChartSelectedPointIndex: null,
  lineChartType: 'expense',
  monthlyMoneySummary: mockMonthlyMoneySummary,
  monthlyPromise: mockMonthlyPromise,
  previousMonthComparison: mockPreviousMonthComparison,
  ratioSelectedCategoryId: 'food',
  ratioType: 'expense',
  spendingTransactionLineChart: mockSpendingTransactionLineChart,
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
