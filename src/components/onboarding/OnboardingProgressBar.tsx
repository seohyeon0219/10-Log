type Props = {
  current: number
  total: number
}

export default function OnboardingProgressBar({ current, total }: Props) {
  return (
    <div className="flex gap-1.5 px-6 pt-safe-top">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="h-0.5 flex-1 overflow-hidden rounded-full bg-black/10">
          <div
            className="h-full rounded-full bg-black/50 transition-all duration-500"
            style={{ width: i <= current ? '100%' : '0%' }}
          />
        </div>
      ))}
    </div>
  )
}
