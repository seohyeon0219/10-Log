export type TransactionType = 'expense' | 'income'

export type Category = {
  color: string
  id: string
  name: string
  type: TransactionType
}

export type Transaction = {
  amount: number
  categoryColor: string
  categoryId: string
  categoryName: string
  date: string
  day: number
  id: string
  isFixed: boolean
  memo: string
  type: TransactionType
}

export type CalendarDayAmount = {
  date: string
  expense?: number
  income?: number
}

export type MonthlySummary = {
  expense: number
  fixedExpense: number
  fixedIncome: number
  income: number
}

export type MonthlyPromise = {
  budgetAmount: number
  isRegistered: boolean
  monthLabel: string
  promise: string
}

export type MonthlyPromiseValues = {
  budgetAmount: number
  promise: string
}

export type TransactionFormValues = {
  amount: number
  categoryId: string
  date: string
  isFixed: boolean
  memo: string
}

export type DailyReviewValues = {
  goodComment: string
  goodTransactionId: string | null
  regretComment: string
  regretTransactionId: string | null
  satisfactionRating: number
}
