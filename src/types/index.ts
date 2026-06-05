export type TransactionType = 'income' | 'expense'

export interface Category {
  id: string
  name: string
  color: string
  type: TransactionType
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  category_id: string
  category?: Category
  date: string
  memo: string | null
  is_fixed: boolean
  created_at: string
  updated_at: string
}

export interface JournalEntry {
  id: string
  user_id: string
  date: string
  content: string
  created_at: string
  updated_at: string
}
