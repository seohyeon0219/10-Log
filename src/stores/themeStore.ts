import { create } from 'zustand'

export type AppTheme = 'yellow' | 'blue'

export const THEME_GRADIENTS: Record<AppTheme, string> = {
  yellow: 'linear-gradient(160deg, #fffefc 0%, #fdf9ef 50%, #faf3e2 100%)',
  blue: 'linear-gradient(160deg, #f8fbff 0%, #eef4ff 50%, #e3edff 100%)',
}

export const THEME_LABELS: Record<AppTheme, string> = {
  yellow: '노란색 배경',
  blue: '파란색 배경',
}

type ThemeStore = {
  theme: AppTheme
  setTheme: (theme: AppTheme) => void
}

const stored = (localStorage.getItem('app-theme') as AppTheme | null) ?? 'yellow'

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: stored,
  setTheme: (theme) => {
    localStorage.setItem('app-theme', theme)
    document.documentElement.style.setProperty('--gradient-page-bg', THEME_GRADIENTS[theme])
    set({ theme })
  },
}))
