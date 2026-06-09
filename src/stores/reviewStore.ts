import { create } from 'zustand'
import { getDailyReview, getDailyReviewTransactions, upsertDailyReview } from '../lib/reviewApi'
import type { DailyReview, DailyReviewValues, Transaction } from '../types/finance'

type ReviewStore = {
  dailyReview: DailyReview | null
  error: string | null
  isLoading: boolean
  loadTodayReview: () => Promise<void>
  saveDailyReview: (values: DailyReviewValues) => Promise<void>
  todayTransactions: Transaction[]
}

export const useReviewStore = create<ReviewStore>((set) => ({
  dailyReview: null,
  error: null,
  isLoading: false,
  loadTodayReview: async () => {
    set({ error: null, isLoading: true })
    const today = new Date()

    try {
      const [transactions, dailyReview] = await Promise.all([
        getDailyReviewTransactions(today),
        getDailyReview(today),
      ])

      set({
        dailyReview,
        isLoading: false,
        todayTransactions: transactions,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '거래를 불러오지 못했어요.',
        isLoading: false,
      })
    }
  },
  saveDailyReview: async (values) => {
    set({ error: null })
    const today = new Date()

    try {
      const dailyReview = await upsertDailyReview(today, values)
      const transactions = await getDailyReviewTransactions(today)

      set({
        dailyReview,
        todayTransactions: transactions,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '회고를 저장하지 못했어요.',
      })
      throw error
    }
  },
  todayTransactions: [],
}))
