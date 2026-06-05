import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Transaction } from '../types'

export function useTransactions(year: number, month: number) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

  const refetch = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('transactions')
      .select('*, category:categories(*)')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })

    if (!error && data) setTransactions(data as Transaction[])
    setLoading(false)
  }, [startDate, endDate])

  useEffect(() => { refetch() }, [refetch])

  async function addTransaction(
    tx: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'category'>
  ) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('transactions')
      .insert({ ...tx, user_id: user.id })

    if (!error) refetch()
  }

  async function deleteTransaction(id: string) {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (!error) setTransactions(prev => prev.filter(t => t.id !== id))
  }

  return { transactions, loading, addTransaction, deleteTransaction }
}
