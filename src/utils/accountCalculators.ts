import type { Account } from '../types/account'

export type NetWorthSummary = {
  assets: number
  liabilities: number
  netWorth: number
}

export const calcNetWorth = (accounts: Account[]): NetWorthSummary => {
  const active = accounts.filter((a) => !a.isArchived && a.includeInTotal)
  const assets = active.filter((a) => !a.isLiability).reduce((s, a) => s + a.currentBalance, 0)
  const liabilities = active.filter((a) => a.isLiability).reduce((s, a) => s + a.currentBalance, 0)
  return { assets, liabilities, netWorth: assets - liabilities }
}
