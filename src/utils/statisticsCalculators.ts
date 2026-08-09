import { getMonthlySummary } from '../lib/financeApi'
import type { Transaction, TransactionType } from '../types/finance'
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
