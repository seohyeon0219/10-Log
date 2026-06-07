import { useMemo } from 'react'
import { getBudgetStatus, getRandomMessage } from '../../constants/budgetMessages'
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
  const budgetStatus = getBudgetStatus(spentAmount, budgetAmount)
  const reviewText = useMemo(() => getRandomMessage(budgetStatus), [budgetStatus])

  return (
    <StatisticsCard eyebrow="이번 달 한줄 평" title={reviewText} titleClassName="text-xl leading-7 font-bold text-gray-800">

      <div className="mt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-(--color-dark-gray)">사용 금액</p>
            <p className="mt-1 text-3xl font-extrabold text-black">{formatWon(spentAmount)}</p>
          </div>
          <p className="pb-1 text-sm font-bold text-(--color-income-blue)">{usagePercent}% 사용</p>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-(--color-income-blue)" style={{ width: progressWidth }} />
        </div>

        <p className="mt-3 text-sm font-medium leading-6 text-(--color-dark-gray)">
          현재 {formatWon(spentAmount)} / {formatWon(budgetAmount)}을 사용하여 예산의 {usagePercent}%를 사용했습니다.
        </p>
      </div>

      <dl className="mt-6 grid grid-cols-3 gap-3 max-sm:grid-cols-1">
        <div className="rounded-lg bg-gray-50 p-4">
          <dt className="text-sm font-semibold text-(--color-dark-gray)">남은 예산</dt>
          <dd className="mt-2 text-lg font-extrabold text-black">{formatWon(remainingAmount)}</dd>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <dt className="text-sm font-semibold text-(--color-dark-gray)">남은 기간</dt>
          <dd className="mt-2 text-lg font-extrabold text-black">{remainingDays}일</dd>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <dt className="text-sm font-semibold text-(--color-dark-gray)">하루 권장 사용 금액</dt>
          <dd className="mt-2 text-lg font-extrabold text-black">{formatWon(dailyRecommendedAmount)}</dd>
        </div>
      </dl>
    </StatisticsCard>
  )
}
