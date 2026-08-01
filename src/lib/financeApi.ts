import { supabase } from './supabase'
import { getCurrentUserId } from './auth'
import { toDateKey } from '../utils/dateUtils'
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

export type CategoryRow = {
  color: string
  id: string
  name: string
  type: TransactionType
}

type CategoryFormValues = {
  color: string
  name: string
  type: TransactionType
}

export type TransactionRow = {
  amount: number
  categories: CategoryRow | null
  category_id: string
  date: string
  id: string
  is_fixed: boolean
  memo: string | null
  type: TransactionType
}

export const ensureDefaultCategories = async () => {
  const { error } = await supabase.rpc('ensure_default_categories')

  if (error) {
    throw error
  }
}

const getMonthRange = (date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1)

  return {
    end: toDateKey(end),
    start: toDateKey(start),
  }
}

const toMonthKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')

  return `${year}-${month}-01`
}

export const mapTransaction = (row: TransactionRow): Transaction => {
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
    .select('id, type, amount, memo, date, is_fixed, category_id, categories(id, name, color, type)')
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
