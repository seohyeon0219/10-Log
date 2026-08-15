import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { ACCOUNT_TYPE_CONFIG, ASSET_TYPES, LIABILITY_TYPES } from '../../types/account'
import type { Account, AccountFormValues, AccountType } from '../../types/account'
import { toDateKey } from '../../utils/dateUtils'
import Button from '../common/Button'
import Checkbox from '../common/Checkbox'
import ConfirmModal from '../common/ConfirmModal'
import UnderInput from '../common/UnderInput'

type Props = {
  initialValues?: Account
  isLiability: boolean
  onSave: (values: AccountFormValues) => Promise<void>
  onArchive?: () => Promise<void>
  onDelete?: () => Promise<void>
}

const today = toDateKey(new Date())

export default function AccountFormContent({ initialValues, isLiability, onSave, onArchive, onDelete }: Props) {
  const isEdit = Boolean(initialValues)

  const validTypes = isLiability ? LIABILITY_TYPES : ASSET_TYPES
  const defaultType: AccountType = isLiability ? 'loan' : 'deposit'
  const [type, setType] = useState<AccountType>(
    initialValues && validTypes.includes(initialValues.type) ? initialValues.type : defaultType,
  )
  const [name, setName] = useState(initialValues?.name ?? '')
  const [balanceRaw, setBalanceRaw] = useState(initialValues?.balance ? String(initialValues.balance) : '')
  const [balanceAsOf, setBalanceAsOf] = useState(initialValues?.balanceAsOf ?? today)
  const [memo, setMemo] = useState(initialValues?.memo ?? '')
  const [includeInTotal, setIncludeInTotal] = useState(initialValues?.includeInTotal ?? true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBalanceRaw(e.currentTarget.value.replace(/\D/g, ''))
  }

  const canSave = name.trim().length > 0 && balanceAsOf.length > 0

  const handleSave = async () => {
    if (!canSave) return
    setErrorMessage('')
    setIsSaving(true)
    try {
      await onSave({
        type,
        isLiability,
        name: name.trim(),
        balance: Number(balanceRaw) || 0,
        balanceAsOf,
        memo: memo.trim(),
        includeInTotal,
      })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '저장하지 못했어요.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleArchive = async () => {
    setShowArchiveConfirm(false)
    setIsSaving(true)
    try {
      await onArchive?.()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '보관하지 못했어요.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setShowDeleteConfirm(false)
    setIsSaving(true)
    try {
      await onDelete?.()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '삭제하지 못했어요.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <div className="grid gap-5">
        {/* 자산/부채 종류 */}
        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-3 p-0 text-sm font-semibold text-gray-500">
            {isLiability ? '부채 종류' : '자산 종류'}
          </legend>
          <div className={`grid gap-2 ${isLiability ? 'grid-cols-3' : 'grid-cols-5'}`}>
            {validTypes.map((t) => {
              const cfg = ACCOUNT_TYPE_CONFIG[t]
              const Icon = cfg.icon
              const isSelected = type === t
              return (
                <button
                  aria-pressed={isSelected}
                  className={[
                    'flex flex-col items-center gap-1.5 rounded-xl border py-3 px-1 text-center text-[10px] font-bold transition',
                    isSelected
                      ? 'border-black/30 bg-black/6 text-black'
                      : 'border-white/60 bg-white/55 text-gray-400 hover:bg-white/70',
                  ].join(' ')}
                  key={t}
                  onClick={() => setType(t)}
                  type="button"
                >
                  <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                  <span className="w-full break-keep leading-tight">{cfg.label}</span>
                </button>
              )
            })}
          </div>
        </fieldset>

        <UnderInput
          label="이름"
          maxLength={20}
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder={isLiability ? '부채 이름' : '자산 이름'}
          suffix=""
          value={name}
        />

        <div className="h-px bg-black/8" />

        <UnderInput
          inputMode="numeric"
          label="잔액"
          onChange={handleAmountChange}
          pattern="[0-9]*"
          placeholder="0"
          value={balanceRaw ? Number(balanceRaw).toLocaleString('ko-KR') : ''}
          variant="amount"
        />

        <div className="h-px bg-black/8" />

        <div>
          <UnderInput
            label="기준일"
            max={today}
            onChange={(e) => setBalanceAsOf(e.currentTarget.value)}
            suffix=""
            type="date"
            value={balanceAsOf}
          />
          <p className="mt-1.5 text-xs font-medium text-gray-400">
            이 날짜의 잔액을 기준으로 이후 거래가 반영돼요.
          </p>
        </div>

        <div className="h-px bg-black/8" />

        <UnderInput
          label="메모"
          maxLength={100}
          onChange={(e) => setMemo(e.currentTarget.value)}
          placeholder="선택 사항"
          suffix=""
          value={memo}
        />

        <Checkbox
          checked={includeInTotal}
          className="text-sm"
          name="include-in-total"
          onChange={(e) => setIncludeInTotal(e.currentTarget.checked)}
        >
          {isLiability ? '순자산에서 차감' : '순자산에 포함'}
        </Checkbox>
      </div>

      {errorMessage && (
        <p className="mt-4 text-sm font-semibold text-(--color-expense-red)" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="mt-5 grid gap-3 pt-1">
        <Button disabled={!canSave || isSaving} onClick={handleSave}>
          {isSaving ? '저장 중...' : isEdit ? '수정 저장' : '저장'}
        </Button>

        {isEdit && onArchive && (
          <Button disabled={isSaving} onClick={() => setShowArchiveConfirm(true)} variant="soft">
            보관하기
          </Button>
        )}

        {isEdit && onDelete && (
          <button
            className="text-sm font-semibold text-(--color-expense-red) transition hover:opacity-70 disabled:opacity-40"
            disabled={isSaving}
            onClick={() => setShowDeleteConfirm(true)}
            type="button"
          >
            삭제
          </button>
        )}
      </div>

      <ConfirmModal
        cancelText="취소"
        confirmText="보관하기"
        description={`보관된 ${isLiability ? '부채' : '자산'}은 목록에서 숨겨져요. 나중에 언제든 복원할 수 있어요.`}
        isOpen={showArchiveConfirm}
        onClose={() => setShowArchiveConfirm(false)}
        onConfirm={handleArchive}
        title={`${isLiability ? '부채' : '자산'}을 보관할까요?`}
      />

      <ConfirmModal
        cancelText="취소"
        confirmText="삭제"
        description="삭제하면 복원할 수 없어요."
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="정말 삭제할까요?"
      />
    </>
  )
}
