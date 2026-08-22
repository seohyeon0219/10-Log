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

const OPTIONS: { color: string | null; key: keyof MoodCounts; label: string; value: Satisfaction | 'untagged' }[] = [
  { color: '#22c55e', key: 'satisfied', label: '만족', value: 'satisfied' },
  { color: '#9ca3af', key: 'neutral', label: '보통', value: 'neutral' },
  { color: '#f97316', key: 'regret', label: '후회', value: 'regret' },
  { color: null, key: 'untagged', label: '미입력', value: 'untagged' },
]

export default function MoodFilterBar({ counts, onChange, selected }: Props) {
  return (
    <div className="flex gap-2">
      {OPTIONS.map((option) => {
        const isActive = selected === option.value

        return (
          <button
            className={[
              'flex flex-1 flex-col items-center gap-1.5 rounded-2xl py-3 transition',
              isActive ? 'bg-white shadow-sm' : 'bg-black/4',
            ].join(' ')}
            key={option.value}
            onClick={() => onChange(isActive ? null : option.value)}
            type="button"
          >
            {option.color ? (
              <span
                className={['h-5 w-5 rounded-full transition-all', isActive ? 'scale-110' : 'opacity-50'].join(' ')}
                style={{
                  background: option.color,
                  boxShadow: isActive ? `0 0 0 2px white, 0 0 0 3.5px ${option.color}` : 'none',
                }}
              />
            ) : (
              <span className={['h-5 w-5 rounded-full border-2 border-dashed transition-all', isActive ? 'border-gray-400' : 'border-gray-300'].join(' ')} />
            )}
            <span className={['text-[10px] font-bold', isActive ? 'text-black' : 'text-gray-400'].join(' ')}>
              {option.label}
            </span>
            <span className={['text-[14px] font-extrabold leading-none', isActive ? 'text-black' : 'text-gray-400'].join(' ')}>
              {counts[option.key]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
