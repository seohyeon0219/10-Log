import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { JournalEntry } from '../types'

export function useJournals(year: number, month: number) {
  const [journals, setJournals] = useState<JournalEntry[]>([])

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

  const refetch = useCallback(async () => {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)

    if (!error && data) setJournals(data as JournalEntry[])
  }, [startDate, endDate])

  useEffect(() => { refetch() }, [refetch])

  async function saveJournal(date: string, content: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const existing = journals.find(j => j.date === date)
    if (existing) {
      await supabase
        .from('journal_entries')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('journal_entries')
        .insert({ user_id: user.id, date, content })
    }
    refetch()
  }

  async function deleteJournal(id: string) {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id)

    if (!error) setJournals(prev => prev.filter(journal => journal.id !== id))
  }

  return { journals, saveJournal, deleteJournal }
}
