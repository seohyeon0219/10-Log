import { create } from 'zustand'
import { getMockTodayTransactions, mockReviewLookback } from '../mocks/data'

type ReviewSpendItem = {
  category: string
  id: string
  memo: string
}

type ReviewLookback = {
  goodSpends: ReviewSpendItem[]
  regretSpends: ReviewSpendItem[]
  weeklyNote: string
}

type TodayTransaction = {
  amount: number
  categoryColor: string
  categoryName: string
  date: string
  day: number
  id: string
  memo: string
  type: 'expense' | 'income'
}

type ReviewStore = {
  reviewLookback: ReviewLookback
  todayTransactions: TodayTransaction[]
}

export const useReviewStore = create<ReviewStore>(() => ({
  reviewLookback: mockReviewLookback,
  todayTransactions: getMockTodayTransactions(new Date()),
}))
