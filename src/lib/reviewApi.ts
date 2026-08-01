import { supabase } from './supabase'
import { getCurrentUserId } from './auth'
import { toDateKey } from '../utils/dateUtils'
import { mapDailyReview, mapTransaction, type DailyReviewRow, type TransactionRow } from '../utils/mappers'
import type { DailyReview, DailyReviewValues } from '../types/finance'

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
  const userId = await getCurrentUserId()

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
        user_id: userId,
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
