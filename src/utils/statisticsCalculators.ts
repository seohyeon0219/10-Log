import { getMonthlySummary } from '../lib/financeApi'
import type { Satisfaction, Transaction, TransactionType } from '../types/finance'
import { getMonthDate } from './dateUtils'

type CategoryRatioItem = {
  amount: number
  color: string
  id: string
  label: string
  transactions: Array<{
    amount: number
    categoryId: string
    date: string
    id: string
    memo: string
    satisfaction: Satisfaction | null
  }>
}

export const getRate = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

export const getCategoryRatio = (transactions: Transaction[]) => {
  const result: Record<TransactionType, CategoryRatioItem[]> = { expense: [], income: [] }

  transactions.forEach((transaction) => {
    const items = result[transaction.type]
    const item = items.find((category) => category.id === transaction.categoryId)

    if (!item) {
      items.push({
        amount: transaction.amount,
        color: transaction.categoryColor,
        id: transaction.categoryId,
        label: transaction.categoryName,
        transactions: [{
          amount: transaction.amount,
          categoryId: transaction.categoryId,
          date: transaction.date,
          id: transaction.id,
          memo: transaction.memo,
          satisfaction: transaction.satisfaction,
        }],
      })
      return
    }

    item.amount += transaction.amount
    item.transactions.push({
      amount: transaction.amount,
      categoryId: transaction.categoryId,
      date: transaction.date,
      id: transaction.id,
      memo: transaction.memo,
      satisfaction: transaction.satisfaction,
    })
  })

  return {
    expense: result.expense.sort((a, b) => b.amount - a.amount),
    income: result.income.sort((a, b) => b.amount - a.amount),
  }
}

export const getPreviousMonthComparison = (
  currentTransactions: Transaction[],
  previousTransactions: Transaction[],
) => {
  const current = getMonthlySummary(currentTransactions)
  const previous = getMonthlySummary(previousTransactions)
  const currentIncome = current.income + current.fixedIncome
  const previousIncome = previous.income + previous.fixedIncome
  const currentExpense = current.expense + current.fixedExpense
  const previousExpense = previous.expense + previous.fixedExpense
  const currentBalance = currentIncome - currentExpense
  const previousBalance = previousIncome - previousExpense

  return [
    {
      currentValue: currentIncome,
      id: 'income',
      label: '수입',
      previousValue: previousIncome,
      rate: getRate(currentIncome, previousIncome),
    },
    {
      currentValue: currentExpense,
      id: 'expense',
      label: '지출',
      previousValue: previousExpense,
      rate: getRate(currentExpense, previousExpense),
    },
    {
      currentValue: currentBalance,
      id: 'balance',
      label: '잔액',
      previousValue: previousBalance,
      rate: getRate(currentBalance, previousBalance),
    },
  ]
}

export const getCategoryChangeRanking = (
  currentTransactions: Transaction[],
  previousTransactions: Transaction[],
) => {
  const makeRanking = (type: TransactionType) => {
    const currentMap = new Map<string, { amount: number; label: string }>()
    const previousMap = new Map<string, number>()

    currentTransactions
      .filter((transaction) => transaction.type === type)
      .forEach((transaction) => {
        const current = currentMap.get(transaction.categoryId)
        currentMap.set(transaction.categoryId, {
          amount: (current?.amount ?? 0) + transaction.amount,
          label: transaction.categoryName,
        })
      })

    previousTransactions
      .filter((transaction) => transaction.type === type)
      .forEach((transaction) => {
        previousMap.set(
          transaction.categoryId,
          (previousMap.get(transaction.categoryId) ?? 0) + transaction.amount,
        )
      })

    return Array.from(currentMap.entries())
      .map(([id, item]) => ({
        currentAmount: item.amount,
        id,
        label: item.label,
        previousAmount: previousMap.get(id) ?? 0,
        rate: getRate(item.amount, previousMap.get(id) ?? 0),
      }))
      .sort((a, b) => Math.abs(b.rate) - Math.abs(a.rate))
      .slice(0, 3)
  }

  return { expense: makeRanking('expense'), income: makeRanking('income') }
}

export type MonthlyInsightsData = {
  threeMonthComparison: {
    avgAmount: number
    currentAmount: number
    dayOfMonth: number
    rate: number
  }
  topExpenses: Array<{
    amount: number
    categoryColor: string
    categoryName: string
    date: string
    id: string
    memo: string
  }>
}

