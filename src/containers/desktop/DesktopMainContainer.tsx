import { useState } from 'react'
import CalendarGrid from '../../components/calendar/CalendarGrid'
import CalendarMonthHeader from '../../components/calendar/CalendarMonthHeader'
import CalendarMonthlySummary from '../../components/calendar/CalendarMonthlySummary'
import DesktopSidePanel from '../../components/sidePanel/DesktopSidePanel'

const getDateKey = (date: Date, day: number) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const dateOfMonth = String(day).padStart(2, '0')

  return `${year}-${month}-${dateOfMonth}`
}

const monthlySummary = {
  expense: 3200,
  fixedExpense: 456,
  fixedIncome: 120000,
  income: 54124,
}

const getSampleDayAmounts = (currentDate: Date) => [
  { date: getDateKey(currentDate, 3), expense: 12800 },
  { date: getDateKey(currentDate, 7), income: 54124 },
  { date: getDateKey(currentDate, 12), expense: 3200, income: 120000 },
  { date: getDateKey(currentDate, 18), expense: 456 },
  { date: getDateKey(currentDate, 25), income: 30000, expense: 6800 },
]

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

      <CalendarMonthlySummary {...monthlySummary} />

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_380px] gap-8 mt-2">
        <CalendarGrid currentDate={currentDate} dayAmounts={getSampleDayAmounts(currentDate)} />

        <DesktopSidePanel />
      </div>
    </main>
  )
}
