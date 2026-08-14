import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PlusIcon, MinusIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline'
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
import type { AccountAdjustment, AccountAdjustmentFormValues, AccountFormValues } from '../types/account'
import { formatWon } from '../utils/formatters'
import { toDateKey } from '../utils/dateUtils'

const today = toDateKey(new Date())

export default function AccountDetailContainer() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const accounts = useAccountStore((state) => state.accounts)
  const loadAccounts = useAccountStore((state) => state.loadAccounts)
  const updateAccount = useAccountStore((state) => state.updateAccount)
  const deleteAccount = useAccountStore((state) => state.deleteAccount)

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // 조정 폼 상태
  const [editingAdj, setEditingAdj] = useState<AccountAdjustment | null>(null)
  const [isAdjSheetOpen, setIsAdjSheetOpen] = useState(false)
  const [adjDirection, setAdjDirection] = useState<'+' | '-'>('+')
  const [adjAmountRaw, setAdjAmountRaw] = useState('')
  const [adjDate, setAdjDate] = useState(today)
  const [adjName, setAdjName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [showAdjDeleteConfirm, setShowAdjDeleteConfirm] = useState(false)

  useEffect(() => {
    void loadAccounts()
  }, [loadAccounts])

  useEffect(() => {
    if (!isMenuOpen) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isMenuOpen])

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

  const cfg = ACCOUNT_TYPE_CONFIG[account.type]
  const Icon = cfg.icon
  const typeLabel = account.isLiability ? '부채' : '자산'
  const adjustmentSum = adjustments.reduce((s, a) => s + a.amount, 0)
  const currentBalance = account.balance + adjustmentSum

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
    setAdjAmountRaw('')
    setAdjDate(today)
    setAdjName('')
    setIsAdjSheetOpen(true)
  }

  const openEditAdj = (adj: AccountAdjustment) => {
    setEditingAdj(adj)
    setAdjDirection(adj.amount >= 0 ? '+' : '-')
    setAdjAmountRaw(String(Math.abs(adj.amount)))
    setAdjDate(adj.date)
    setAdjName(adj.memo)
    setIsAdjSheetOpen(true)
  }

  const handleAdjSave = async () => {
    const amount = Number(adjAmountRaw)
    if (!amount || !adjDate || !adjName.trim()) return
    setIsSaving(true)
    try {
      const values: AccountAdjustmentFormValues = {
        amount: adjDirection === '+' ? amount : -amount,
        date: adjDate,
        memo: adjName,
      }
      if (editingAdj) {
        await update(editingAdj.id, values)
      } else {
        await add(values)
      }
      setIsAdjSheetOpen(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAdjDelete = async () => {
    if (!editingAdj) return
    await remove(editingAdj.id)
    setShowAdjDeleteConfirm(false)
    setIsAdjSheetOpen(false)
  }

  const menu = (
    <div className="relative" ref={menuRef}>
      <button
        aria-label="더보기"
        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-black/5 active:opacity-60"
        onClick={() => setIsMenuOpen((v) => !v)}
        type="button"
      >
        <EllipsisVerticalIcon className="h-5 w-5" />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 top-10 z-50 min-w-32 overflow-hidden rounded-2xl glass-card shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          <button
            className="w-full px-4 py-3 text-left text-sm font-semibold text-black transition hover:bg-black/5"
            onClick={() => { setIsMenuOpen(false); setIsEditFormOpen(true) }}
            type="button"
          >
            수정하기
          </button>
          <div className="h-px bg-black/6" />
          <button
            className="w-full px-4 py-3 text-left text-sm font-semibold text-(--color-expense-red) transition hover:bg-black/5"
            onClick={() => { setIsMenuOpen(false); setShowDeleteConfirm(true) }}
            type="button"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  )

  return (
    <section className="w-full self-start animate-fade-up md:mt-4">
      <BackHeader action={menu} title={account.name} to="/app/assets" />

      {/* 잔액 카드 */}
      <div className="mb-3 rounded-[22px] glass-card p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
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

      {/* 입금/출금 버튼 */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        <TransparentButton className="text-(--color-income-blue)" onClick={() => openAddAdj('+')}>
          <PlusIcon className="h-4 w-4" />
          입금
        </TransparentButton>
        <TransparentButton className="text-(--color-expense-red)" onClick={() => openAddAdj('-')}>
          <MinusIcon className="h-4 w-4" />
          출금
        </TransparentButton>
      </div>

      {/* 조정 기록 */}
      <div className="rounded-[22px] glass-card p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        <p className="mb-3 text-sm font-bold text-black">조정 기록</p>
        {adjustments.length === 0 ? (
          <p className="py-4 text-center text-[13px] font-medium text-gray-400">
            아직 조정 기록이 없어요
          </p>
        ) : (
          <div className="grid gap-1">
            {adjustments.map((adj) => (
              <button
                className="flex w-full items-center justify-between rounded-[14px] bg-white/50 px-3 py-2.5 text-left transition hover:bg-white/70"
                key={adj.id}
                onClick={() => openEditAdj(adj)}
                type="button"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-black">{adj.memo}</p>
                  <p className="text-[11.5px] font-medium text-gray-400">{adj.date}</p>
                </div>
                <span
                  className={[
                    'shrink-0 text-[13.5px] font-extrabold',
                    adj.amount >= 0 ? 'text-(--color-income-blue)' : 'text-(--color-expense-red)',
                  ].join(' ')}
                >
                  {adj.amount >= 0 ? '+' : ''}{formatWon(adj.amount)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 조정 추가/수정 바텀시트 */}
      <BottomSheet
        isOpen={isAdjSheetOpen}
        onClose={() => setIsAdjSheetOpen(false)}
        title={editingAdj ? '기록 수정' : (adjDirection === '+' ? '입금 기록' : '출금 기록')}
      >
        <div className="grid gap-5">
          <UnderInput
            label="이름"
            maxLength={50}
            onChange={(e) => setAdjName(e.currentTarget.value)}
            placeholder="예) 월급, 현금 사용"
            suffix=""
            value={adjName}
          />
          <UnderInput
            inputMode="numeric"
            label="금액"
            onChange={(e) => setAdjAmountRaw(e.currentTarget.value.replace(/\D/g, ''))}
            pattern="[0-9]*"
            placeholder="0"
            value={adjAmountRaw}
            variant="amount"
          />
          <UnderInput
            label="날짜"
            max={today}
            onChange={(e) => setAdjDate(e.currentTarget.value)}
            suffix=""
            type="date"
            value={adjDate}
          />
          <Button
            disabled={!adjAmountRaw || !adjDate || !adjName.trim() || isSaving}
            onClick={() => void handleAdjSave()}
          >
            {isSaving ? '저장 중...' : editingAdj ? '수정 저장' : '저장'}
          </Button>
          {editingAdj && (
            <button
              className="text-sm font-semibold text-(--color-expense-red) transition hover:opacity-70"
              onClick={() => setShowAdjDeleteConfirm(true)}
              type="button"
            >
              삭제
            </button>
          )}
        </div>
      </BottomSheet>

      {/* 조정 삭제 확인 */}
      <ConfirmModal
        cancelText="취소"
        confirmText="삭제"
        description="이 조정 기록을 삭제하면 복원할 수 없어요."
        isOpen={showAdjDeleteConfirm}
        onClose={() => setShowAdjDeleteConfirm(false)}
        onConfirm={handleAdjDelete}
        title="기록을 삭제할까요?"
      />

      {/* 계좌 삭제 확인 */}
      <ConfirmModal
        cancelText="취소"
        confirmText="완전 삭제"
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
