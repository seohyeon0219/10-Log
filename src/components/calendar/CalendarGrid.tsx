type CalendarDayAmount = {
  date: string
  income?: number
  expense?: number
}

type CalendarGridProps = {
  currentDate: Date
  dayAmounts?: CalendarDayAmount[]
  onDateSelect?: (date: Date) => void
  selectedDate?: Date | null
}

type CalendarDay = {
  date: Date
  dateKey: string
  isCurrentMonth: boolean
  weekDayIndex: number
}

const weekDays = ['월', '화', '수', '목', '금', '토', '일']
const calendarBorderClassName = 'border-gray-100'
const saturdayIndex = 5
const sundayIndex = 6

const formatAmount = (amount: number) => amount.toLocaleString('ko-KR')
const cn = (...classNames: string[]) => classNames.filter(Boolean).join(' ')

const toDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const getMondayStartIndex = (date: Date) => (date.getDay() + 6) % 7

const getCalendarDays = (currentDate: Date): CalendarDay[] => {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDate = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOffset = getMondayStartIndex(firstDate)
  const dayCellCount = Math.ceil((firstDayOffset + daysInMonth) / 7) * 7
  const firstGridDate = new Date(year, month, 1 - firstDayOffset)

  return Array.from({ length: dayCellCount }, (_, index) => {
    const date = new Date(firstGridDate)
    date.setDate(firstGridDate.getDate() + index)

    return {
      date,
      dateKey: toDateKey(date),
      isCurrentMonth: date.getMonth() === month,
      weekDayIndex: index % 7,
    }
  })
}

const getWeekDayTextClassName = (weekDayIndex: number) => {
  if (weekDayIndex === saturdayIndex) {
    return 'text-(--color-income-blue)'
  }

  if (weekDayIndex === sundayIndex) {
    return 'text-(--color-expense-red)'
  }

  return 'text-gray-700'
}

const getDateTextClassName = (day: CalendarDay) => {
  if (!day.isCurrentMonth) {
    return 'text-(--color-gray)'
  }

  return getWeekDayTextClassName(day.weekDayIndex)
}

export default function CalendarGrid({
  currentDate,
  dayAmounts = [],
  onDateSelect,
  selectedDate,
}: CalendarGridProps) {
  const amountByDate = new Map(dayAmounts.map((amount) => [amount.date, amount]))
  const calendarDays = getCalendarDays(currentDate)
  const selectedDateKey = selectedDate ? toDateKey(selectedDate) : ''

  return (
    <section>
      <div className="grid grid-cols-7">
        {weekDays.map((weekDay, index) => (
          <div
            className={cn('px-3 py-2 text-center text-sm font-semibold', getWeekDayTextClassName(index))}
            key={weekDay}
          >
            {weekDay}
          </div>
        ))}
      </div>

      <div
        className={cn('grid grid-cols-7 overflow-hidden rounded-xl border bg-white', calendarBorderClassName)}
      >
        {calendarDays.map((day, index) => {
          const amount = amountByDate.get(day.dateKey)
          const isSelected = day.dateKey === selectedDateKey

          return (
            <button
              type="button"
              className={cn(
                'flex min-h-18 min-w-0 cursor-pointer flex-col items-start p-1 text-left transition md:min-h-22',
                isSelected ? 'bg-gray-100' : 'bg-white hover:bg-gray-50 active:bg-gray-100',
                index % 7 > 0 ? 'md:border-l md:border-gray-100' : '',
                index >= 7 ? 'md:border-t md:border-gray-100' : '',
              )}
              key={day.dateKey}
              onClick={() => onDateSelect?.(day.date)}
            >
              <span className={cn('text-sm font-semibold', getDateTextClassName(day))}>
                {day.date.getDate()}
              </span>

              <span className="mt-auto grid w-full min-w-0 gap-1">
                {amount?.income ? (
                  <span className="min-w-0 break-all text-[10px] leading-3 font-semibold text-(--color-income-blue) md:truncate md:text-[13px] md:leading-4" title={`+${formatAmount(amount.income)}`}>
                    +{formatAmount(amount.income)}
                  </span>
                ) : null}
                {amount?.expense ? (
                  <span className="min-w-0 break-all text-[10px] leading-3 font-semibold text-(--color-expense-red) md:truncate md:text-[13px] md:leading-4" title={`-${formatAmount(amount.expense)}`}>
                    -{formatAmount(amount.expense)}
                  </span>
                ) : null}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
