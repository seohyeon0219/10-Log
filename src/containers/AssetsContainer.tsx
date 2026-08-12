import { useEffect, useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { ACCOUNT_TYPE_CONFIG } from '../types/account'
import type { Account, AccountFormValues } from '../types/account'
import { useAccountStore } from '../stores/accountStore'
import { calcNetWorth } from '../utils/accountCalculators'
import { formatWon } from '../utils/formatters'
import ResponsiveAccountForm from '../components/accounts/ResponsiveAccountForm'

export default function AssetsContainer() {
  const accounts = useAccountStore((state) => state.accounts)
  const error = useAccountStore((state) => state.error)
  const isLoading = useAccountStore((state) => state.isLoading)
  const loadAccounts = useAccountStore((state) => state.loadAccounts)
  const addAccount = useAccountStore((state) => state.addAccount)
  const updateAccount = useAccountStore((state) => state.updateAccount)
  const archiveAccount = useAccountStore((state) => state.archiveAccount)
  const deleteAccount = useAccountStore((state) => state.deleteAccount)

  const [editTarget, setEditTarget] = useState<Account | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    void loadAccounts()
  }, [loadAccounts])

  const { assets, liabilities, netWorth } = calcNetWorth(accounts)

  const assetAccounts = accounts.filter((a) => !a.isLiability)
  const liabilityAccounts = accounts.filter((a) => a.isLiability)

  const openAdd = () => {
    setEditTarget(null)
    setIsFormOpen(true)
  }

  const openEdit = (account: Account) => {
    setEditTarget(account)
    setIsFormOpen(true)
  }

  const handleClose = () => {
    setIsFormOpen(false)
    setEditTarget(null)
  }

  const handleSave = async (values: AccountFormValues, id?: string) => {
    if (id) {
      await updateAccount(id, values)
    } else {
      await addAccount(values)
    }
    handleClose()
  }

  const handleArchive = async (id: string) => {
    await archiveAccount(id)
    handleClose()
  }

  const handleDelete = async (id: string) => {
    await deleteAccount(id)
    handleClose()
  }

  return (
    <section className="w-full self-start animate-fade-up md:mt-4">
      {error ? (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-(--color-expense-red)">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="mb-4 rounded-xl border border-white/60 bg-(--color-glass-white) px-4 py-3 text-sm font-semibold text-gray-500 backdrop-blur-sm">
          데이터를 불러오는 중이에요.
        </div>
      ) : null}

      {/* 순자산 요약 카드 */}
      {!isLoading && (
        <div className="mb-4 rounded-[22px] border border-white/60 bg-white/45 p-5 backdrop-blur-[20px] backdrop-saturate-170 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <p className="mb-1 text-xs font-semibold text-gray-500">순자산</p>
          <p
            className={[
              'text-[26px] font-extrabold leading-none',
              netWorth >= 0 ? 'text-black' : 'text-(--color-expense-red)',
            ].join(' ')}
          >
            {netWorth < 0 ? '-' : ''}{formatWon(Math.abs(netWorth))}
          </p>

          {(assets > 0 || liabilities > 0) && (
            <NetWorthBar assets={assets} liabilities={liabilities} />
          )}

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1 text-xs font-semibold text-gray-500">자산 합계</p>
              <p className="text-base font-bold text-black">{formatWon(assets)}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold text-gray-500">부채 합계</p>
              <p className="text-base font-bold text-(--color-expense-red)">{formatWon(liabilities)}</p>
            </div>
          </div>
        </div>
      )}

      {/* 빈 상태 */}
      {!isLoading && accounts.length === 0 && (
        <div className="rounded-[22px] border border-white/60 bg-white/45 px-6 py-12 text-center backdrop-blur-[20px] backdrop-saturate-170 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <p className="text-sm font-semibold text-gray-400">아직 등록된 자산이 없어요.</p>
          <p className="mt-1 text-[13px] font-medium text-gray-400">
            통장, 적금, 투자 계좌 등을 추가해보세요.
          </p>
          <button
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-black px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] transition hover:bg-gray-800"
            onClick={openAdd}
            type="button"
          >
            <PlusIcon aria-hidden="true" className="h-4 w-4" />
            자산 추가
          </button>
        </div>
      )}

      {/* 자산 목록 */}
      {assetAccounts.length > 0 && (
        <AccountSection
          accounts={assetAccounts}
          onEdit={openEdit}
          title="자산"
        />
      )}

      {/* 부채 목록 */}
      {liabilityAccounts.length > 0 && (
        <AccountSection
          accounts={liabilityAccounts}
          className="mt-3"
          onEdit={openEdit}
          title="부채"
        />
      )}

      {/* 플로팅 추가 버튼 (자산이 있을 때) */}
      {accounts.length > 0 && (
        <button
          aria-label="자산 추가"
          className="fixed right-5 bottom-[calc(80px+env(safe-area-inset-bottom))] flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-[0_8px_24px_rgba(0,0,0,0.22)] transition hover:bg-gray-800 md:bottom-8"
          onClick={openAdd}
          type="button"
        >
          <PlusIcon aria-hidden="true" className="h-6 w-6" />
        </button>
      )}

      <ResponsiveAccountForm
        editTarget={editTarget}
        isOpen={isFormOpen}
        onArchive={handleArchive}
        onClose={handleClose}
        onDelete={handleDelete}
        onSave={handleSave}
      />
    </section>
  )
}

function NetWorthBar({ assets, liabilities }: { assets: number; liabilities: number }) {
  const netWorth = assets - liabilities
  const equityRatio = assets > 0 ? Math.max(0, Math.min(100, Math.round((netWorth / assets) * 100))) : 0
  const label =
    assets === 0
      ? '부채만 있어요'
      : `${equityRatio}%만큼 내 자산이에요`

  return (
    <div className="mt-3">
      <div className="h-1.5 overflow-hidden rounded-full bg-black/6">
        <div
          className="h-full rounded-full bg-black/40 transition-all duration-500"
          style={{ width: `${equityRatio}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs font-semibold text-gray-400">{label}</p>
    </div>
  )
}

type AccountSectionProps = {
  accounts: Account[]
  className?: string
  onEdit: (account: Account) => void
  title: string
}

function AccountSection({ accounts, className = '', onEdit, title }: AccountSectionProps) {
  return (
    <div className={['rounded-[22px] border border-white/60 bg-white/45 p-5 backdrop-blur-[20px] backdrop-saturate-170 shadow-[0_10px_30px_rgba(0,0,0,0.08)]', className].join(' ')}>
      <p className="mb-3 text-sm font-bold text-black">{title}</p>
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
                {account.memo ? (
                  <span className="block truncate text-[11.5px] text-(--color-text-sand)">
                    {account.memo}
                  </span>
                ) : (
                  <span className="block text-[11.5px] text-(--color-text-sand)">
                    {cfg.label}
                  </span>
                )}
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
