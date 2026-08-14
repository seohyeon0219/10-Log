import { PlusIcon } from '@heroicons/react/24/outline'
import { ACCOUNT_TYPE_CONFIG } from '../../types/account'
import type { Account } from '../../types/account'
import { formatMonthDay, formatWon } from '../../utils/formatters'

type Props = {
  accounts: Account[]
  className?: string
  onAdd: () => void
  onEdit: (account: Account) => void
  title: string
}

export default function AccountSection({ accounts, className = '', onAdd, onEdit, title }: Props) {
  return (
    <div className={['rounded-[22px] glass-card p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]', className].join(' ')}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-bold text-black">{title}</p>
        <button
          aria-label={`${title} 추가`}
          className="flex h-6 w-6 items-center justify-center text-gray-400 transition hover:text-black"
          onClick={onAdd}
          type="button"
        >
          <PlusIcon aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
      {accounts.length === 0 ? (
        <button
          className="w-full rounded-[14px] border border-dashed border-black/10 py-3 text-center text-sm font-medium text-gray-400 transition hover:border-black/20 hover:text-gray-500"
          onClick={onAdd}
          type="button"
        >
          + 추가하기
        </button>
      ) : null}
      <div className="grid gap-1.5">
        {accounts.map((account) => {
          const cfg = ACCOUNT_TYPE_CONFIG[account.type]
          const Icon = cfg.icon
          return (
            <button
              className="flex w-full items-center gap-3 rounded-[14px] bg-white/50 px-3 py-2.5 text-left transition hover:bg-white/70"
              key={account.id}
              onClick={() => onEdit(account)}
              type="button"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5">
                <Icon aria-hidden="true" className="h-4 w-4 text-gray-600" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-bold text-black">{account.name}</span>
                <span className="block text-[11.5px] text-(--color-text-sand)">
                  {account.type === 'investment'
                    ? `${cfg.label} · ${formatMonthDay(account.balanceAsOf)} 기준`
                    : cfg.label}
                </span>
              </span>
              <span className="shrink-0 text-[13.5px] font-extrabold text-black">
                {formatWon(account.balance)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
