type Props = { assets: number; liabilities: number }

export default function NetWorthBar({ assets, liabilities }: Props) {
  const netWorth = assets - liabilities
  const equityRatio = assets > 0 ? Math.max(0, Math.min(100, Math.round((netWorth / assets) * 100))) : 0
  const label = assets === 0 ? '부채만 있어요' : `${equityRatio}%만큼 내 자산이에요`

  return (
    <div className="mt-3">
      <div className="h-1.5 overflow-hidden rounded-full bg-black/6">
        <div
          className="h-full rounded-full bg-black/40 transition-all duration-500"
          style={{ width: `${equityRatio}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs font-semibold text-gray-400">{label}</p>
    </div>
  )
}
