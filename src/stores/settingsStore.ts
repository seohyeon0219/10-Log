import { create } from 'zustand'

const RECENT_CATEGORIES_KEY = 'recent-category-ids'

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
  recentCategoryIds: string[]
  addRecentCategoryId: (id: string) => void
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  recentCategoryIds: loadRecentCategories(),
  addRecentCategoryId: (id) => {
    set((state) => {
      const next = [id, ...state.recentCategoryIds.filter((x) => x !== id)].slice(0, 20)
      localStorage.setItem(RECENT_CATEGORIES_KEY, JSON.stringify(next))
      return { recentCategoryIds: next }
    })
  },
}))
