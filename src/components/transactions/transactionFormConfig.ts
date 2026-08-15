import type { TransactionType } from '../../types/finance'

export type TransactionFormMode = 'create' | 'edit'

export const transactionFormTextByType: Record<
  TransactionType,
  { createTitle: string; editTitle: string; fixedLabel: string }
> = {
  income: {
    createTitle: '수입 기록',
    editTitle: '수입 수정',
    fixedLabel: '고정수입',
  },
  expense: {
    createTitle: '지출 기록',
    editTitle: '지출 수정',
    fixedLabel: '고정지출',
  },
}
