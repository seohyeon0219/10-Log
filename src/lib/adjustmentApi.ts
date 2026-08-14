import { supabase } from './supabase'
import type { AccountAdjustment, AccountAdjustmentFormValues } from '../types/account'

type AdjustmentRow = {
  id: string
  account_id: string
  amount: number
  date: string
  memo: string | null
  created_at: string
}

const mapAdjustment = (row: AdjustmentRow): AccountAdjustment => ({
  id: row.id,
  accountId: row.account_id,
  amount: row.amount,
  date: row.date,
  memo: row.memo ?? '',
  createdAt: row.created_at,
})

export const getAdjustments = async (accountId: string): Promise<AccountAdjustment[]> => {
  const { data, error } = await supabase
    .from('account_adjustments')
    .select('id, account_id, amount, date, memo, created_at')
    .eq('account_id', accountId)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as AdjustmentRow[]).map(mapAdjustment)
}

export const createAdjustment = async (
  accountId: string,
  values: AccountAdjustmentFormValues,
): Promise<void> => {
  const { error } = await supabase.from('account_adjustments').insert({
    account_id: accountId,
    amount: values.amount,
    date: values.date,
    memo: values.memo.trim() || null,
  })

  if (error) throw error
}

export const deleteAdjustment = async (id: string): Promise<void> => {
  const { error } = await supabase.from('account_adjustments').delete().eq('id', id)
  if (error) throw error
}
