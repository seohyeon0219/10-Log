import { supabase } from './supabase'
import { mapTransaction, type TransactionRow } from './financeApi'
import { toDateKey } from '../utils/dateUtils'
import type { DailyReview, DailyReviewValues } from '../types/finance'

type DailyReviewRow = {
  good_comment: string
  good_transaction_id: string | null
  id: string
  regret_comment: string
  regret_transaction_id: string | null
  review_date: string
  satisfaction_rating: number
}

const mapDailyReview = (row: DailyReviewRow): DailyReview => ({
  goodComment: row.good_comment,
  goodTransactionId: row.good_transaction_id,
  id: row.id,
  regretComment: row.regret_comment,
  regretTransactionId: row.regret_transaction_id,
  reviewDate: row.review_date,
  satisfactionRating: row.satisfaction_rating,
})

export const getDailyReviewTransactions = async (date: Date) => {
  const dateKey = toDateKey(date)
  const { data, error } = await supabase
    .from('transactions')
    .select('id, type, amount, memo, date, is_fixed, category_id, categories(id, name, color, type)')
    .eq('date', dateKey)
    .order('created_at', { ascending: true })
    .returns<TransactionRow[]>()

  if (error) {
    throw error
  }

  return data.map(mapTransaction)
}

export const getDailyReview = async (date: Date): Promise<DailyReview | null> => {
  const { data, error } = await supabase
    .from('daily_reviews')
    .select(
      'id, review_date, good_transaction_id, regret_transaction_id, good_comment, regret_comment, satisfaction_rating',
    )
    .eq('review_date', toDateKey(date))
    .maybeSingle<DailyReviewRow>()

  if (error) {
    throw error
  }

  if (!data) {
    return null
  }

  return mapDailyReview(data)
}

export const upsertDailyReview = async (date: Date, values: DailyReviewValues) => {
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError) {
    throw userError
  }

  const { data, error } = await supabase
    .from('daily_reviews')
    .upsert(
      {
        good_comment: values.goodComment,
        good_transaction_id: values.goodTransactionId,
        regret_comment: values.regretComment,
        regret_transaction_id: values.regretTransactionId,
        review_date: toDateKey(date),
        satisfaction_rating: values.satisfactionRating,
        user_id: userData.user.id,
      },
      {
        onConflict: 'user_id,review_date',
      },
    )
    .select(
      'id, review_date, good_transaction_id, regret_transaction_id, good_comment, regret_comment, satisfaction_rating',
    )
    .single<DailyReviewRow>()

  if (error) {
    throw error
  }

  return mapDailyReview(data)
}
