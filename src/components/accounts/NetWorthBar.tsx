type Props = { assets: number; liabilities: number }

export default function NetWorthBar({ assets, liabilities }: Props) {
  const total = assets + liabilities
  const assetPct = total > 0 ? Math.round((assets / total) * 100) : 0
  const liabilityPct = 100 - assetPct

  const netWorth = assets - liabilities
  const equityRatio = assets > 0 ? Math.max(0, Math.min(100, Math.round((netWorth / assets) * 100))) : 0
  const label = assets === 0 ? '부채만 있어요' : `자산의 ${equityRatio}%만큼 내 것이에요`

  return (
    <div className="mt-3">
      <div className="flex h-2 overflow-hidden rounded-full">
        {assetPct > 0 && (
          <div
            className="h-full bg-(--color-income-blue)/40 transition-all duration-500"
            style={{ width: `${assetPct}%`, borderRadius: liabilityPct > 0 ? '9999px 0 0 9999px' : '9999px' }}
          />
        )}
        {liabilityPct > 0 && (
          <div
            className="h-full bg-(--color-expense-red)/40 transition-all duration-500"
            style={{ width: `${liabilityPct}%`, borderRadius: assetPct > 0 ? '0 9999px 9999px 0' : '9999px', marginLeft: assetPct > 0 ? '2px' : 0 }}
          />
        )}
      </div>
      <p className="mt-1.5 text-[11px] font-semibold text-gray-400">{label}</p>
    </div>
  )
}
