export const MOOD_COLORS = {
  satisfied: '#22c55e',
  neutral:   '#fbbf24',
  regret:    '#a855f7',
} as const

export const MOOD_LABELS = {
  satisfied: '만족',
  neutral:   '보통',
  regret:    '후회',
} as const

type MoodCounts = {
  neutral: number
  regret: number
  satisfied: number
  untagged: number
}

type Props = {
  counts: MoodCounts
}

const MOOD_KEYS = ['satisfied', 'neutral', 'regret'] as const

export default function EmotionRateCard({ counts }: Props) {
  const tagged = counts.satisfied + counts.neutral + counts.regret
  const total = tagged + counts.untagged
  const rate = total > 0 ? Math.round((tagged / total) * 100) : 0

  return (
    <div className="rounded-[22px] glass-card p-5 shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-bold text-black">감정 기록률</p>
        <p className="text-[13px] font-extrabold text-black">{rate}%</p>
      </div>

      <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-black/8">
        {MOOD_KEYS.map((key) =>
          counts[key] > 0 && total > 0 ? (
            <div
              key={key}
              style={{ width: `${(counts[key] / total) * 100}%`, background: MOOD_COLORS[key] }}
            />
          ) : null
        )}
      </div>

      <div className="mt-2.5 flex gap-4">
        {MOOD_KEYS.map((key) => (
          <span key={key} className="flex items-center gap-1 text-[11px] font-semibold text-gray-500">
            <span className="h-2 w-2 rounded-full" style={{ background: MOOD_COLORS[key] }} />
            {MOOD_LABELS[key]} {counts[key]}
          </span>
        ))}
      </div>
    </div>
  )
}
