import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { AccountFormValues } from '../types/account'
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

  const navigate = useNavigate()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLiability, setIsLiability] = useState(false)

  useEffect(() => {
    void loadAccounts()
  }, [loadAccounts])

  const { assets, liabilities, netWorth } = calcNetWorth(accounts)

  const assetAccounts = accounts.filter((a) => !a.isLiability)
  const liabilityAccounts = accounts.filter((a) => a.isLiability)

  const openAdd = (liability: boolean) => {
    setIsLiability(liability)
    setIsFormOpen(true)
  }

  const handleClose = () => setIsFormOpen(false)

  const handleSave = async (values: AccountFormValues) => {
    await addAccount(values)
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
        <div className="mb-4 rounded-[22px] glass-card p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
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

      {/* 자산/부채 목록 */}
      {!isLoading && (
        <>
          <AccountSection
            accounts={assetAccounts}
            onAdd={() => openAdd(false)}
            onEdit={(account) => navigate(`/app/assets/${account.id}`)}
            title="자산"
          />
          <AccountSection
            accounts={liabilityAccounts}
            className="mt-3"
            onAdd={() => openAdd(true)}
            onEdit={(account) => navigate(`/app/assets/${account.id}`)}
            title="부채"
          />
        </>
      )}

      <ResponsiveAccountForm
        editTarget={null}
        isLiability={isLiability}
        isOpen={isFormOpen}
        onClose={handleClose}
        onSave={handleSave}
      />
    </section>
  )
}
