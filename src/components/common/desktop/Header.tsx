import CalendarMonthHeader from '../../calendar/CalendarMonthHeader'
import CalendarMonthlySummary from '../../calendar/CalendarMonthlySummary'

type HeaderProps = {
  currentDate: Date
  monthlySummary: {
    expense: number
    fixedExpense: number
    fixedIncome: number
    income: number
  }
  onNextMonth: () => void
  onPrevMonth: () => void
}

export default function Header({
  currentDate,
  monthlySummary,
  onNextMonth,
  onPrevMonth,
}: HeaderProps) {
  return (
    <>
      <CalendarMonthHeader
        currentDate={currentDate}
        onNextMonth={onNextMonth}
        onPrevMonth={onPrevMonth}
      />
      <CalendarMonthlySummary {...monthlySummary} />
    </>
  )
}
