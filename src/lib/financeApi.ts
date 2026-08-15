import { supabase } from './supabase'
import { getCurrentUserId } from './auth'
import { getMonthRange, toMonthKey } from '../utils/dateUtils'
import { mapTransaction, type TransactionRow } from '../utils/mappers'
import type {
  CalendarDayAmount,
  Category,
  MonthlyPromise,
  MonthlyPromiseValues,
  MonthlySummary,
  Transaction,
  TransactionFormValues,
  TransactionType,
} from '../types/finance'

type CategoryFormValues = {
  color: string
  name: string
  type: TransactionType
}

export const ensureDefaultCategories = async () => {
  const { error } = await supabase.rpc('ensure_default_categories')

  if (error) {
    throw error
  }
}


export const getMonthlyPromise = async (
  date: Date,
  fallbackPromise: string,
): Promise<MonthlyPromise> => {
  const { data, error } = await supabase
    .from('monthly_promises')
    .select('budget_amount, promise, use_income_as_budget')
    .eq('month', toMonthKey(date))
    .maybeSingle()

  if (error) {
    throw error
  }

  return {
    budgetAmount: data?.budget_amount ?? 0,
    isRegistered: Boolean(data?.budget_amount && data.budget_amount > 0),
    monthLabel: '이번 달',
    promise: data?.promise ?? fallbackPromise,
    useIncomeAsBudget: data?.use_income_as_budget ?? false,
  }
}

export const upsertMonthlyPromise = async (date: Date, values: MonthlyPromiseValues) => {
  const userId = await getCurrentUserId()

  const { error } = await supabase.from('monthly_promises').upsert(
    {
      budget_amount: values.budgetAmount,
      month: toMonthKey(date),
      promise: values.promise ?? '',
      use_income_as_budget: values.useIncomeAsBudget ?? false,
      user_id: userId,
    },
    {
      onConflict: 'user_id,month',
    },
  )

  if (error) {
    throw error
  }
}

export const deleteMonthlyPromise = async (date: Date) => {
  const { error } = await supabase.from('monthly_promises').delete().eq('month', toMonthKey(date))

  if (error) {
    throw error
  }
}

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, color, type')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    throw error
  }

  return data satisfies Category[]
}

export const createCategory = async (values: CategoryFormValues) => {
  const userId = await getCurrentUserId()

  const { error } = await supabase.from('categories').insert({
    color: values.color,
    name: values.name,
    type: values.type,
    user_id: userId,
  })

  if (error) {
    throw error
  }
}

export const updateCategory = async (
  categoryId: string,
  values: Pick<CategoryFormValues, 'color' | 'name'>,
) => {
  const { error } = await supabase
    .from('categories')
    .update({
      color: values.color,
      name: values.name,
    })
    .eq('id', categoryId)

  if (error) {
    throw error
  }
}

export const deleteCategory = async (categoryId: string) => {
  const { error } = await supabase.from('categories').delete().eq('id', categoryId)

  if (error) {
    throw error
  }
}

export const getMonthlyTransactions = async (date: Date) => {
  const { start, end } = getMonthRange(date)
  const { data, error } = await supabase
    .from('transactions')
    .select('id, type, amount, memo, date, is_fixed, category_id, category_name, category_color, categories(id, name, color, type)')
    .gte('date', start)
    .lt('date', end)
    .order('date', { ascending: true })
    .order('created_at', { ascending: true })
    .returns<TransactionRow[]>()

  if (error) {
    throw error
  }

  return data.map(mapTransaction)
}

export const createTransaction = async (type: TransactionType, values: TransactionFormValues) => {
  const userId = await getCurrentUserId()

  const { error } = await supabase.from('transactions').insert({
    amount: values.amount,
    category_id: values.categoryId,
    date: values.date,
    is_fixed: values.isFixed,
    memo: values.memo,
    type,
    user_id: userId,
  })

  if (error) {
    throw error
  }
}

export const updateTransaction = async (transactionId: string, values: TransactionFormValues) => {
  const { error } = await supabase
    .from('transactions')
    .update({
      amount: values.amount,
      category_id: values.categoryId,
      date: values.date,
      is_fixed: values.isFixed,
      memo: values.memo,
    })
    .eq('id', transactionId)

  if (error) {
    throw error
  }
}

export const deleteTransaction = async (transactionId: string) => {
  const { error } = await supabase.from('transactions').delete().eq('id', transactionId)

  if (error) {
    throw error
  }
}

export const getCalendarDayAmounts = (transactions: Transaction[]) =>
  transactions.reduce<CalendarDayAmount[]>((dayAmounts, transaction) => {
    const dayAmount = dayAmounts.find((amount) => amount.date === transaction.date)

    if (!dayAmount) {
      dayAmounts.push({
        date: transaction.date,
        [transaction.type]: transaction.amount,
      })

      return dayAmounts
    }

    if (transaction.type === 'income') {
      dayAmount.income = (dayAmount.income ?? 0) + transaction.amount
    }

    if (transaction.type === 'expense') {
      dayAmount.expense = (dayAmount.expense ?? 0) + transaction.amount
    }

    return dayAmounts
  }, [])

export const getTransactionsByFilter = async ({
  startDate,
  endDate,
  categoryIds,
  memo,
  isFixed,
}: {
  startDate?: string
  endDate?: string
  categoryIds?: string[]
  memo?: string
  isFixed?: boolean
}) => {
  let q = supabase
    .from('transactions')
    .select('id, type, amount, memo, date, is_fixed, category_id, category_name, category_color, categories(id, name, color, type)')

  if (startDate) q = q.gte('date', startDate)
  if (endDate) q = q.lte('date', endDate)
  if (categoryIds?.length) q = q.in('category_id', categoryIds)
  if (memo) q = q.ilike('memo', `%${memo}%`)
  if (isFixed !== undefined) q = q.eq('is_fixed', isFixed)

  const { data, error } = await q
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .returns<TransactionRow[]>()

  if (error) throw error
  return data.map(mapTransaction)
}

export const getMonthlySummary = (transactions: Transaction[]): MonthlySummary =>
  transactions.reduce(
    (summary, transaction) => {
      if (transaction.type === 'income') {
        if (transaction.isFixed) {
          summary.fixedIncome += transaction.amount
        } else {
          summary.income += transaction.amount
        }
      }

      if (transaction.type === 'expense') {
        if (transaction.isFixed) {
          summary.fixedExpense += transaction.amount
        } else {
          summary.expense += transaction.amount
        }
      }

      return summary
    },
    {
      expense: 0,
      fixedExpense: 0,
      fixedIncome: 0,
      income: 0,
    },
  )
