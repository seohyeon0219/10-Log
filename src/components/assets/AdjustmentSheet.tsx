import { useEffect, useState } from 'react'
import BottomSheet from '../common/BottomSheet'
import Button from '../common/Button'
import ConfirmModal from '../common/ConfirmModal'
import UnderInput from '../common/UnderInput'
import type { AccountAdjustment, AccountAdjustmentFormValues } from '../../types/account'
import { toDateKey } from '../../utils/dateUtils'

const today = toDateKey(new Date())

type Props = {
  isOpen: boolean
  onClose: () => void
  editingAdj: AccountAdjustment | null
  direction: '+' | '-'
  onSave: (values: AccountAdjustmentFormValues) => Promise<void>
  onDelete: () => Promise<void>
}

export default function AdjustmentSheet({ isOpen, onClose, editingAdj, direction, onSave, onDelete }: Props) {
  const [adjName, setAdjName] = useState('')
  const [adjAmountRaw, setAdjAmountRaw] = useState('')
  const [adjDate, setAdjDate] = useState(today)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    if (editingAdj) {
      setAdjName(editingAdj.memo)
      setAdjAmountRaw(String(Math.abs(editingAdj.amount)))
      setAdjDate(editingAdj.date)
    } else {
      setAdjName('')
      setAdjAmountRaw('')
      setAdjDate(today)
    }
  }, [isOpen, editingAdj])

  const handleSave = async () => {
    const amount = Number(adjAmountRaw)
    if (!amount || !adjDate || !adjName.trim()) return
    setIsSaving(true)
    try {
      await onSave({
        amount: direction === '+' ? amount : -amount,
        date: adjDate,
        memo: adjName,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const title = editingAdj ? '기록 수정' : (direction === '+' ? '추가 기록' : '차감 기록')

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose} title={title}>
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
            value={adjAmountRaw ? Number(adjAmountRaw).toLocaleString('ko-KR') : ''}
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
            onClick={() => void handleSave()}
          >
            {isSaving ? '저장 중...' : editingAdj ? '수정 저장' : '저장'}
          </Button>
          {editingAdj && (
            <button
              className="text-sm font-semibold text-(--color-expense-red) transition hover:opacity-70"
              onClick={() => setShowDeleteConfirm(true)}
              type="button"
            >
              삭제
            </button>
          )}
        </div>
      </BottomSheet>

      <ConfirmModal
        cancelText="취소"
        confirmText="삭제"
        description="이 기록을 삭제하면 복원할 수 없어요."
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={async () => {
          await onDelete()
          setShowDeleteConfirm(false)
        }}
        title="기록을 삭제할까요?"
      />
    </>
  )
}
