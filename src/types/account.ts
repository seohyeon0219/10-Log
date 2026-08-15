import type { ComponentType, SVGProps } from 'react'

export type AccountType = 'cash' | 'deposit' | 'savings' | 'investment' | 'etc' | 'loan' | 'card' | 'other_debt'

export type Account = {
  id: string
  userId: string
  name: string
  type: AccountType
  isLiability: boolean
  balance: number
  currentBalance: number
  balanceAsOf: string
  memo: string
  includeInTotal: boolean
  sortOrder: number
  isArchived: boolean
  createdAt: string
}

export type AccountFormValues = {
  name: string
  type: AccountType
  isLiability: boolean
  balance: number
  balanceAsOf: string
  memo: string
  includeInTotal: boolean
}

type AccountTypeConfig = {
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

import {
  BanknotesIcon,
  BuildingLibraryIcon,
  CircleStackIcon,
  ArrowTrendingUpIcon,
  EllipsisHorizontalCircleIcon,
  DocumentTextIcon,
  CreditCardIcon,
  MinusCircleIcon,
} from '@heroicons/react/24/outline'

export const ACCOUNT_TYPE_CONFIG: Record<AccountType, AccountTypeConfig> = {
  cash:       { label: '현금·입출금', icon: BanknotesIcon },
  deposit:    { label: '예금',        icon: BuildingLibraryIcon },
  savings:    { label: '적금',        icon: CircleStackIcon },
  investment: { label: '투자',        icon: ArrowTrendingUpIcon },
  etc:        { label: '기타',        icon: EllipsisHorizontalCircleIcon },
  loan:       { label: '대출',        icon: DocumentTextIcon },
  card:       { label: '카드 대금',   icon: CreditCardIcon },
  other_debt: { label: '기타',        icon: MinusCircleIcon },
}

export type AccountAdjustment = {
  id: string
  accountId: string
  amount: number
  date: string
  memo: string
  createdAt: string
}

export type AccountAdjustmentFormValues = {
  amount: number
  date: string
  memo: string
}

export const ASSET_TYPES: AccountType[] = ['cash', 'deposit', 'savings', 'investment', 'etc']
export const LIABILITY_TYPES: AccountType[] = ['loan', 'card', 'other_debt']
export const ACCOUNT_TYPES = Object.keys(ACCOUNT_TYPE_CONFIG) as AccountType[]
