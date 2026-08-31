import { useMemo, useState } from 'react'
import SatisfactionIcon from '../common/SatisfactionIcon'
import type { Satisfaction, Transaction } from '../../types/finance'
import { formatMonthDay, formatWon } from '../../utils/formatters'
import { MOOD_LABELS } from './EmotionRateCard'

const SATISFACTION_OPTIONS: Satisfaction[] = ['satisfied', 'neutral', 'regret']

const rowStyle = {
  background: 'rgba(255,255,255,0.62)',
  border: '1px solid rgba(255,255,255,0.92)',
  boxShadow: '0 6px 16px rgba(90,75,40,0.05), inset 0 1px 0 rgba(255,255,255,0.9)',
  backdropFilter: 'blur(22px) saturate(140%)',
  WebkitBackdropFilter: 'blur(22px) saturate(140%)',
}

type Props = {
  emptyCount: number
  onQuickTag: (txId: string, satisfaction: Satisfaction) => void
  transactions: Transaction[]
}

export default function LogTransactionList({ emptyCount, onQuickTag, transactions }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const grouped = useMemo(() => {
    const map = new Map<string, Transaction[]>()
    for (const tx of transactions) {
      if (!map.has(tx.date)) map.set(tx.date, [])
      map.get(tx.date)!.push(tx)
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]))
  }, [transactions])

  const isEmpty = transactions.length === 0 && emptyCount === 0

  if (isEmpty) {
    return (
      <div className="rounded-[26px] glass-card p-5">
        <div className="py-10 text-center">
          <p className="text-sm font-semibold text-(--ink-3)">이번 달 기록이 없어요</p>
          <p className="mt-1 text-[13px] text-(--ink-3)">지출·수입을 기록하면 여기서 감정을 확인할 수 있어요.</p>
        </div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-[26px] glass-card p-5">
        <p className="py-6 text-center text-sm font-semibold text-(--ink-3)">해당 감정의 거래가 없어요</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {grouped.map(([date, txs]) => {
        const dayNet = txs.reduce((s, t) => t.type === 'income' ? s + t.amount : s - t.amount, 0)
        return (
          <div key={date}>
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-[12px] font-semibold text-(--ink-2)">{formatMonthDay(date)}</span>
              <span className={['text-[12px] font-semibold tabular-nums', dayNet >= 0 ? 'text-(--color-income-blue)' : 'text-(--color-expense-red)'].join(' ')}>
                {dayNet >= 0 ? `+${formatWon(dayNet)}` : `-${formatWon(Math.abs(dayNet))}`}
              </span>
            </div>

            <div className="grid gap-2">
              {txs.map((tx) => {
                const isExpanded = expandedId === tx.id
                return (
                  <div className="min-w-0" key={tx.id}>
                    <button
                      className="flex w-full items-center gap-[10px] rounded-[16px] px-[13px] py-[11px] text-left transition hover:brightness-95"
                      onClick={() => setExpandedId(isExpanded ? null : tx.id)}
                      style={rowStyle}
                      type="button"
                    >
                      <span
                        className="max-w-[30%] shrink-0 truncate rounded-full px-2.5 py-1 text-[11px] font-semibold"
                        style={{ background: `${tx.categoryColor}22`, color: tx.categoryColor }}
                      >
                        {tx.categoryName}
                      </span>
                      <span className="min-w-0 flex-1">
                        {tx.memo ? (
                          <span className="block truncate text-[14px] font-semibold text-(--ink-1)">{tx.memo}</span>
                        ) : (
                          <span className="block text-[14px] font-semibold text-(--ink-3)">메모 없음</span>
                        )}
                      </span>
                      <span className="flex shrink-0 items-center gap-2">
                        <span className={['text-[14px] font-semibold tabular-nums', tx.type === 'income' ? 'text-(--color-income-blue)' : 'text-(--ink-1)'].join(' ')}>
                          {tx.type === 'income' ? '+' : ''}{formatWon(tx.amount)}
                        </span>
                        <SatisfactionIcon
                          className={tx.satisfaction ? 'text-(--ink-2)' : 'text-(--ink-3)'}
                          size={14}
                          value={tx.satisfaction}
                        />
                      </span>
                    </button>

                    <div className={['grid transition-all duration-200', isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'].join(' ')}>
                      <div className="overflow-hidden">
                        <div className="flex gap-2 rounded-b-[14px] bg-white/20 px-4 pb-3.5 pt-2">
                          {SATISFACTION_OPTIONS.map((v) => {
                            const isSelected = tx.satisfaction === v
                            return (
                              <button
                                className={['flex flex-1 flex-col items-center gap-1.5 rounded-xl py-2.5 transition active:scale-95', isSelected ? 'bg-black/8' : 'bg-black/4'].join(' ')}
                                key={v}
                                onClick={() => { onQuickTag(tx.id, v); setExpandedId(null) }}
                                type="button"
                              >
                                <SatisfactionIcon
                                  className={isSelected ? 'text-(--ink-1)' : 'text-(--ink-3)'}
                                  size={20}
                                  value={v}
                                />
                                <span className={['text-[11px] font-bold', isSelected ? 'text-(--ink-1)' : 'text-(--ink-3)'].join(' ')}>
                                  {MOOD_LABELS[v]}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
