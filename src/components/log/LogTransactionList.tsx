import { ChevronRightIcon } from '@heroicons/react/24/outline'
import type { Transaction } from '../../types/finance'
import { formatMonthDay, formatWon } from '../../utils/formatters'
import { MOOD_COLORS, MOOD_LABELS } from './EmotionRateCard'

type Props = {
  onSelectTransaction: (tx: Transaction) => void
  onTagUntagged: () => void
  transactions: Transaction[]
  untaggedCount: number
}

export default function LogTransactionList({
  onSelectTransaction,
  onTagUntagged,
  transactions,
  untaggedCount,
}: Props) {
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
            <span className="block text-[13.5px] font-bold text-gray-700">
              감정을 아직 안 남긴 내역 {untaggedCount}건
            </span>
            <span className="block text-[12px] text-gray-400">
              지금 기록하면 이번 달 소비 패턴을 볼 수 있어요
            </span>
          </span>
          <ChevronRightIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-gray-300" />
        </button>
      )}

      <div className="overflow-hidden rounded-[22px] glass-card shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
        <div className="divide-y divide-black/4">
          {transactions.map((tx) => {
            const moodColor = tx.satisfaction ? MOOD_COLORS[tx.satisfaction] : null

            return (
              <button
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-black/4"
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                type="button"
              >
                {/* 카테고리 뱃지 */}
                <span
                  className="shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-bold"
                  style={{
                    background: `${tx.categoryColor}22`,
                    color: tx.categoryColor,
                  }}
                >
                  {tx.categoryName}
                </span>

                {/* 메모 + 날짜·감정 */}
                <span className="min-w-0 flex-1">
                  {tx.memo ? (
                    <span className="block truncate text-[13.5px] font-bold text-black">{tx.memo}</span>
                  ) : (
                    <span className="block text-[13.5px] font-semibold text-gray-300">메모 없음</span>
                  )}
                  <span className="block text-[11.5px] text-gray-400">
                    {formatMonthDay(tx.date)}
                    {tx.satisfaction ? (
                      <>
                        {' · '}
                        <span style={{ color: MOOD_COLORS[tx.satisfaction] }}>
                          {MOOD_LABELS[tx.satisfaction]}
                        </span>
                      </>
                    ) : ' · 감정 미입력'}
                  </span>
                </span>

                {/* 금액 + 감정 바 */}
                <span className="shrink-0 text-right">
                  <span className={[
                    'block text-[13.5px] font-extrabold tabular-nums',
                    tx.type === 'income' ? 'text-(--color-income-blue)' : 'text-(--color-expense-red)',
                  ].join(' ')}>
                    {tx.type === 'income' ? '+' : '-'}{formatWon(tx.amount)}
                  </span>
                  <span
                    className="mt-1.5 ml-auto block h-1 w-10 rounded-full"
                    style={{ background: moodColor ?? '#e5e7eb' }}
                  />
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
