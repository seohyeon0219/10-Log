import { useEffect, useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import type { Account, AccountFormValues } from '../types/account'
import { useAccountStore } from '../stores/accountStore'
import { calcNetWorth } from '../utils/accountCalculators'
import { formatWon } from '../utils/formatters'
import AccountSection from '../components/accounts/AccountSection'
import NetWorthBar from '../components/accounts/NetWorthBar'
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
  const [defaultIsLiability, setDefaultIsLiability] = useState(false)

  useEffect(() => {
    void loadAccounts()
  }, [loadAccounts])

  const { assets, liabilities, netWorth } = calcNetWorth(accounts)

  const assetAccounts = accounts.filter((a) => !a.isLiability)
  const liabilityAccounts = accounts.filter((a) => a.isLiability)

  const openAdd = (isLiability = false) => {
    setDefaultIsLiability(isLiability)
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
            onClick={() => openAdd(false)}
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
          onAdd={() => openAdd(false)}
          onEdit={openEdit}
          title="자산"
        />
      )}

      {/* 부채 목록 */}
      {liabilityAccounts.length > 0 && (
        <AccountSection
          accounts={liabilityAccounts}
          className="mt-3"
          onAdd={() => openAdd(true)}
          onEdit={openEdit}
          title="부채"
        />
      )}

      <ResponsiveAccountForm
        defaultIsLiability={defaultIsLiability}
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
