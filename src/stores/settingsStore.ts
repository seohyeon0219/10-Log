import { create } from 'zustand'

export type SatisfactionEmojis = {
  neutral: string
  regret: string
  satisfied: string
}

export const DEFAULT_SATISFACTION_EMOJIS: SatisfactionEmojis = {
  neutral: '😐',
  regret: '😔',
  satisfied: '😊',
}

const STORAGE_KEY = 'satisfaction-emojis'
const RECENT_CATEGORIES_KEY = 'recent-category-ids'

function load(): SatisfactionEmojis {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SATISFACTION_EMOJIS
    return { ...DEFAULT_SATISFACTION_EMOJIS, ...(JSON.parse(raw) as Partial<SatisfactionEmojis>) }
  } catch {
    return DEFAULT_SATISFACTION_EMOJIS
  }
}

function loadRecentCategories(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_CATEGORIES_KEY)
    if (!raw) return []
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}

type SettingsStore = {
  satisfactionEmojis: SatisfactionEmojis
  setSatisfactionEmoji: (key: keyof SatisfactionEmojis, emoji: string) => void
  recentCategoryIds: string[]
  addRecentCategoryId: (id: string) => void
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  satisfactionEmojis: load(),
  setSatisfactionEmoji: (key, emoji) => {
    set((state) => {
      const next = { ...state.satisfactionEmojis, [key]: emoji }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return { satisfactionEmojis: next }
    })
  },
  recentCategoryIds: loadRecentCategories(),
  addRecentCategoryId: (id) => {
    set((state) => {
      const next = [id, ...state.recentCategoryIds.filter((x) => x !== id)].slice(0, 20)
      localStorage.setItem(RECENT_CATEGORIES_KEY, JSON.stringify(next))
      return { recentCategoryIds: next }
    })
  },
}))
