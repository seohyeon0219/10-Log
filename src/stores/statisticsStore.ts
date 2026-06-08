import { create } from 'zustand'

type TransactionType = 'income' | 'expense'

type StatisticsStore = {
  lineChartSelectedPointIndex: number | null
  lineChartType: TransactionType
  ratioSelectedCategoryId: string
  ratioType: TransactionType
  setLineChartSelectedPointIndex: (index: number | null) => void
  setLineChartType: (type: TransactionType) => void
  setRatioSelectedCategoryId: (categoryId: string) => void
  setRatioType: (type: TransactionType) => void
}

export const useStatisticsStore = create<StatisticsStore>((set) => ({
  lineChartSelectedPointIndex: null,
  lineChartType: 'expense',
  ratioSelectedCategoryId: '',
  ratioType: 'expense',
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
}))
