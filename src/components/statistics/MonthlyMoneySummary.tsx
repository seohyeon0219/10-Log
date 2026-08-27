import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import StatisticsCard from './StatisticsCard'
import { THEME_ACCENT, useThemeStore } from '../../stores/themeStore'
import { formatAmount, formatWon } from '../../utils/formatters'

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
  const theme = useThemeStore((state) => state.theme)
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
      {/* M1: 필드 라벨 → label(12/500) */}
      <p className="text-xs font-medium text-(--ink-3)">남은 예산</p>
      {budgetAmount === 0 ? (
        <>
          {/* M2 empty: display(36/600), ink-3 for placeholder */}
          <p className="mt-2 text-[36px] font-semibold leading-none text-(--ink-3)">—</p>
          {/* M3: caption(12/500), ink-3 */}
          <p className="mt-1.5 flex items-center gap-0.5 text-xs font-medium text-(--ink-3)">
            탭해서 예산을 설정해보세요
            <ChevronRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
          </p>
        </>
      ) : (
        <div className="mt-2 flex items-center justify-between gap-3">
          {/* M2: display(36/600) */}
          <p className={['text-[36px] font-semibold leading-none', isOverBudget ? 'text-(--color-expense-red)' : 'text-(--ink-1)'].join(' ')}>
            {isOverBudget ? '−' : ''}{formatWon(Math.abs(netRemaining))}
          </p>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/6">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: progressWidth, background: isOverBudget ? 'var(--color-expense-red)' : THEME_ACCENT[theme] }}
        />
      </div>
      {/* M8: caption(12/500) */}
      {budgetAmount > 0 && (
        <p className="mt-2 text-xs font-medium text-(--ink-3)">
          총 {formatWon(budgetAmount)}
        </p>
      )}
      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-black/6 pt-4">
        <div>
          {/* M6: caption(12/500) */}
          <p className="text-xs font-medium text-(--ink-3)">남은 기간</p>
          {/* M4: value-lg(22/600) */}
          <p className="mt-1 flex items-baseline gap-0.5">
            <span className="text-[22px] font-semibold leading-none text-(--ink-1)">{remainingDays}</span>
            <span className="text-xs font-medium text-(--ink-3)">일</span>
          </p>
        </div>
        <div>
          {/* M7: caption(12/500) */}
          <p className="text-xs font-medium text-(--ink-3)">하루 권장 사용 금액</p>
          {/* M5: value-lg(22/600) */}
          <p className="mt-1 flex items-baseline gap-0.5">
            <span className="text-[22px] font-semibold leading-none text-(--ink-1)">
              {dailyRecommendedAmount > 0 ? formatAmount(dailyRecommendedAmount) : '—'}
            </span>
            {dailyRecommendedAmount > 0 && <span className="text-xs font-medium text-(--ink-3)">원</span>}
          </p>
        </div>
      </div>
    </>
  ) : (
    <>
      <p className="text-xs font-medium text-(--ink-3)">사용 금액</p>
      <p className="mt-2 text-[36px] font-semibold leading-none text-(--ink-1)">{formatWon(spentAmount)}</p>
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
