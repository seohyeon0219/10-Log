import StatisticsCard from './StatisticsCard'

type MonthlyMoneySummaryProps = {
  budgetAmount: number
  remainingDays: number
  spentAmount: number
}

const formatWon = (amount: number) => `${amount.toLocaleString('ko-KR')}원`

export default function MonthlyMoneySummary({
  budgetAmount,
  remainingDays,
  spentAmount,
}: MonthlyMoneySummaryProps) {
  const remainingAmount = Math.max(budgetAmount - spentAmount, 0)
  const usagePercent = budgetAmount > 0 ? Math.min(Math.round((spentAmount / budgetAmount) * 100), 999) : 0
  const dailyRecommendedAmount = remainingDays > 0 ? Math.floor(remainingAmount / remainingDays) : 0
  const progressWidth = `${Math.min(usagePercent, 100)}%`

  return (
    <StatisticsCard>
      <p className="text-sm font-semibold text-gray-400">사용 금액</p>
      <div className="mt-2 flex items-center justify-between gap-4">
        <p className="text-[28px] font-extrabold text-black">{formatWon(spentAmount)}</p>
        {budgetAmount > 0 && (
          <span className="shrink-0 rounded-full bg-[rgba(24,99,220,0.12)] px-3 py-1.5 text-sm font-semibold text-(--color-income-blue)">
            {usagePercent}% 사용
          </span>
        )}
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/6">
        <div
          className="h-full rounded-full bg-(--color-income-blue) transition-all duration-500"
          style={{ width: progressWidth }}
        />
      </div>

      {budgetAmount > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
          <div>
            <p className="text-xs font-semibold text-gray-400">남은 기간</p>
            <p className="mt-1 text-xl font-extrabold text-black">{remainingDays}일</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400">하루 권장 사용 금액</p>
            <p className="mt-1 text-xl font-extrabold text-black">{formatWon(dailyRecommendedAmount)}</p>
          </div>
        </div>
      )}
    </StatisticsCard>
  )
}
