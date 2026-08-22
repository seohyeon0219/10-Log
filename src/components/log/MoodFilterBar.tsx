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

const OPTIONS: { key: keyof MoodCounts; label: string; value: Satisfaction | 'untagged' }[] = [
  { key: 'satisfied', label: '만족', value: 'satisfied' },
  { key: 'neutral', label: '보통', value: 'neutral' },
  { key: 'regret', label: '후회', value: 'regret' },
  { key: 'untagged', label: '미입력', value: 'untagged' },
]

export default function MoodFilterBar({ counts, onChange, selected }: Props) {
  return (
    <div className="flex rounded-2xl bg-black/5 p-1">
      {OPTIONS.map((option) => {
        const isActive = selected === option.value

        return (
          <button
            className={[
              'flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 transition',
              isActive ? 'bg-white shadow-sm' : '',
            ].join(' ')}
            key={option.value}
            onClick={() => onChange(isActive ? null : option.value)}
            type="button"
          >
            <span className={['text-[11px] font-bold', isActive ? 'text-black' : 'text-gray-400'].join(' ')}>
              {option.label}
            </span>
            <span className={['text-[15px] font-extrabold', isActive ? 'text-black' : 'text-gray-400'].join(' ')}>
              {counts[option.key]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
