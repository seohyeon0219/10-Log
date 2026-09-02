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

const OPTIONS: { key: keyof MoodCounts; label: string; value: MoodFilter }[] = [
  { key: 'satisfied', label: '만족', value: 'satisfied' },
  { key: 'neutral', label: '보통', value: 'neutral' },
  { key: 'regret', label: '후회', value: 'regret' },
]

export default function MoodFilterBar({ counts, onChange, selected }: Props) {
  return (
    <div className="flex min-w-0 rounded-2xl bg-black/5 p-1">
      {OPTIONS.map((option) => {
        const isActive = selected === option.value
        const count = counts[option.key]

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
            <span className={['text-[11px] font-bold', isActive ? 'text-(--ink-1)' : 'text-(--ink-3)'].join(' ')}>
              {option.label}
            </span>
            <span className={['text-[14px] font-extrabold', isActive ? 'text-(--ink-1)' : 'text-(--ink-3)'].join(' ')}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
