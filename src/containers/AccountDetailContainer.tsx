import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/outline'
import BackHeader from '../components/common/BackHeader'
import BottomSheet from '../components/common/BottomSheet'
import Button from '../components/common/Button'
import TransparentButton from '../components/common/TransparentButton'
import ConfirmModal from '../components/common/ConfirmModal'
import UnderInput from '../components/common/UnderInput'
import ResponsiveAccountForm from '../components/accounts/ResponsiveAccountForm'
import { useAccountStore } from '../stores/accountStore'
import { useAccountAdjustments } from '../hooks/useAccountAdjustments'
import { ACCOUNT_TYPE_CONFIG } from '../types/account'
import type { AccountAdjustmentFormValues, AccountFormValues } from '../types/account'
import { formatWon } from '../utils/formatters'
import { toDateKey } from '../utils/dateUtils'

const today = toDateKey(new Date())

export default function AccountDetailContainer() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const accounts = useAccountStore((state) => state.accounts)
  const loadAccounts = useAccountStore((state) => state.loadAccounts)
  const updateAccount = useAccountStore((state) => state.updateAccount)
  const archiveAccount = useAccountStore((state) => state.archiveAccount)
  const deleteAccount = useAccountStore((state) => state.deleteAccount)

  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addDirection, setAddDirection] = useState<'+' | '-'>('+')
  const [addAmountRaw, setAddAmountRaw] = useState('')
  const [addDate, setAddDate] = useState(today)
  const [addMemo, setAddMemo] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  useEffect(() => {
    void loadAccounts()
  }, [loadAccounts])

  const account = accounts.find((a) => a.id === id)
  const { adjustments, add, remove } = useAccountAdjustments(id ?? '')

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
  const adjustmentSum = adjustments.reduce((s, a) => s + a.amount, 0)
  const currentBalance = account.balance + adjustmentSum

  const handleEditSave = async (values: AccountFormValues) => {
    await updateAccount(account.id, values)
    setIsEditFormOpen(false)
  }

  const handleArchive = async () => {
    await archiveAccount(account.id)
    navigate('/app/assets', { replace: true })
  }

  const handleDelete = async () => {
    await deleteAccount(account.id)
    navigate('/app/assets', { replace: true })
  }

  const openAdd = (direction: '+' | '-') => {
    setAddDirection(direction)
    setAddAmountRaw('')
    setAddDate(today)
    setAddMemo('')
    setIsAddOpen(true)
  }

  const handleAddSave = async () => {
    const amount = Number(addAmountRaw)
    if (!amount || !addDate) return
    setIsSaving(true)
    try {
      const values: AccountAdjustmentFormValues = {
        amount: addDirection === '+' ? amount : -amount,
        date: addDate,
        memo: addMemo,
      }
      await add(values)
      setIsAddOpen(false)
    } finally {
      setIsSaving(false)
    }
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
          {formatWon(currentBalance)}
        </p>
        <p className="mt-1.5 text-xs font-medium text-gray-400">
          초기 잔액 {formatWon(account.balance)} · {account.balanceAsOf} 기준
        </p>

        {account.memo ? (
          <p className="mt-3 text-xs font-medium text-gray-500">{account.memo}</p>
        ) : null}
        {!account.includeInTotal ? (
          <p className="mt-2 text-[11px] font-medium text-gray-400">순자산 계산에서 제외됨</p>
        ) : null}
      </div>

      {/* 조정 기록 */}
      <div className="mb-3 rounded-[22px] border border-white/60 bg-white/45 p-5 backdrop-blur-[20px] backdrop-saturate-170 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        <p className="mb-3 text-sm font-bold text-black">조정 기록</p>
        <div className="mb-3 grid grid-cols-2 gap-2">
          <TransparentButton className="text-(--color-income-blue)" onClick={() => openAdd('+')}>
            <PlusIcon className="h-4 w-4" />
            입금
          </TransparentButton>
          <TransparentButton className="text-(--color-expense-red)" onClick={() => openAdd('-')}>
            <MinusIcon className="h-4 w-4" />
            출금
          </TransparentButton>
        </div>

        {adjustments.length === 0 ? (
          <p className="py-4 text-center text-[13px] font-medium text-gray-400">
            아직 조정 기록이 없어요
          </p>
        ) : (
          <div className="grid gap-1">
            {adjustments.map((adj) => (
              <div
                className="flex items-center justify-between rounded-[14px] bg-white/50 px-3 py-2.5"
                key={adj.id}
              >
                <div className="min-w-0">
                  <p className="text-[11.5px] font-medium text-gray-400">{adj.date}</p>
                  {adj.memo ? (
                    <p className="text-[13px] font-medium text-black">{adj.memo}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={[
                      'text-[13.5px] font-extrabold',
                      adj.amount >= 0 ? 'text-(--color-income-blue)' : 'text-(--color-expense-red)',
                    ].join(' ')}
                  >
                    {adj.amount >= 0 ? '+' : ''}{formatWon(adj.amount)}
                  </span>
                  <button
                    aria-label="삭제"
                    className="flex h-6 w-6 items-center justify-center rounded-full text-gray-300 transition hover:text-red-400"
                    onClick={() => setDeleteTarget(adj.id)}
                    type="button"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        className="w-full rounded-2xl bg-black py-3.5 text-sm font-bold text-white transition hover:bg-gray-800 active:opacity-80"
        onClick={() => setIsEditFormOpen(true)}
        type="button"
      >
        수정하기
      </button>

      {/* 조정 추가 바텀시트 */}
      <BottomSheet
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title={addDirection === '+' ? '입금 기록' : '출금 기록'}
      >
        <div className="grid gap-5">
          <div className="inline-flex rounded-lg bg-black/5 p-0.5">
            {(['+', '-'] as const).map((d) => (
              <button
                className={[
                  'flex-1 rounded-md px-4 py-1.5 text-sm font-bold transition',
                  addDirection === d ? 'bg-white text-black shadow-sm' : 'text-gray-400',
                ].join(' ')}
                key={d}
                onClick={() => setAddDirection(d)}
                type="button"
              >
                {d === '+' ? '+ 입금' : '- 출금'}
              </button>
            ))}
          </div>

          <UnderInput
            inputMode="numeric"
            label="금액"
            onChange={(e) => setAddAmountRaw(e.currentTarget.value.replace(/\D/g, ''))}
            pattern="[0-9]*"
            placeholder="0"
            value={addAmountRaw}
            variant="amount"
          />

          <UnderInput
            label="날짜"
            max={today}
            onChange={(e) => setAddDate(e.currentTarget.value)}
            suffix=""
            type="date"
            value={addDate}
          />

          <UnderInput
            label="메모"
            maxLength={50}
            onChange={(e) => setAddMemo(e.currentTarget.value)}
            placeholder="선택 사항"
            suffix=""
            value={addMemo}
          />

          <Button
            disabled={!addAmountRaw || !addDate || isSaving}
            onClick={() => void handleAddSave()}
          >
            {isSaving ? '저장 중...' : '저장'}
          </Button>
        </div>
      </BottomSheet>

      {/* 조정 삭제 확인 */}
      <ConfirmModal
        cancelText="취소"
        confirmText="삭제"
        description="이 조정 기록을 삭제하면 복원할 수 없어요."
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await remove(deleteTarget)
          setDeleteTarget(null)
        }}
        title="기록을 삭제할까요?"
      />

      {/* 계좌 수정 폼 */}
      <ResponsiveAccountForm
        editTarget={account}
        isLiability={account.isLiability}
        isOpen={isEditFormOpen}
        onArchive={handleArchive}
        onClose={() => setIsEditFormOpen(false)}
        onDelete={handleDelete}
        onSave={(values) => void handleEditSave(values)}
      />
    </section>
  )
}
