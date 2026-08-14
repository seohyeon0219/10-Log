import { PlusIcon } from '@heroicons/react/24/outline'
import type { Account } from '../../types/account'
import AccountRow from '../assets/AccountRow'

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
        {accounts.map((account) => (
          <AccountRow key={account.id} account={account} onClick={() => onEdit(account)} />
        ))}
      </div>
    </div>
  )
}
