type CalendarMonthHeaderProps = {
  currentDate: Date
  onPrevMonth: () => void
  onNextMonth: () => void
}

export default function CalendarMonthHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
}: CalendarMonthHeaderProps) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  return (
    <header className="flex w-full items-center justify-center gap-4 px-2 py-4">
      <button
        type="button"
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center"
        onClick={onPrevMonth}
        aria-label="이전 달"
      >
        <svg
          aria-hidden="true"
          className="rotate-180"
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
      </button>

      <h1 className="min-w-0 text-center text-lg font-bold text-gray-950">
        {year}년 {month}월
      </h1>

      <button
        type="button"
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center"
        onClick={onNextMonth}
        aria-label="다음 달"
      >
        <svg aria-hidden="true" width="7" height="12" viewBox="0 0 7 12" fill="none">
          <path
            d="M1 1L6 6L1 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </header>
  )
}
