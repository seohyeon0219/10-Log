import { create } from 'zustand'
import { getDailyReviewTransactions, upsertDailyReview } from '../lib/reviewApi'
import type { DailyReviewValues, Transaction } from '../types/finance'

type ReviewStore = {
  error: string | null
  isLoading: boolean
  loadTodayTransactions: () => Promise<void>
  saveDailyReview: (values: DailyReviewValues) => Promise<void>
  todayTransactions: Transaction[]
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
  error: null,
  isLoading: false,
  loadTodayTransactions: async () => {
    set({ error: null, isLoading: true })

    try {
      const transactions = await getDailyReviewTransactions(new Date())

      set({
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
  saveDailyReview: async (values) => {
    await upsertDailyReview(new Date(), values)
    await get().loadTodayTransactions()
  },
  todayTransactions: [],
}))