export const getMonthlyInsights = (
  currentDate: Date,
  currentTransactions: Transaction[],
  monthsData: Transaction[][], // length 6, index 5 = current, 4/3/2 = past 3 months
): MonthlyInsightsData => {
  const today = new Date()
  const isCurrentMonth =
    currentDate.getFullYear() === today.getFullYear() &&
    currentDate.getMonth() === today.getMonth()
  const dayOfMonth = isCurrentMonth
    ? today.getDate()
    : new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()

  const currentExpenses = currentTransactions.filter((t) => t.type === 'expense')
  const currentAmount = currentExpenses.reduce((s, t) => s + t.amount, 0)

  // monthsData[2]=3개월 전, [3]=2개월 전, [4]=지난달
  const past3 = monthsData.slice(-4, -1)
  const pastAmounts = past3.map((txs) =>
    txs.filter((t) => t.type === 'expense' && t.day <= dayOfMonth).reduce((s, t) => s + t.amount, 0),
  )
  const avgAmount = Math.round(pastAmounts.reduce((s, a) => s + a, 0) / Math.max(past3.length, 1))
  const rate = avgAmount > 0 ? Math.round(((currentAmount - avgAmount) / avgAmount) * 100) : 0

  const topExpenses = [...currentExpenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3)
    .map(({ id, amount, categoryName, categoryColor, date, memo }) => ({
      id, amount, categoryName, categoryColor, date, memo,
    }))

  return {
    threeMonthComparison: { currentAmount, avgAmount, dayOfMonth, rate },
    topExpenses,
  }
}

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0] // Mon → Sun
const DAY_LABELS: Record<number, string> = { 0: '일', 1: '월', 2: '화', 3: '수', 4: '목', 5: '금', 6: '토' }

export type DayOfWeekSpending = {
  amount: number
  isMax: boolean
  label: string
}

export const getSpendingByDayOfWeek = (transactions: Transaction[]): DayOfWeekSpending[] => {
  const map = new Map<number, number>(DAY_ORDER.map((d) => [d, 0]))

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const dow = new Date(`${t.date}T00:00:00`).getDay()
      map.set(dow, (map.get(dow) ?? 0) + t.amount)
    })

  const max = Math.max(...Array.from(map.values()))

  return DAY_ORDER.map((d) => ({
    amount: map.get(d) ?? 0,
    isMax: max > 0 && (map.get(d) ?? 0) === max,
    label: DAY_LABELS[d],
  }))
}

export type WeekSpending = {
  amount: number
  isMax: boolean
  label: string
}

export const getSpendingByWeek = (transactions: Transaction[]): WeekSpending[] => {
  const weeks = [0, 0, 0, 0]

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const weekIndex = Math.min(Math.floor((t.day - 1) / 7), 3)
      weeks[weekIndex] += t.amount
    })

  const max = Math.max(...weeks)

  return weeks.map((amount, i) => ({
    amount,
    isMax: max > 0 && amount === max,
    label: `${i + 1}주차`,
  }))
}

export type SpendingDensity = {
  dailyAvg: number
  peakDay: { amount: number; date: string } | null
  refDay: number
  spendingDays: number
}

export const getSpendingDensity = (transactions: Transaction[], currentDate: Date): SpendingDensity => {
  const today = new Date()
  const isCurrentMonth =
    currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth()
  const refDay = isCurrentMonth
    ? today.getDate()
    : new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()

  const expenseTransactions = transactions.filter((t) => t.type === 'expense')
  const totalExpense = expenseTransactions.reduce((s, t) => s + t.amount, 0)

  const daySet = new Set(expenseTransactions.map((t) => t.date))

  const dayTotals = new Map<string, number>()
  expenseTransactions.forEach((t) => {
    dayTotals.set(t.date, (dayTotals.get(t.date) ?? 0) + t.amount)
  })

  let peakDay: { amount: number; date: string } | null = null
  dayTotals.forEach((amount, date) => {
    if (!peakDay || amount > peakDay.amount) peakDay = { amount, date }
  })

  return {
    dailyAvg: refDay > 0 ? Math.round(totalExpense / refDay) : 0,
    peakDay,
    refDay,
    spendingDays: daySet.size,
  }
}

export const getLineChartData = (currentDate: Date, monthTransactions: Transaction[][]) => {
  const currentMonthIndex = monthTransactions.length - 1

  return {
    expense: monthTransactions.map((transactions, index) => ({
      amount: transactions
        .filter((transaction) => transaction.type === 'expense')
        .reduce((total, transaction) => total + transaction.amount, 0),
      month: `${getMonthDate(currentDate, index - currentMonthIndex).getMonth() + 1}월`,
    })),
    income: monthTransactions.map((transactions, index) => ({
      amount: transactions
        .filter((transaction) => transaction.type === 'income')
        .reduce((total, transaction) => total + transaction.amount, 0),
      month: `${getMonthDate(currentDate, index - currentMonthIndex).getMonth() + 1}월`,
    })),
  }
}
