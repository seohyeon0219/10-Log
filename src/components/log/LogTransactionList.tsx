import { ChevronRightIcon } from '@heroicons/react/24/outline'
import type { Satisfaction, Transaction } from '../../types/finance'
import { formatMonthDay, formatWon } from '../../utils/formatters'

const SATISFACTION_EMOJI: Record<Satisfaction, string> = {
  neutral: '😐',
  regret: '😔',
  satisfied: '😊',
}

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
        <p className="text-center text-sm font-semibold text-gray-400">해당 감정의 거래가 없어요</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[22px] glass-card shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
      {untaggedCount > 0 && (
        <button
          className="flex w-full items-center justify-between border-b border-black/6 px-5 py-3.5 text-left transition hover:bg-black/4"
          onClick={onTagUntagged}
          type="button"
        >
          <span className="text-[13px] font-semibold text-gray-500">
            아직 {untaggedCount}건이 감정 미입력이에요
          </span>
          <ChevronRightIcon aria-hidden="true" className="h-4 w-4 text-gray-400" />
        </button>
      )}

      <div className="divide-y divide-black/4">
        {transactions.map((tx) => (
          <button
            className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-black/4"
            key={tx.id}
            onClick={() => onSelectTransaction(tx)}
            type="button"
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: tx.categoryColor }}
            />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold text-black">{tx.categoryName}</span>
                {tx.satisfaction ? (
                  <span className="text-[12px] leading-none">{SATISFACTION_EMOJI[tx.satisfaction]}</span>
                ) : (
                  <span className="text-[10px] font-semibold text-gray-300">미입력</span>
                )}
              </span>
              <span className="block text-[11.5px] text-(--color-text-sand)">
                {formatMonthDay(tx.date)}{tx.memo ? ` · ${tx.memo}` : ''}
              </span>
            </span>
            <span
              className={[
                'shrink-0 text-[13.5px] font-extrabold',
                tx.type === 'income' ? 'text-(--color-income-blue)' : 'text-(--color-expense-red)',
              ].join(' ')}
            >
              {tx.type === 'income' ? '+' : '-'}{formatWon(tx.amount)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
