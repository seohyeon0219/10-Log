import { supabase } from './supabase'
import { getCurrentUserId } from './auth'
import type { Account, AccountFormValues } from '../types/account'

type AccountRow = {
  id: string
  user_id: string
  name: string
  type: string
  is_liability: boolean
  balance: number
  balance_as_of: string
  memo: string | null
  include_in_total: boolean
  sort_order: number
  is_archived: boolean
  created_at: string
  account_adjustments: { amount: number }[]
}

const mapAccount = (row: AccountRow): Account => {
  const adjustmentSum = row.account_adjustments.reduce((s, a) => s + a.amount, 0)
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    type: row.type as Account['type'],
    isLiability: row.is_liability,
    balance: row.balance,
    currentBalance: row.balance + adjustmentSum,
    balanceAsOf: row.balance_as_of,
    memo: row.memo ?? '',
    includeInTotal: row.include_in_total,
    sortOrder: row.sort_order,
    isArchived: row.is_archived,
    createdAt: row.created_at,
  }
}

export const getAccounts = async (): Promise<Account[]> => {
  const { data, error } = await supabase
    .from('accounts')
    .select('id, user_id, name, type, is_liability, balance, balance_as_of, memo, include_in_total, sort_order, is_archived, created_at, account_adjustments(amount)')
    .eq('is_archived', false)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) throw error

  return (data as AccountRow[]).map(mapAccount)
}

export const createAccount = async (values: AccountFormValues): Promise<void> => {
  const userId = await getCurrentUserId()

  const { error } = await supabase.from('accounts').insert({
    user_id: userId,
    name: values.name.trim(),
    type: values.type,
    is_liability: values.isLiability,
    balance: values.balance,
    balance_as_of: values.balanceAsOf,
    memo: values.memo.trim() || null,
    include_in_total: values.includeInTotal,
  })

  if (error) throw error
}

export const updateAccount = async (id: string, values: AccountFormValues): Promise<void> => {
  const { error } = await supabase
    .from('accounts')
    .update({
      name: values.name.trim(),
      type: values.type,
      is_liability: values.isLiability,
      balance: values.balance,
      balance_as_of: values.balanceAsOf,
      memo: values.memo.trim() || null,
      include_in_total: values.includeInTotal,
    })
    .eq('id', id)

  if (error) throw error
}

export const archiveAccount = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('accounts')
    .update({ is_archived: true })
    .eq('id', id)

  if (error) throw error
}

export const deleteAccount = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id)

  if (error) throw error
}
