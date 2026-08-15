import { useEffect, useMemo } from 'react'
import BackHeader from '../components/common/BackHeader'
import SpendingByDayOfWeekCard from '../components/statistics/SpendingByDayOfWeekCard'
import SpendingByWeekCard from '../components/statistics/SpendingByWeekCard'
import SpendingDensityCard from '../components/statistics/SpendingDensityCard'
import { useCalendarStore } from '../stores/calendarStore'
import {
  getSpendingByDayOfWeek,
  getSpendingByWeek,
  getSpendingDensity,
} from '../utils/statisticsCalculators'

export default function SpendingPatternsContainer() {
  const currentDate = useCalendarStore((state) => state.currentDate)
  const loadMonth = useCalendarStore((state) => state.loadMonth)
  const transactions = useCalendarStore((state) => state.transactions)

  useEffect(() => {
    void loadMonth()
  }, [loadMonth])

  const spendingByDayOfWeek = useMemo(() => getSpendingByDayOfWeek(transactions), [transactions])
  const spendingByWeek = useMemo(() => getSpendingByWeek(transactions), [transactions])
  const spendingDensity = useMemo(() => getSpendingDensity(transactions, currentDate), [transactions, currentDate])

  const monthLabel = `${currentDate.getMonth() + 1}월 지출 패턴`

  return (
    <section className="w-full self-start animate-fade-up">
      <BackHeader title={monthLabel} to="/app/stats" />

      <div className="mt-4 grid gap-4">
        <SpendingByDayOfWeekCard data={spendingByDayOfWeek} />
        <SpendingByWeekCard data={spendingByWeek} />
        <SpendingDensityCard data={spendingDensity} />
      </div>
    </section>
  )
}
