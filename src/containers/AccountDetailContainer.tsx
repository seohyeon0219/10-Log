import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BackHeader from '../components/common/BackHeader'
import ResponsiveAccountForm from '../components/accounts/ResponsiveAccountForm'
import { useAccountStore } from '../stores/accountStore'
import { ACCOUNT_TYPE_CONFIG } from '../types/account'
import type { AccountFormValues } from '../types/account'
import { formatWon } from '../utils/formatters'

export default function AccountDetailContainer() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const accounts = useAccountStore((state) => state.accounts)
  const loadAccounts = useAccountStore((state) => state.loadAccounts)
  const updateAccount = useAccountStore((state) => state.updateAccount)
  const archiveAccount = useAccountStore((state) => state.archiveAccount)
  const deleteAccount = useAccountStore((state) => state.deleteAccount)

  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    void loadAccounts()
  }, [loadAccounts])

  const account = accounts.find((a) => a.id === id)

  if (!account) {
    return (
      <section className="w-full self-start animate-fade-up md:mt-4">
        <BackHeader to="/app/assets" />
        <p className="text-sm text-gray-400">계좌를 찾을 수 없어요.</p>
      </section>
    )
  }

  const cfg = ACCOUNT_TYPE_CONFIG[account.type]
  const Icon = cfg.icon
  const typeLabel = account.isLiability ? '부채' : '자산'

  const handleSave = async (values: AccountFormValues) => {
    await updateAccount(account.id, values)
    setIsFormOpen(false)
  }

  const handleArchive = async () => {
    await archiveAccount(account.id)
    navigate('/app/assets', { replace: true })
  }

  const handleDelete = async () => {
    await deleteAccount(account.id)
    navigate('/app/assets', { replace: true })
  }

  return (
    <section className="w-full self-start animate-fade-up md:mt-4">
      <BackHeader title={account.name} to="/app/assets" />

      {/* 잔액 카드 */}
      <div className="mb-3 rounded-[22px] border border-white/60 bg-white/45 p-5 backdrop-blur-[20px] backdrop-saturate-170 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
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
          {formatWon(account.balance)}
        </p>
        <p className="mt-1.5 text-xs font-medium text-gray-400">{account.balanceAsOf} 기준</p>
        {account.memo ? (
          <p className="mt-3 text-xs font-medium text-gray-500">{account.memo}</p>
        ) : null}
        {!account.includeInTotal ? (
          <p className="mt-2 text-[11px] font-medium text-gray-400">순자산 계산에서 제외됨</p>
        ) : null}
      </div>

      <button
        className="mt-4 w-full rounded-2xl bg-black py-3.5 text-sm font-bold text-white transition hover:bg-gray-800 active:opacity-80"
        onClick={() => setIsFormOpen(true)}
        type="button"
      >
        수정하기
      </button>

      <ResponsiveAccountForm
        editTarget={account}
        isLiability={account.isLiability}
        isOpen={isFormOpen}
        onArchive={handleArchive}
        onClose={() => setIsFormOpen(false)}
        onDelete={handleDelete}
        onSave={(values) => handleSave(values)}
      />
    </section>
  )
}
