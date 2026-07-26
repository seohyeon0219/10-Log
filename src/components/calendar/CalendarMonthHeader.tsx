type CalendarMonthHeaderProps = {
  currentDate: Date
  onPrevMonth: () => void
  onNextMonth: () => void
}

const glassButtonClassName =
  'flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/65 bg-[linear-gradient(135deg,rgba(255,255,255,0.55),rgba(255,255,255,0.15)_55%)] backdrop-blur-[18px] backdrop-saturate-[180%] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),inset_0_-4px_8px_rgba(0,0,0,0.05),0_6px_16px_rgba(0,0,0,0.08)]'

export default function CalendarMonthHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
}: CalendarMonthHeaderProps) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  return (
    <header className="flex w-full items-center justify-center gap-4">
      <button type="button" className={glassButtonClassName} onClick={onPrevMonth} aria-label="이전 달">
        <MonthArrowIcon className="rotate-180" />
      </button>

      <h1 className="min-w-0 text-center text-[18px] font-extrabold text-black">
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
