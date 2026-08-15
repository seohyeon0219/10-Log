import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { ACCOUNT_TYPE_CONFIG } from '../../types/account'
import type { Account } from '../../types/account'
import { formatMonthDay, formatWon } from '../../utils/formatters'

type Props = {
  account: Account
  onClick: () => void
}

export default function AccountRow({ account, onClick }: Props) {
  const cfg = ACCOUNT_TYPE_CONFIG[account.type]
  const Icon = cfg.icon

  return (
    <button
      className="flex w-full items-center gap-3 rounded-[14px] bg-white/50 px-3 py-2.5 text-left transition hover:bg-white/70"
      onClick={onClick}
      type="button"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5">
        <Icon aria-hidden="true" className="h-4 w-4 text-gray-600" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-bold text-black">{account.name}</span>
        <span className="block text-[11.5px] text-(--color-text-sand)">
          {account.type === 'investment'
            ? `${cfg.label} · ${formatMonthDay(account.balanceAsOf)} 기준`
            : cfg.label}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1">
        <span className="text-[13.5px] font-extrabold text-black">
          {formatWon(account.currentBalance)}
        </span>
        <ChevronRightIcon aria-hidden="true" className="h-3.5 w-3.5 text-gray-400" />
      </span>
    </button>
  )
}
