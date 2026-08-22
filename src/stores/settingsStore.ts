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

function load(): SatisfactionEmojis {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SATISFACTION_EMOJIS
    return { ...DEFAULT_SATISFACTION_EMOJIS, ...(JSON.parse(raw) as Partial<SatisfactionEmojis>) }
  } catch {
    return DEFAULT_SATISFACTION_EMOJIS
  }
}

type SettingsStore = {
  satisfactionEmojis: SatisfactionEmojis
  setSatisfactionEmoji: (key: keyof SatisfactionEmojis, emoji: string) => void
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
}))
