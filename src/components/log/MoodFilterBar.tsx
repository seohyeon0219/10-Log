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

const OPTIONS: { emoji: string; key: keyof MoodCounts; label: string; value: Satisfaction | 'untagged' }[] = [
  { emoji: '😊', key: 'satisfied', label: '만족', value: 'satisfied' },
  { emoji: '😐', key: 'neutral', label: '보통', value: 'neutral' },
  { emoji: '😔', key: 'regret', label: '후회', value: 'regret' },
  { emoji: '—', key: 'untagged', label: '미입력', value: 'untagged' },
]

export default function MoodFilterBar({ counts, onChange, selected }: Props) {
  return (
    <div className="flex gap-2">
      {OPTIONS.map((option) => {
        const isActive = selected === option.value
        const isUntagged = option.value === 'untagged'

        return (
          <button
            className={[
              'flex flex-1 flex-col items-center gap-1 rounded-2xl py-3 transition',
              isActive
                ? 'bg-black text-white'
                : isUntagged
                  ? 'bg-black/4 text-gray-300'
                  : 'bg-black/4 text-gray-500',
            ].join(' ')}
            key={option.value}
            onClick={() => onChange(isActive ? null : option.value)}
            type="button"
          >
            <span className="text-base leading-none">{option.emoji}</span>
            <span className={['text-[10px] font-bold leading-none', isActive ? 'text-white' : ''].join(' ')}>
              {option.label}
            </span>
            <span className={['text-[15px] font-extrabold leading-none', isActive ? 'text-white' : 'text-black'].join(' ')}>
              {counts[option.key]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
