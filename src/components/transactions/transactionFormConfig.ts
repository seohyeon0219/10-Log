export type TransactionType = 'income' | 'expense'

export type TransactionCategory = {
  color: string
  id: string
  name: string
}

export const transactionFormTextByType: Record<TransactionType, { fixedLabel: string; title: string }> = {
  income: {
    fixedLabel: '고정수입',
    title: '수입을 기록해요',
  },
  expense: {
    fixedLabel: '고정지출',
    title: '지출을 기록해요',
  },
}
