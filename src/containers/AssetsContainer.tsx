import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { AccountFormValues } from '../types/account'
import { useAccountStore } from '../stores/accountStore'
import { useThemeStore } from '../stores/themeStore'
import { calcNetWorth } from '../utils/accountCalculators'
import { formatWon } from '../utils/formatters'
import AccountSection from '../components/accounts/AccountSection'
import NetWorthBar from '../components/accounts/NetWorthBar'
import ResponsiveAccountForm from '../components/accounts/ResponsiveAccountForm'

const NET_WORTH_CARD_BG: Record<string, string> = {
  yellow: 'linear-gradient(135deg, rgba(251, 249, 245, 0.40) 0%, rgba(242, 237, 228, 0.28) 100%)',
  blue:   'linear-gradient(135deg, rgba(241, 246, 255, 0.40) 0%, rgba(233, 238, 249, 0.28) 100%)',
}

export default function AssetsContainer() {
  const accounts = useAccountStore((state) => state.accounts)
  const error = useAccountStore((state) => state.error)
  const isLoading = useAccountStore((state) => state.isLoading)
  const loadAccounts = useAccountStore((state) => state.loadAccounts)
  const addAccount = useAccountStore((state) => state.addAccount)
  const theme = useThemeStore((state) => state.theme)

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
        <div
          className="mb-4 overflow-hidden rounded-[22px] glass-card shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
          style={{ background: NET_WORTH_CARD_BG[theme] }}
        >
          {/* 상단 shimmer */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

          <div className="p-5">
            {/* 순자산 뱃지 + 숫자 */}
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-black/6 px-2 py-0.5 text-xs font-bold tracking-wide text-gray-600">
                순자산
              </span>
            </div>
            <p
              className={[
                'text-[30px] font-extrabold leading-none',
                netWorth >= 0 ? 'text-black' : 'text-(--color-expense-red)',
              ].join(' ')}
            >
              {netWorth < 0 ? '-' : ''}{formatWon(Math.abs(netWorth))}
            </p>

            {(assets > 0 || liabilities > 0) && (
              <NetWorthBar assets={assets} liabilities={liabilities} />
            )}

            {/* 구분선 */}
            <div className="my-4 h-px bg-black/6" />

            {/* 자산 / 부채 합계 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  <p className="text-[11px] font-semibold text-gray-400">자산 합계</p>
                </div>
                <p className="text-[15px] font-bold text-(--color-income-blue)">{formatWon(assets)}</p>
              </div>
              <div>
                <div className="mb-1 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  <p className="text-[11px] font-semibold text-gray-400">부채 합계</p>
                </div>
                <p className="text-[15px] font-bold text-(--color-expense-red)">{formatWon(liabilities)}</p>
              </div>
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
