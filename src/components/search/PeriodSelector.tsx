import Input from '../common/Input'
import { toDateKey } from '../../utils/dateUtils'

export type Period = 'thisMonth' | 'lastMonth' | 'custom' | 'all'

const PERIODS: { label: string; value: Period }[] = [
  { label: '이번달', value: 'thisMonth' },
  { label: '지난달', value: 'lastMonth' },
  { label: '직접 선택', value: 'custom' },
  { label: '전체', value: 'all' },
]

export function getPeriodDates(
  period: Period,
  customStart: string,
  customEnd: string,
  today: string,
): { endDate: string; startDate: string } {
  const now = new Date()
  if (period === 'thisMonth') {
    const start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
    return { startDate: start, endDate: today }
  }
  if (period === 'lastMonth') {
    return {
      startDate: toDateKey(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
      endDate: toDateKey(new Date(now.getFullYear(), now.getMonth(), 0)),
    }
  }
  if (period === 'custom') {
    return { startDate: customStart, endDate: customEnd }
  }
  return { startDate: '', endDate: '' }
}

type PeriodSelectorProps = {
  customEnd: string
  customStart: string
  onCustomEndChange: (value: string) => void
  onCustomStartChange: (value: string) => void
  onPeriodChange: (period: Period) => void
  period: Period
  today: string
}

export default function PeriodSelector({
  customEnd,
  customStart,
  onCustomEndChange,
  onCustomStartChange,
  onPeriodChange,
  period,
  today,
}: PeriodSelectorProps) {
  return (
    <div className="grid gap-2">
      <span className="text-sm font-semibold text-gray-500">기간</span>
      <div className="flex flex-wrap gap-2">
        {PERIODS.map(({ label, value }) => (
          <button
            className={[
              'rounded-xl px-3.5 py-2 text-sm font-semibold transition',
              period === value
                ? 'bg-black text-white'
                : 'border border-white/60 bg-white/55 text-gray-500 hover:bg-white/70',
            ].join(' ')}
            key={value}
            onClick={() => onPeriodChange(value)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      {period === 'custom' && (
        <div className="mt-1 grid grid-cols-2 gap-3">
          <Input
            label="시작일"
            max={customEnd || today}
            onChange={(e) => onCustomStartChange(e.target.value)}
            type="date"
            value={customStart}
          />
          <Input
            label="종료일"
            max={today}
            min={customStart}
            onChange={(e) => onCustomEndChange(e.target.value)}
            type="date"
            value={customEnd}
          />
        </div>
      )}
    </div>
  )
}
