import { ACCOUNT_TYPE_CONFIG } from '../../types/account'
import type { Account } from '../../types/account'
import { formatMonthDay, formatWon } from '../../utils/formatters'

type Props = {
  account: Account
  currentBalance: number
  lastAdjDate: string | null
  thisMonthChange: number
}

export default function AccountBalanceCard({ account, currentBalance, lastAdjDate, thisMonthChange }: Props) {
  const cfg = ACCOUNT_TYPE_CONFIG[account.type]
  const Icon = cfg.icon
  const typeLabel = account.isLiability ? '부채' : '자산'

  return (
    <div className="mb-3 rounded-[22px] glass-card p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5">
          <Icon aria-hidden="true" className="h-5 w-5 text-gray-600" />
        </span>
        <div>
          <p className="text-xs font-semibold text-gray-500">{typeLabel} · {cfg.label}</p>
          <p className="text-sm font-bold text-black">{account.name}</p>
        </div>
      </div>

      <p className="text-[28px] font-extrabold leading-none text-black">
        {formatWon(currentBalance)}
      </p>

      {thisMonthChange !== 0 && (
        <p className={[
          'mt-2 text-sm font-bold',
          thisMonthChange > 0 ? 'text-(--color-income-blue)' : 'text-(--color-expense-red)',
        ].join(' ')}>
          이번 달 {thisMonthChange > 0 ? '+' : ''}{formatWon(thisMonthChange)}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-0.5">
        <p className="text-xs font-medium text-gray-400">
          초기 잔액 {formatWon(account.balance)}
        </p>
        {lastAdjDate && (
          <p className="text-xs font-medium text-gray-400">
            마지막 조정 {formatMonthDay(lastAdjDate)}
          </p>
        )}
      </div>

      {account.memo ? (
        <p className="mt-3 text-xs font-medium text-gray-500">{account.memo}</p>
      ) : null}
      {!account.includeInTotal ? (
        <p className="mt-2 text-[11px] font-medium text-gray-400">순자산 계산에서 제외됨</p>
      ) : null}
    </div>
  )
}
