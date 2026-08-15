import { useEffect, useMemo } from 'react'
import BackHeader from '../components/common/BackHeader'
import { useCalendarStore } from '../stores/calendarStore'
import { useRecentMonthsTransactions } from '../hooks/useRecentMonthsTransactions'
import {
  getCategoryChangeRanking,
  getLineChartData,
  getMonthlyInsights,
  getPreviousMonthComparison,
} from '../utils/statisticsCalculators'
import { getMonthDate } from '../utils/dateUtils'
import MonthlyInsightsCard from '../components/statistics/MonthlyInsightsCard'
import PreviousMonthComparison from '../components/statistics/PreviousMonthComparison'
import CategoryChangeRanking from '../components/statistics/CategoryChangeRanking'
import SpendingTransactionLineChart from '../components/statistics/SpendingTransactionLineChart'

export default function MonthlyInsightsContainer() {
  const currentDate = useCalendarStore((state) => state.currentDate)
  const transactions = useCalendarStore((state) => state.transactions)
  const isLoading = useCalendarStore((state) => state.isLoading)
  const loadMonth = useCalendarStore((state) => state.loadMonth)

  const { monthsData, previousMonthData } = useRecentMonthsTransactions(currentDate, 6)
  const lastYearDate = useMemo(() => getMonthDate(currentDate, -12), [currentDate])
  const { monthsData: lastYearMonthsData } = useRecentMonthsTransactions(lastYearDate, 6)

  useEffect(() => {
    void loadMonth()
  }, [loadMonth])

  const monthlyInsights = useMemo(
    () => getMonthlyInsights(currentDate, transactions, monthsData),
    [currentDate, transactions, monthsData],
  )
  const previousMonthComparison = useMemo(
    () => getPreviousMonthComparison(transactions, previousMonthData),
    [transactions, previousMonthData],
  )
  const categoryChangeRanking = useMemo(
    () => getCategoryChangeRanking(transactions, previousMonthData),
    [transactions, previousMonthData],
  )
  const spendingTransactionLineChart = useMemo(
    () => getLineChartData(currentDate, monthsData),
    [currentDate, monthsData],
  )
  const lastYearExpense = useMemo(
    () => lastYearMonthsData.map((txs, index) => ({
      amount: txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      month: `${getMonthDate(currentDate, index - 5).getMonth() + 1}월`,
    })),
    [currentDate, lastYearMonthsData],
  )

  const monthLabel = `${currentDate.getMonth() + 1}월 인사이트`

  return (
    <section className="w-full self-start animate-fade-up">
      <BackHeader title={monthLabel} to="/app/stats" />

      {isLoading ? (
        <div className="mt-4 rounded-xl border border-white/60 bg-(--color-glass-white) px-4 py-3 text-sm font-semibold text-gray-500 backdrop-blur-sm">
          데이터를 불러오는 중이에요.
        </div>
      ) : null}

      <div className="mt-4 grid gap-4">
        <MonthlyInsightsCard data={monthlyInsights} showDetailLink={false} />

        <div className="grid gap-4 md:grid-cols-2">
          <PreviousMonthComparison items={previousMonthComparison} />
          <CategoryChangeRanking items={categoryChangeRanking} />
        </div>

        <SpendingTransactionLineChart
          data={spendingTransactionLineChart}
          lastYearExpense={lastYearExpense}
        />
      </div>
    </section>
  )
}
