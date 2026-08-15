import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import StatisticsCard from './StatisticsCard'
import { formatWon } from '../../utils/formatters'

type MonthlyMoneySummaryProps = {
  action?: ReactNode
  budgetAmount: number
  eyebrow?: string
  onTopClick?: () => void
  remainingDays?: number
  showRemainingBudget?: boolean
  spentAmount: number
}

export default function MonthlyMoneySummary({
  action,
  budgetAmount,
  eyebrow,
  onTopClick,
  remainingDays = 0,
  showRemainingBudget = false,
  spentAmount,
}: MonthlyMoneySummaryProps) {
  const { netRemaining, isOverBudget, dailyRecommendedAmount, progressWidth, isEmpty } = useMemo(() => {
    const net = budgetAmount - spentAmount
    const remaining = Math.max(net, 0)
    const percent = budgetAmount > 0 ? Math.min(Math.round((spentAmount / budgetAmount) * 100), 999) : 0
    return {
      netRemaining: net,
      isOverBudget: net < 0,
      usagePercent: percent,
      dailyRecommendedAmount: remainingDays > 0 && remaining > 0 ? Math.floor(remaining / remainingDays) : 0,
      progressWidth: `${Math.min(percent, 100)}%`,
      isEmpty: showRemainingBudget && budgetAmount === 0,
    }
  }, [budgetAmount, spentAmount, remainingDays, showRemainingBudget])

  const cardContent = showRemainingBudget ? (
    <>
      <p className="text-sm font-semibold text-gray-400">남은 예산</p>
      {budgetAmount === 0 ? (
        <>
          <p className="mt-2 text-[28px] font-extrabold text-black/25">—</p>
          <p className="mt-1.5 flex items-center gap-0.5 text-xs font-semibold text-black/30">
            탭해서 예산을 설정해보세요
            <ChevronRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
          </p>
        </>
      ) : (
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className={['text-[28px] font-extrabold', isOverBudget ? 'text-(--color-expense-red)' : 'text-black'].join(' ')}>
            {isOverBudget ? '−' : ''}{formatWon(Math.abs(netRemaining))}
          </p>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/6">
        <div
          className={['h-full rounded-full transition-all duration-500', isOverBudget ? 'bg-(--color-expense-red)' : 'bg-(--color-income-blue)'].join(' ')}
          style={{ width: progressWidth }}
        />
      </div>
      {budgetAmount > 0 && (
        <p className="mt-2 text-xs font-semibold text-gray-400">
          총 {formatWon(budgetAmount)}
        </p>
      )}
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
    <>
      <p className="text-sm font-semibold text-gray-400">사용 금액</p>
      <p className="mt-2 text-[28px] font-extrabold text-black">{formatWon(spentAmount)}</p>
    </>
  )

  return (
    <StatisticsCard action={showRemainingBudget ? undefined : action} className={isEmpty ? 'animate-card-breathe' : ''} eyebrow={eyebrow}>
      {showRemainingBudget && onTopClick ? (
        <button className="w-full text-left transition active:opacity-60" onClick={onTopClick} type="button">
          {cardContent}
        </button>
      ) : (
        cardContent
      )}
    </StatisticsCard>
  )
}
