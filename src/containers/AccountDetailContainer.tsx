import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import BackHeader from '../components/common/BackHeader'
import DropdownMenu from '../components/common/DropdownMenu'
import TransparentButton from '../components/common/TransparentButton'
import ConfirmModal from '../components/common/ConfirmModal'
import ResponsiveAccountForm from '../components/accounts/ResponsiveAccountForm'
import AccountBalanceCard from '../components/assets/AccountBalanceCard'
import AdjustmentSheet from '../components/assets/AdjustmentSheet'
import { useAccountStore } from '../stores/accountStore'
import { useAccountAdjustments } from '../hooks/useAccountAdjustments'
import type { AccountAdjustment, AccountAdjustmentFormValues, AccountFormValues } from '../types/account'
import { formatMonthDay, formatWon } from '../utils/formatters'

export default function AccountDetailContainer() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const accounts = useAccountStore((state) => state.accounts)
  const loadAccounts = useAccountStore((state) => state.loadAccounts)
  const updateAccount = useAccountStore((state) => state.updateAccount)
  const deleteAccount = useAccountStore((state) => state.deleteAccount)

  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [editingAdj, setEditingAdj] = useState<AccountAdjustment | null>(null)
  const [isAdjSheetOpen, setIsAdjSheetOpen] = useState(false)
  const [adjDirection, setAdjDirection] = useState<'+' | '-'>('+')

  useEffect(() => {
    void loadAccounts()
  }, [loadAccounts])

  const account = accounts.find((a) => a.id === id)
  const { adjustments, add, update, remove } = useAccountAdjustments(id ?? '')

  if (!account) {
    return (
      <section className="w-full self-start animate-fade-up md:mt-4">
        <BackHeader to="/app/assets" />
        <p className="text-sm text-gray-400">계좌를 찾을 수 없어요.</p>
      </section>
    )
  }

  const adjustmentSum = adjustments.reduce((s, a) => s + a.amount, 0)
  const currentBalance = account.balance + adjustmentSum

  // adjustments는 최신순 정렬이므로 역순으로 누적해 각 시점 잔액을 계산
  const balanceByAdjId = (() => {
    const map = new Map<string, number>()
    let running = account.balance
    for (const adj of [...adjustments].reverse()) {
      running += adj.amount
      map.set(adj.id, running)
    }
    return map
  })()


  const handleEditSave = async (values: AccountFormValues) => {
    await updateAccount(account.id, values)
    setIsEditFormOpen(false)
  }

  const handleDelete = async () => {
    await deleteAccount(account.id)
    navigate('/app/assets', { replace: true })
  }

  const openAddAdj = (direction: '+' | '-') => {
    setEditingAdj(null)
    setAdjDirection(direction)
    setIsAdjSheetOpen(true)
  }

  const openEditAdj = (adj: AccountAdjustment) => {
    setEditingAdj(adj)
    setAdjDirection(adj.amount >= 0 ? '+' : '-')
    setIsAdjSheetOpen(true)
  }

  const handleAdjSave = async (values: AccountAdjustmentFormValues) => {
    if (editingAdj) {
      await update(editingAdj.id, values)
    } else {
      await add(values)
    }
    setIsAdjSheetOpen(false)
    setEditingAdj(null)
  }

  const handleAdjDelete = async () => {
    if (!editingAdj) return
    await remove(editingAdj.id)
    setIsAdjSheetOpen(false)
    setEditingAdj(null)
  }

  const menu = (
    <DropdownMenu
      items={[
        { label: '수정하기', onClick: () => setIsEditFormOpen(true) },
        { label: '삭제', onClick: () => setShowDeleteConfirm(true), danger: true },
      ]}
    />
  )

  return (
    <section className="w-full self-start animate-fade-up pb-6 md:mt-4">
      <BackHeader action={menu} title={account.name} to="/app/assets" />

      <AccountBalanceCard account={account} currentBalance={currentBalance} />

      {/* 입금/출금 버튼 */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        <TransparentButton className="text-(--color-income-blue)" onClick={() => openAddAdj('+')}>
          <PlusIcon className="h-4 w-4" />
          추가
        </TransparentButton>
        <TransparentButton className="text-(--color-expense-red)" onClick={() => openAddAdj('-')}>
          <MinusIcon className="h-4 w-4" />
          차감
        </TransparentButton>
      </div>

      {/* 기록 */}
      <div className="rounded-[22px] glass-card p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        <div className="mb-3 flex items-baseline justify-between">
          <p className="text-sm font-bold text-black">기록</p>
          {adjustments.length > 0 && (
            <p className="text-[11px] font-semibold text-gray-400">
              총 {adjustments.length}건
            </p>
          )}
        </div>
        <div className="grid gap-1.5">
          {adjustments.map((adj) => (
            <button
              className="flex w-full items-center justify-between rounded-[14px] bg-white/50 px-3 py-2.5 text-left transition hover:bg-white/70"
              key={adj.id}
              onClick={() => openEditAdj(adj)}
              type="button"
            >
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-black">{adj.memo ?? '-'}</p>
                <p className="text-[11.5px] font-medium text-gray-400">{formatMonthDay(adj.date)}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className={[
                  'text-[13.5px] font-extrabold',
                  adj.amount >= 0 ? 'text-(--color-income-blue)' : 'text-(--color-expense-red)',
                ].join(' ')}>
                  {adj.amount >= 0 ? '+' : ''}{formatWon(adj.amount)}
                </p>
                <p className="text-[11px] font-medium text-gray-400">
                  잔액 {formatWon(balanceByAdjId.get(adj.id) ?? 0)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <AdjustmentSheet
        direction={adjDirection}
        editingAdj={editingAdj}
        isOpen={isAdjSheetOpen}
        onClose={() => setIsAdjSheetOpen(false)}
        onDelete={handleAdjDelete}
        onSave={handleAdjSave}
      />

      {/* 계좌 삭제 확인 */}
      <ConfirmModal
        cancelText="취소"
        confirmText="삭제"
        description="삭제하면 복원할 수 없어요."
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="정말 삭제할까요?"
      />

      {/* 계좌 수정 폼 */}
      <ResponsiveAccountForm
        editTarget={account}
        isLiability={account.isLiability}
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        onSave={(values) => handleEditSave(values)}
      />
    </section>
  )
}
