import { create } from 'zustand'
import type { TransactionType } from '../types/finance'

type StatisticsStore = {
  ratioSelectedCategoryId: string
  ratioType: TransactionType
  setRatioSelectedCategoryId: (categoryId: string) => void
  setRatioType: (type: TransactionType) => void
}

export const useStatisticsStore = create<StatisticsStore>((set) => ({
  ratioSelectedCategoryId: '',
  ratioType: 'expense',
  setRatioSelectedCategoryId: (categoryId) => set({ ratioSelectedCategoryId: categoryId }),
  setRatioType: (type) =>
    set({
      ratioSelectedCategoryId: '',
      ratioType: type,
    }),
}))
