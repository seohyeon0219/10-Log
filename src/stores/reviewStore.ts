import { create } from 'zustand'
import { getDailyReview, getDailyReviewTransactions, upsertDailyReview } from '../lib/reviewApi'
import type { DailyReview, DailyReviewValues, Transaction } from '../types/finance'

type ReviewStore = {
  dailyReview: DailyReview | null
  error: string | null
  isLoading: boolean
  loadDailyReview: (date: Date) => Promise<void>
  saveDailyReview: (date: Date, values: DailyReviewValues) => Promise<void>
  todayTransactions: Transaction[]
}

export const useReviewStore = create<ReviewStore>((set) => ({
  dailyReview: null,
  error: null,
  isLoading: false,
  loadDailyReview: async (date) => {
    set({ error: null, isLoading: true })

    try {
      const [transactions, dailyReview] = await Promise.all([
        getDailyReviewTransactions(date),
        getDailyReview(date),
      ])

      set({
        dailyReview,
        isLoading: false,
        todayTransactions: transactions,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '오늘 거래를 불러오지 못했어요.',
        isLoading: false,
      })
    }
  },
  saveDailyReview: async (date, values) => {
    set({ error: null })

    try {
      const dailyReview = await upsertDailyReview(date, values)
      const transactions = await getDailyReviewTransactions(date)

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
