import { useState } from 'react'
import MonthlyPromise from '../../components/calendar/MonthlyPromise'
import MonthlyPromiseModal from '../../components/calendar/MonthlyPromiseModal'
import { useStatisticsStore } from '../../stores/statisticsStore'

export default function MobileCalendarContainer() {
  const [isMonthlyPromiseOpen, setIsMonthlyPromiseOpen] = useState(false)
  const deleteMonthlyPromise = useStatisticsStore((state) => state.deleteMonthlyPromise)
  const monthlyPromise = useStatisticsStore((state) => state.monthlyPromise)
  const updateMonthlyPromise = useStatisticsStore((state) => state.updateMonthlyPromise)

  return (
    <section className="w-full self-start">
      <MonthlyPromise
        budgetAmount={monthlyPromise.budgetAmount}
        isRegistered={monthlyPromise.isRegistered}
        onEdit={() => setIsMonthlyPromiseOpen(true)}
        promise={monthlyPromise.promise}
      />

      {isMonthlyPromiseOpen ? (
        <MonthlyPromiseModal
          budgetAmount={monthlyPromise.budgetAmount}
          isRegistered={monthlyPromise.isRegistered}
          isOpen={isMonthlyPromiseOpen}
          onClose={() => setIsMonthlyPromiseOpen(false)}
          onDelete={deleteMonthlyPromise}
          onSave={(values) => {
            updateMonthlyPromise(values)
            setIsMonthlyPromiseOpen(false)
          }}
          promise={monthlyPromise.promise}
        />
      ) : null}
    </section>
  )
}
