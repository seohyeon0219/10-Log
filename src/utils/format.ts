export function formatAmount(amount: number): string {
  return Math.abs(amount).toLocaleString('ko-KR')
}

export function formatWithSign(amount: number): string {
  if (amount === 0) return '0'
  const sign = amount > 0 ? '+' : '-'
  return sign + formatAmount(amount)
}
