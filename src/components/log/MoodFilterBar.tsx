import type { Satisfaction } from '../../types/finance'

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
  { color: null, key: null, label: '전체', value: null },
  { color: '#22c55e', key: 'satisfied', label: '만족', value: 'satisfied' },
  { color: '#9ca3af', key: 'neutral', label: '보통', value: 'neutral' },
  { color: '#f97316', key: 'regret', label: '후회', value: 'regret' },
  { color: null, key: 'untagged', label: '미입력', value: 'untagged' },
]

const total = (counts: MoodCounts) => counts.satisfied + counts.neutral + counts.regret + counts.untagged

export default function MoodFilterBar({ counts, onChange, selected }: Props) {
  return (
    <div className="flex rounded-2xl bg-black/5 p-1">
      {OPTIONS.map((option) => {
        const isActive = selected === option.value
        const count = option.key ? counts[option.key] : total(counts)

        return (
          <button
            className={[
              'flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 transition',
              isActive ? 'bg-white shadow-sm' : '',
            ].join(' ')}
            key={String(option.value)}
            onClick={() => onChange(option.value)}
            type="button"
          >
            <span className="flex items-center gap-1">
              {option.color && (
                <span className="h-2 w-2 rounded-full" style={{ background: option.color }} />
              )}
              <span className={['text-[11px] font-bold', isActive ? 'text-black' : 'text-gray-400'].join(' ')}>
                {option.label}
              </span>
            </span>
            <span className={['text-[15px] font-extrabold', isActive ? 'text-black' : 'text-gray-400'].join(' ')}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
