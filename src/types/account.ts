import type { ComponentType, SVGProps } from 'react'

export type AccountType = 'cash' | 'deposit' | 'savings' | 'investment' | 'etc'

export type Account = {
  id: string
  userId: string
  name: string
  type: AccountType
  isLiability: boolean
  balance: number
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
  ArchiveBoxIcon,
  ArrowTrendingUpIcon,
  EllipsisHorizontalCircleIcon,
} from '@heroicons/react/24/outline'

export const ACCOUNT_TYPE_CONFIG: Record<AccountType, AccountTypeConfig> = {
  cash:       { label: '현금·입출금', icon: BanknotesIcon },
  deposit:    { label: '예금',        icon: BuildingLibraryIcon },
  savings:    { label: '적금',        icon: ArchiveBoxIcon },
  investment: { label: '투자',        icon: ArrowTrendingUpIcon },
  etc:        { label: '기타',        icon: EllipsisHorizontalCircleIcon },
}

export const ACCOUNT_TYPES = Object.keys(ACCOUNT_TYPE_CONFIG) as AccountType[]
