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

export type TransactionFormValues = {
  amount: number
  categoryId: string
  date: string
  isFixed: boolean
  memo: string
}
