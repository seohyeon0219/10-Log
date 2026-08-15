import { useEffect, useMemo } from 'react'
import BackHeader from '../components/common/BackHeader'
import { useCalendarStore } from '../stores/calendarStore'
import { useRecentMonthsTransactions } from '../hooks/useRecentMonthsTransactions'
import {
  getMonthlyInsights,
  getSpendingByDayOfWeek,
  getSpendingByWeek,
  getSpendingDensity,
} from '../utils/statisticsCalculators'
import MonthlyInsightsCard from '../components/statistics/MonthlyInsightsCard'
import SpendingByDayOfWeekCard from '../components/statistics/SpendingByDayOfWeekCard'
import SpendingByWeekCard from '../components/statistics/SpendingByWeekCard'
import SpendingDensityCard from '../components/statistics/SpendingDensityCard'

export default function MonthlyInsightsContainer() {
  const currentDate = useCalendarStore((state) => state.currentDate)
  const transactions = useCalendarStore((state) => state.transactions)
  const isLoading = useCalendarStore((state) => state.isLoading)
  const loadMonth = useCalendarStore((state) => state.loadMonth)

  const { monthsData } = useRecentMonthsTransactions(currentDate, 6)

  useEffect(() => {
    void loadMonth()
  }, [loadMonth])

  const monthlyInsights = useMemo(
    () => getMonthlyInsights(currentDate, transactions, monthsData),
    [currentDate, transactions, monthsData],
  )
  const spendingByDayOfWeek = useMemo(() => getSpendingByDayOfWeek(transactions), [transactions])
  const spendingByWeek = useMemo(() => getSpendingByWeek(transactions), [transactions])
  const spendingDensity = useMemo(() => getSpendingDensity(transactions, currentDate), [transactions, currentDate])

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
        <SpendingByDayOfWeekCard data={spendingByDayOfWeek} />
        <SpendingByWeekCard data={spendingByWeek} />
        <SpendingDensityCard data={spendingDensity} />
      </div>
    </section>
  )
}
