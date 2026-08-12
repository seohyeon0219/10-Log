import { create } from 'zustand'
import {
  archiveAccount,
  createAccount,
  deleteAccount,
  getAccounts,
  updateAccount,
} from '../lib/accountApi'
import type { Account, AccountFormValues } from '../types/account'

type AccountStore = {
  accounts: Account[]
  error: string | null
  isLoading: boolean
  loadAccounts: () => Promise<void>
  addAccount: (values: AccountFormValues) => Promise<void>
  updateAccount: (id: string, values: AccountFormValues) => Promise<void>
  archiveAccount: (id: string) => Promise<void>
  deleteAccount: (id: string) => Promise<void>
}

export const useAccountStore = create<AccountStore>((set, get) => ({
  accounts: [],
  error: null,
  isLoading: false,

  loadAccounts: async () => {
    set({ error: null, isLoading: true })
    try {
      const accounts = await getAccounts()
      set({ accounts, isLoading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Supabase 데이터를 불러오지 못했어요.'
      set({ error: message, isLoading: false })
    }
  },

  addAccount: async (values) => {
    await createAccount(values)
    await get().loadAccounts()
  },

  updateAccount: async (id, values) => {
    await updateAccount(id, values)
    await get().loadAccounts()
  },

  archiveAccount: async (id) => {
    await archiveAccount(id)
    await get().loadAccounts()
  },

  deleteAccount: async (id) => {
    await deleteAccount(id)
    await get().loadAccounts()
  },
}))
