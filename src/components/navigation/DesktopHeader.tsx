import CalendarMonthHeader from '../calendar/CalendarMonthHeader'
import CalendarMonthlySummary from '../calendar/CalendarMonthlySummary'
import { useCalendarStore } from '../../stores/calendarStore'

export default function Header() {
  const currentDate = useCalendarStore((state) => state.currentDate)
  const goNextMonth = useCalendarStore((state) => state.goNextMonth)
  const goPrevMonth = useCalendarStore((state) => state.goPrevMonth)
  const monthlySummary = useCalendarStore((state) => state.monthlySummary)

  return (
    <>
      <CalendarMonthHeader
        currentDate={currentDate}
        onNextMonth={goNextMonth}
        onPrevMonth={goPrevMonth}
      />
      <CalendarMonthlySummary {...monthlySummary} />
    </>
  )
}
