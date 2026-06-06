import { useState } from 'react'
import CalendarGrid from '../../components/calendar/CalendarGrid'
import CalendarMonthHeader from '../../components/calendar/CalendarMonthHeader'
import CalendarMonthlySummary from '../../components/calendar/CalendarMonthlySummary'
import DesktopSidePanel from '../../components/sidePanel/DesktopSidePanel'
import { getMockCalendarDayAmounts, mockMonthlySummary } from '../../mocks/data'

export default function DesktopMainContainer() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const handlePrevMonth = () => {
    setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-360 flex-col px-4 py-6 md:px-6">
      <CalendarMonthHeader
        currentDate={currentDate}
        onNextMonth={handleNextMonth}
        onPrevMonth={handlePrevMonth}
      />

      <CalendarMonthlySummary {...mockMonthlySummary} />

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_380px] gap-8 mt-2">
        <CalendarGrid currentDate={currentDate} dayAmounts={getMockCalendarDayAmounts(currentDate)} />

        <DesktopSidePanel />
      </div>
    </main>
  )
}
