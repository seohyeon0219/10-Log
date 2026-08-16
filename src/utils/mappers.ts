import { DEFAULT_CATEGORY_COLOR } from '../constants/color'
import type { DailyReview, Satisfaction, Transaction, TransactionType } from '../types/finance'

export type CategoryRow = {
  color: string
  id: string
  name: string
  type: TransactionType
}

export type TransactionRow = {
  amount: number
  categories: CategoryRow | null
  category_color: string | null
  category_id: string | null
  category_name: string | null
  date: string
  id: string
  is_fixed: boolean
  memo: string | null
  satisfaction: Satisfaction | null
  type: TransactionType
}

export type DailyReviewRow = {
  good_comment: string
  good_transaction_id: string | null
  id: string
  regret_comment: string
  regret_transaction_id: string | null
  review_date: string
  satisfaction_rating: number
}

export const mapTransaction = (row: TransactionRow): Transaction => {
  const category = row.categories

  return {
    amount: row.amount,
    categoryColor: category?.color ?? row.category_color ?? DEFAULT_CATEGORY_COLOR,
    categoryId: row.category_id ?? '',
    categoryName: category?.name ?? row.category_name ?? '미분류',
    date: row.date,
    day: Number(row.date.slice(8, 10)),
    id: row.id,
    isFixed: row.is_fixed,
    memo: row.memo ?? '',
    satisfaction: row.satisfaction,
    type: row.type,
  }
}

export const mapDailyReview = (row: DailyReviewRow): DailyReview => ({
  goodComment: row.good_comment,
  goodTransactionId: row.good_transaction_id,
  id: row.id,
  regretComment: row.regret_comment,
  regretTransactionId: row.regret_transaction_id,
  reviewDate: row.review_date,
  satisfactionRating: row.satisfaction_rating,
})
