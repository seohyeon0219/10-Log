import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Category, TransactionType } from '../types'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])

  const refetch = useCallback(() => {
    supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setCategories(data as Category[])
      })
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  async function addCategory(name: string, color: string, type: TransactionType) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('categories')
      .insert({ user_id: user.id, name, color, type })
      .select()
      .single()

    if (!error && data) setCategories(prev => [...prev, data as Category])
  }

  async function updateCategory(id: string, name: string, color: string, type: TransactionType) {
    const { data, error } = await supabase
      .from('categories')
      .update({ name, color, type })
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setCategories(prev => prev.map(category => (
        category.id === id ? data as Category : category
      )))
    }
  }

  async function deleteCategory(id: string) {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (!error) setCategories(prev => prev.filter(c => c.id !== id))
  }

  return { categories, addCategory, updateCategory, deleteCategory, refetch }
}
