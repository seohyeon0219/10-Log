import type { ReactNode } from 'react'
import StatisticsCard from './StatisticsCard'

type MonthlyMoneySummaryProps = {
  action?: ReactNode
  budgetAmount: number
  budgetEmptySlot?: ReactNode
  eyebrow?: string
  remainingDays: number
  showRemainingBudget?: boolean
  spentAmount: number
}

const formatWon = (amount: number) => `${amount.toLocaleString('ko-KR')}원`

export default function MonthlyMoneySummary({
  action,
  budgetAmount,
  budgetEmptySlot,
  eyebrow,
  remainingDays,
  showRemainingBudget = false,
  spentAmount,
}: MonthlyMoneySummaryProps) {
  const netRemaining = budgetAmount - spentAmount
  const remainingAmount = Math.max(netRemaining, 0)
  const isOverBudget = netRemaining < 0
  const usagePercent = budgetAmount > 0 ? Math.min(Math.round((spentAmount / budgetAmount) * 100), 999) : 0
  const dailyRecommendedAmount = remainingDays > 0 && remainingAmount > 0
    ? Math.floor(remainingAmount / remainingDays)
    : 0
  const progressWidth = `${Math.min(usagePercent, 100)}%`

  return (
    <StatisticsCard action={showRemainingBudget ? undefined : action} eyebrow={eyebrow}>
      {showRemainingBudget ? (
        <>
          <p className="text-sm font-semibold text-gray-400">남은 예산</p>
          {budgetAmount === 0 && budgetEmptySlot ? (
            <div className="mt-2">{budgetEmptySlot}</div>
          ) : (
            <div className="mt-2 flex items-center justify-between gap-3">
              <p
                className={[
                  'text-[28px] font-extrabold',
                  isOverBudget ? 'text-(--color-expense-red)' : 'text-black',
                ].join(' ')}
              >
                {isOverBudget ? '−' : ''}{formatWon(Math.abs(netRemaining))}
              </p>
              {action && <div className="shrink-0">{action}</div>}
            </div>
          )}
        </>
      ) : (
        <>
          <p className="text-sm font-semibold text-gray-400">사용 금액</p>
          <div className="mt-2 flex items-center justify-between gap-4">
            <p className="text-[28px] font-extrabold text-black">{formatWon(spentAmount)}</p>
            {budgetAmount > 0 && (
              <span className="shrink-0 rounded-full bg-[rgba(24,99,220,0.12)] px-3 py-1.5 text-sm font-semibold text-(--color-income-blue)">
                {usagePercent}% 사용
              </span>
            )}
          </div>
        </>
      )}

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/6">
        <div
          className={[
            'h-full rounded-full transition-all duration-500',
            isOverBudget ? 'bg-(--color-expense-red)' : 'bg-(--color-income-blue)',
          ].join(' ')}
          style={{ width: progressWidth }}
        />
      </div>

      {showRemainingBudget ? (
        <>
          <p className="mt-2 text-xs font-semibold text-gray-400">
            {formatWon(spentAmount)} 사용 · {usagePercent}%
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-black/6 pt-4">
            <div>
              <p className="text-xs font-semibold text-gray-400">남은 기간</p>
              <p className="mt-1 text-xl font-extrabold text-black">{remainingDays}일</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400">하루 권장 사용 금액</p>
              <p className="mt-1 text-xl font-extrabold text-black">
                {dailyRecommendedAmount > 0 ? formatWon(dailyRecommendedAmount) : '—'}
              </p>
            </div>
          </div>
        </>
      ) : (
        budgetAmount > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-black/6 pt-4">
            <div>
              <p className="text-xs font-semibold text-gray-400">남은 기간</p>
              <p className="mt-1 text-xl font-extrabold text-black">{remainingDays}일</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400">하루 권장 사용 금액</p>
              <p className="mt-1 text-xl font-extrabold text-black">{formatWon(dailyRecommendedAmount)}</p>
            </div>
          </div>
        )
      )}
    </StatisticsCard>
  )
}
