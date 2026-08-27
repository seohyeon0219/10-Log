export const formatAmount = (amount: number) => amount.toLocaleString('ko-KR')

export const formatWon = (amount: number) => `${amount.toLocaleString('ko-KR')}원`

export const formatAmountShort = (amount: number) => `${Math.round(amount / 1000)}k`

export const formatCompactKorean = (amount: number): string => {
  if (amount >= 100_000_000) return `${+( amount / 100_000_000).toFixed(1)}억원`
  if (amount >= 10_000) return `${+(amount / 10_000).toFixed(1)}만원`
  return formatWon(amount)
}

export const getRateClassName = (rate: number) => {
  if (rate > 0) return 'text-(--color-income-blue)'
  if (rate < 0) return 'text-(--color-expense-red)'
  return 'text-gray-400'
}

export const formatMonthDay = (date: Date | string): string => {
  if (typeof date === 'string') {
    const parts = date.split('-')
    return `${parseInt(parts[1])}월 ${parseInt(parts[2])}일`
  }
  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}
