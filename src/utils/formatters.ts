export const formatAmount = (amount: number) => amount.toLocaleString('ko-KR')

export const formatWon = (amount: number) => `${amount.toLocaleString('ko-KR')}원`

export const formatAmountShort = (amount: number) => `${Math.round(amount / 1000)}k`
