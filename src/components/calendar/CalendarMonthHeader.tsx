type CalendarMonthHeaderProps = {
  currentDate: Date
  onPrevMonth: () => void
  onNextMonth: () => void
}

const glassButtonStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  border: '1px solid rgba(255,255,255,0.65)',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,255,255,0.15) 55%)',
  backdropFilter: 'blur(18px) saturate(180%)',
  WebkitBackdropFilter: 'blur(18px) saturate(180%)',
  boxShadow:
    'inset 0 1px 1px rgba(255,255,255,0.85), inset 0 -4px 8px rgba(0,0,0,0.05), 0 6px 16px rgba(0,0,0,0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  flexShrink: 0,
}

export default function CalendarMonthHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
}: CalendarMonthHeaderProps) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  return (
    <header className="flex w-full items-center justify-center gap-4">
      <button type="button" style={glassButtonStyle} onClick={onPrevMonth} aria-label="이전 달">
        <MonthArrowIcon className="rotate-180" />
      </button>

      <h1 className="min-w-0 text-center text-black" style={{ fontSize: '18px', fontWeight: 800 }}>
        {year}년 {month}월
      </h1>

      <button type="button" style={glassButtonStyle} onClick={onNextMonth} aria-label="다음 달">
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
