import { supabase } from './supabase'
import type { DailyReviewValues, Transaction } from '../types/finance'

type CategoryRow = {
  color: string
  id: string
  name: string
  type: 'expense' | 'income'
}

type TransactionRow = {
  amount: number
  categories: CategoryRow | null
  category_id: string
  date: string
  id: string
  is_fixed: boolean
  memo: string | null
  type: 'expense' | 'income'
}

const toDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const mapTransaction = (row: TransactionRow): Transaction => {
  const category = row.categories

  return {
    amount: row.amount,
    categoryColor: category?.color ?? '#898989',
    categoryId: row.category_id,
    categoryName: category?.name ?? '미분류',
    date: row.date,
    day: Number(row.date.slice(8, 10)),
    id: row.id,
    isFixed: row.is_fixed,
    memo: row.memo ?? '',
    type: row.type,
  }
}

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

export const upsertDailyReview = async (date: Date, values: DailyReviewValues) => {
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError) {
    throw userError
  }

  const { error } = await supabase.from('daily_reviews').upsert(
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

  if (error) {
    throw error
  }
}
