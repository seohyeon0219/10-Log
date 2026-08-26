import type { Satisfaction } from '../../types/finance'

type Props = {
  className?: string
  size?: number
  value: Satisfaction | null
}

export default function SatisfactionIcon({ className, size = 20, value }: Props) {
  const cx = 12
  const cy = 12
  const r = 9

  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {value === null && (
        <circle
          cx={cx}
          cy={cy}
          r={r}
          stroke="currentColor"
          strokeDasharray="3.5 2.5"
          strokeLinecap="round"
          strokeWidth={1.5}
        />
      )}
      {value === 'regret' && (
        <circle cx={cx} cy={cy} r={r} stroke="currentColor" strokeWidth={1.5} />
      )}
      {value === 'neutral' && (
        <>
          <circle cx={cx} cy={cy} r={r} stroke="currentColor" strokeWidth={1.5} />
          <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy} Z`} fill="currentColor" />
        </>
      )}
      {value === 'satisfied' && (
        <circle cx={cx} cy={cy} r={r} fill="currentColor" />
      )}
    </svg>
  )
}
