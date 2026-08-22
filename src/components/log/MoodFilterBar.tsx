import type { Satisfaction } from '../../types/finance'
import { MOOD_COLORS } from './EmotionRateCard'

export type MoodFilter = Satisfaction | 'untagged' | null

type MoodCounts = {
  neutral: number
  regret: number
  satisfied: number
  untagged: number
}

type Props = {
  counts: MoodCounts
  onChange: (value: MoodFilter) => void
  selected: MoodFilter
}

const OPTIONS: { color: string | null; key: keyof MoodCounts | null; label: string; value: MoodFilter }[] = [
  { color: MOOD_COLORS.satisfied, key: 'satisfied', label: '만족', value: 'satisfied' },
  { color: MOOD_COLORS.neutral, key: 'neutral', label: '보통', value: 'neutral' },
  { color: MOOD_COLORS.regret, key: 'regret', label: '후회', value: 'regret' },
  { color: null, key: 'untagged', label: '미입력', value: 'untagged' },
]

export default function MoodFilterBar({ counts, onChange, selected }: Props) {
  return (
    <div className="flex rounded-2xl bg-black/5 p-1">
      {OPTIONS.map((option) => {
        const isActive = selected === option.value
        const count = option.key ? counts[option.key] : 0

        return (
          <button
            className={[
              'flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 transition',
              isActive ? 'bg-white shadow-sm' : '',
            ].join(' ')}
            key={String(option.value)}
            onClick={() => onChange(selected === option.value ? null : option.value)}
            type="button"
          >
            <span className="flex items-center gap-1">
              {option.color && (
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: option.color }} />
              )}
              <span className={['text-[11px] font-bold', isActive ? 'text-black' : 'text-gray-400'].join(' ')}>
                {option.label}
              </span>
            </span>
            <span className={['text-[14px] font-extrabold', isActive ? 'text-black' : 'text-gray-400'].join(' ')}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
