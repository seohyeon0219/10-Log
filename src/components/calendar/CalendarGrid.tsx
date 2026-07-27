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

const weekDays = ['일', '월', '화', '수', '목', '금', '토']
const saturdayIndex = 6
const sundayIndex = 0

const formatAmountShort = (amount: number) => `${Math.round(amount / 1000)}k`

const cn = (...classNames: string[]) => classNames.filter(Boolean).join(' ')

const toDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const getCalendarDays = (currentDate: Date): CalendarDay[] => {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDate = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOffset = firstDate.getDay()
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

const getDateTextClassName = (day: CalendarDay) => {
  if (!day.isCurrentMonth) return 'text-(--color-gray)'
  if (day.weekDayIndex === sundayIndex) return 'text-(--color-expense-red)'
  if (day.weekDayIndex === saturdayIndex) return 'text-(--color-income-blue)'

  return 'text-black'
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
    <section className="overflow-hidden rounded-[22px] border border-white/60 bg-white/40 backdrop-blur-[20px] backdrop-saturate-170 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-7 px-2 pb-1 pt-4">
        {weekDays.map((weekDay) => (
          <div
            key={weekDay}
            className="text-center text-[11px] font-extrabold text-(--color-text-sand)"
          >
            {weekDay}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 px-2 pb-3">
        {calendarDays.map((day) => {
          const amount = amountByDate.get(day.dateKey)
          const isSelected = day.dateKey === selectedDateKey

          return (
            <button
              key={day.dateKey}
              type="button"
              className={cn(
                'flex aspect-square min-w-0 cursor-pointer flex-col items-start rounded-xl p-1 text-left transition-all',
                isSelected ? 'bg-[rgba(22,21,18,0.09)]' : '',
              )}
              onClick={() => onDateSelect?.(day.date)}
            >
              <span className={cn('text-sm font-semibold', getDateTextClassName(day))}>
                {day.date.getDate()}
              </span>

              <span className="mt-auto grid w-full min-w-0 gap-0.5">
                {amount?.income ? (
                  <span className="min-w-0 truncate text-[10px] font-semibold leading-3 text-(--color-income-blue)">
                    +{formatAmountShort(amount.income)}
                  </span>
                ) : null}
                {amount?.expense ? (
                  <span className="min-w-0 truncate text-[10px] font-semibold leading-3 text-(--color-expense-red)">
                    -{formatAmountShort(amount.expense)}
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
