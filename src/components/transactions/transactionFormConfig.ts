export type TransactionType = 'income' | 'expense'

export type TransactionCategory = {
  color: string
  id: string
  name: string
}

export type TransactionFormMode = 'create' | 'edit'

export const transactionFormTextByType: Record<
  TransactionType,
  { createTitle: string; editTitle: string; fixedLabel: string }
> = {
  income: {
    createTitle: '수입을 기록해요',
    editTitle: '수입을 수정해요',
    fixedLabel: '고정수입',
  },
  expense: {
    createTitle: '지출을 기록해요',
    editTitle: '지출을 수정해요',
    fixedLabel: '고정지출',
  },
}
