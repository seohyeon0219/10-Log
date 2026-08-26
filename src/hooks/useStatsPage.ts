import { useEffect, useMemo, useState } from 'react'
import { useRecentMonthsTransactions } from './useRecentMonthsTransactions'
import { useCalendarStore } from '../stores/calendarStore'
import type { Satisfaction, TransactionType } from '../types/finance'
import {
  getCategoryChangeRanking,
  getCategoryRatio,
  getLineChartData,
  getMonthlyInsights,
  getPreviousMonthComparison,
  getSpendingByDayOfWeek,
  getSpendingByWeek,
  getSpendingDensity,
} from '../utils/statisticsCalculators'
import { getMonthDate } from '../utils/dateUtils'

export type SelectedStatisticsTransaction = {
  amount: number
  categoryId: string
  date: string
  id: string
  memo: string
  satisfaction: Satisfaction | null
  type: TransactionType
}

export function useStatsPage() {
  const [ratioType, setRatioType] = useState<TransactionType>('expense')
  const [ratioSelectedCategoryId, setRatioSelectedCategoryId] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState<SelectedStatisticsTransaction | null>(null)

  const addCategory = useCalendarStore((state) => state.addCategory)
  const currentDate = useCalendarStore((state) => state.currentDate)
  const deleteCategory = useCalendarStore((state) => state.deleteCategory)
  const deleteTransaction = useCalendarStore((state) => state.deleteTransaction)
  const expenseCategories = useCalendarStore((state) => state.expenseCategories)
  const goNextMonth = useCalendarStore((state) => state.goNextMonth)
  const goPrevMonth = useCalendarStore((state) => state.goPrevMonth)
  const incomeCategories = useCalendarStore((state) => state.incomeCategories)
  const loadMonth = useCalendarStore((state) => state.loadMonth)
  const transactions = useCalendarStore((state) => state.transactions)
  const updateCategory = useCalendarStore((state) => state.updateCategory)
  const updateTransaction = useCalendarStore((state) => state.updateTransaction)

  const { monthsData, previousMonthData } = useRecentMonthsTransactions(currentDate, 6)
  const lastYearDate = useMemo(() => getMonthDate(currentDate, -12), [currentDate])
  const { monthsData: lastYearMonthsData } = useRecentMonthsTransactions(lastYearDate, 6)

  const categoryTransactionRatio = useMemo(() => getCategoryRatio(transactions), [transactions])
  const previousMonthComparison = useMemo(
    () => getPreviousMonthComparison(transactions, previousMonthData),
    [previousMonthData, transactions],
  )
  const categoryChangeRanking = useMemo(
    () => getCategoryChangeRanking(transactions, previousMonthData),
    [previousMonthData, transactions],
  )
  const spendingTransactionLineChart = useMemo(
    () => getLineChartData(currentDate, monthsData),
    [currentDate, monthsData],
  )
  const monthlyInsights = useMemo(
    () => getMonthlyInsights(currentDate, transactions, monthsData),
    [currentDate, transactions, monthsData],
  )

  const lastYearExpense = useMemo(
    () => lastYearMonthsData.map((txs, index) => ({
      amount: txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      month: `${getMonthDate(currentDate, index - 5).getMonth() + 1}월`,
    })),
    [currentDate, lastYearMonthsData],
  )

  const spendingByDayOfWeek = useMemo(() => getSpendingByDayOfWeek(transactions), [transactions])
  const spendingByWeek = useMemo(() => getSpendingByWeek(transactions), [transactions])
  const spendingDensity = useMemo(() => getSpendingDensity(transactions, currentDate), [transactions, currentDate])

  useEffect(() => {
    void loadMonth()
  }, [loadMonth])

  const activeCategories = selectedTransaction?.type === 'income' ? incomeCategories : expenseCategories

  const closeTransaction = () => setSelectedTransaction(null)

  const saveTransaction = async (values: Parameters<typeof updateTransaction>[1]) => {
    if (!selectedTransaction) return
    await updateTransaction(selectedTransaction.id, values)
    closeTransaction()
  }

  const removeTransaction = async () => {
    if (!selectedTransaction) return
    await deleteTransaction(selectedTransaction.id)
    closeTransaction()
  }

  return {
    activeCategories,
    addCategory,
    categoryChangeRanking,
    categoryTransactionRatio,
    closeTransaction,
    currentDate,
    deleteCategory,
    expenseCategories,
    goNextMonth,
    goPrevMonth,
    incomeCategories,
    previousMonthComparison,
    ratioSelectedCategoryId,
    ratioType,
    setRatioSelectedCategoryId,
    removeTransaction,
    saveTransaction,
    selectedTransaction,
    setRatioType,
    setSelectedTransaction,
    lastYearExpense,
    monthlyInsights,
    spendingByDayOfWeek,
    spendingByWeek,
    spendingDensity,
    spendingTransactionLineChart,
    transactions,
    updateCategory,
  }
}
