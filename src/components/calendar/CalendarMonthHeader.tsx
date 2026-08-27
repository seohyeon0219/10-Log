type CalendarMonthHeaderProps = {
  currentDate: Date
  onPrevMonth: () => void
  onNextMonth: () => void
}

const glassButtonClassName =
  'flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition active:opacity-50'

export default function CalendarMonthHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
}: CalendarMonthHeaderProps) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  return (
    <header className="flex h-12 w-full items-center justify-between">
      <button type="button" className={glassButtonClassName} onClick={onPrevMonth} aria-label="이전 달">
        <MonthArrowIcon className="rotate-180" />
      </button>

      <h1 className="min-w-0 text-center text-[18px] font-extrabold text-(--ink-1)">
        {year}년 {month}월
      </h1>

      <button type="button" className={glassButtonClassName} onClick={onNextMonth} aria-label="다음 달">
        <MonthArrowIcon />
      </button>
    </header>
  )
}

type MonthArrowIconProps = {
  className?: string
}

function MonthArrowIcon({ className = '' }: MonthArrowIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="7"
      height="12"
      viewBox="0 0 7 12"
      fill="none"
    >
      <path
        d="M1 1L6 6L1 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
