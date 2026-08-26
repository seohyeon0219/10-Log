import { create } from 'zustand'

export type AppTheme = 'yellow' | 'blue'

export const THEME_GRADIENTS: Record<AppTheme, string> = {
  yellow: [
    'radial-gradient(110% 60% at 12% 0%, oklch(0.93 0.055 80) 0%, transparent 58%)',
    'radial-gradient(90% 50% at 95% 12%, oklch(0.94 0.04 50) 0%, transparent 60%)',
    'radial-gradient(120% 60% at 50% 100%, oklch(0.94 0.035 105) 0%, transparent 62%)',
    '#fdfbf6',
  ].join(', '),
  blue: [
    'radial-gradient(100% 50% at 8% 2%, oklch(0.955 0.035 250) 0%, transparent 55%)',
    'radial-gradient(85% 45% at 96% 14%, oklch(0.945 0.045 268) 0%, transparent 58%)',
    'radial-gradient(120% 55% at 55% 104%, oklch(0.9 0.055 255) 0%, transparent 60%)',
    'linear-gradient(160deg, #f8fbff 0%, #eef4ff 50%, #e3edff 100%)',
  ].join(', '),
}

export const THEME_ACCENT: Record<AppTheme, string> = {
  yellow: 'linear-gradient(90deg, oklch(0.76 0.13 65), oklch(0.68 0.15 40))',
  blue: 'linear-gradient(90deg, oklch(0.68 0.14 255), oklch(0.62 0.16 275))',
}

export const THEME_SURFACE: Record<AppTheme, {
  panel: string; panelStrong: string; border: string; sheen: string
  shadowCard: string; shadowRow: string; blur: string
}> = {
  yellow: {
    panel: 'rgba(255,255,255,0.62)',
    panelStrong: 'rgba(255,255,255,0.70)',
    border: 'rgba(255,255,255,0.92)',
    sheen: 'rgba(255,255,255,0.92)',
    shadowCard: '0 14px 34px rgba(90,75,40,0.09)',
    shadowRow: '0 6px 16px rgba(90,75,40,0.05)',
    blur: 'blur(26px) saturate(150%)',
  },
  blue: {
    panel: 'rgba(255,255,255,0.68)',
    panelStrong: 'rgba(255,255,255,0.76)',
    border: 'rgba(255,255,255,0.97)',
    sheen: 'rgba(255,255,255,0.95)',
    shadowCard: '0 14px 34px rgba(40,60,110,0.09)',
    shadowRow: '0 6px 16px rgba(40,60,110,0.055)',
    blur: 'blur(26px) saturate(150%)',
  },
}

export const THEME_INK: Record<AppTheme, { primary: string; secondary: string; tertiary: string }> = {
  yellow: { primary: '#151a22', secondary: 'rgba(21,26,34,0.58)', tertiary: 'rgba(21,26,34,0.44)' },
  blue: { primary: '#151a22', secondary: 'rgba(21,26,34,0.58)', tertiary: 'rgba(21,26,34,0.44)' },
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
