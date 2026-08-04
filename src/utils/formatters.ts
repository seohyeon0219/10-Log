export const formatAmount = (amount: number) => amount.toLocaleString('ko-KR')

export const formatWon = (amount: number) => `${amount.toLocaleString('ko-KR')}원`

export const formatAmountShort = (amount: number) => `${Math.round(amount / 1000)}k`

export const getRateClassName = (rate: number) => {
  if (rate > 0) return 'text-(--color-income-blue)'
  if (rate < 0) return 'text-(--color-expense-red)'
  return 'text-gray-400'
}
