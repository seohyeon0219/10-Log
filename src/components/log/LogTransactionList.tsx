import { useState } from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import SatisfactionIcon from '../common/SatisfactionIcon'
import type { Satisfaction, Transaction } from '../../types/finance'
import { formatMonthDay, formatWon } from '../../utils/formatters'
import { MOOD_LABELS } from './EmotionRateCard'

const SATISFACTION_OPTIONS: Satisfaction[] = ['satisfied', 'neutral', 'regret']

type Props = {
  onQuickTag: (txId: string, satisfaction: Satisfaction) => void
  onTagUntagged: () => void
  transactions: Transaction[]
  untaggedCount: number
}

export default function LogTransactionList({
  onQuickTag,
  onTagUntagged,
  transactions,
  untaggedCount,
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const isEmpty = transactions.length === 0 && untaggedCount === 0

  if (isEmpty) {
    return (
      <div className="rounded-[22px] glass-card p-5 shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
        <div className="py-10 text-center">
          <p className="text-sm font-semibold text-gray-400">이번 달 기록이 없어요</p>
          <p className="mt-1 text-[13px] text-gray-300">지출·수입을 기록하면 여기서 감정을 확인할 수 있어요.</p>
        </div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-[22px] glass-card p-5 shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
        <p className="py-6 text-center text-sm font-semibold text-gray-400">해당 감정의 거래가 없어요</p>
      </div>
    )
  }

  return (
    <div className="grid gap-2">
      {untaggedCount > 0 && (
        <button
          className="flex w-full items-center gap-3 rounded-[22px] border-2 border-dashed border-gray-200 px-4 py-3.5 text-left transition hover:border-gray-300 hover:bg-black/3"
          onClick={onTagUntagged}
          type="button"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-[13px] font-bold text-gray-400">
            ?
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-gray-700">
              감정을 아직 안 남긴 내역 {untaggedCount}건
            </span>
            <span className="block text-[12px] text-gray-400">
              지금 기록하면 이번 달 소비 패턴을 볼 수 있어요
            </span>
          </span>
          <ChevronRightIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-gray-300" />
        </button>
      )}

      {transactions.map((tx) => {
        const isExpanded = expandedId === tx.id

        return (
          <div key={tx.id}>
            {/* glass-card에는 버튼만 — overflow-hidden 자손 없음 (iOS 합성 레이어 충돌 방지) */}
            <div className="rounded-[22px] glass-card shadow-[0_4px_14px_rgba(0,0,0,0.05)]">
              <button
                className="flex h-14 w-full items-center gap-3 px-4 text-left transition hover:bg-white/60"
                onClick={() => setExpandedId(isExpanded ? null : tx.id)}
                type="button"
              >
                <span
                  className="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold"
                  style={{ background: `${tx.categoryColor}22`, color: tx.categoryColor }}
                >
                  {tx.categoryName}
                </span>

                <span className="min-w-0 flex-1">
                  {tx.memo ? (
                    <span className="block truncate text-sm font-medium text-medium">{tx.memo}</span>
                  ) : (
                    <span className="block text-sm font-medium text-gray-300">메모 없음</span>
                  )}
                  <span className="block text-xs text-gray-400">{formatMonthDay(tx.date)}</span>
                </span>

                <span className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-semibold tabular-nums text-gray-800">
                    {tx.type === 'income' ? '+' : '-'}{formatWon(tx.amount)}
                  </span>
                  <SatisfactionIcon
                    className={tx.satisfaction ? 'text-gray-500' : 'text-gray-300'}
                    size={14}
                    value={tx.satisfaction}
                  />
                </span>
              </button>
            </div>

            {/* 아코디언 패널 — glass-card 바깥에 위치해 overflow-hidden이 backdrop-filter 조상을 갖지 않음 */}
            <div className={['grid transition-all duration-200', isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'].join(' ')}>
              <div className="overflow-hidden">
                <div className="flex gap-2 rounded-b-[22px] bg-white/20 px-4 pb-3.5 pt-2">
                  {SATISFACTION_OPTIONS.map((v) => {
                    const isSelected = tx.satisfaction === v
                    return (
                      <button
                        className={[
                          'flex flex-1 flex-col items-center gap-1.5 rounded-xl py-2.5 transition active:scale-95',
                          isSelected ? 'bg-black/8' : 'bg-black/4',
                        ].join(' ')}
                        key={v}
                        onClick={() => { onQuickTag(tx.id, v); setExpandedId(null) }}
                        type="button"
                      >
                        <SatisfactionIcon
                          className={isSelected ? 'text-black' : 'text-gray-300'}
                          size={20}
                          value={v}
                        />
                        <span className={['text-[11px] font-bold', isSelected ? 'text-black' : 'text-gray-400'].join(' ')}>
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
  )
}
