import { useState } from 'react'
import { THEME_GRADIENTS, THEME_LABELS, useThemeStore, type AppTheme } from '../../stores/themeStore'

const THEME_OPTIONS: AppTheme[] = ['yellow', 'blue']

type Props = {
  onClose: () => void
}

export default function ThemeSelectContent({ onClose }: Props) {
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const [pending, setPending] = useState<AppTheme>(theme)

  const handleSave = () => {
    setTheme(pending)
    onClose()
  }

  return (
    <div className="grid gap-4 pb-2">
      <div className="grid grid-cols-2 gap-3">
        {THEME_OPTIONS.map((option) => {
          const isSelected = pending === option
          return (
            <button
              key={option}
              className={[
                'relative overflow-hidden rounded-2xl transition-all duration-200',
                isSelected
                  ? 'shadow-[0_0_0_2px_rgba(0,0,0,0.18),0_6px_20px_rgba(0,0,0,0.1)] scale-[1.03]'
                  : 'shadow-[0_2px_8px_rgba(0,0,0,0.07)] hover:scale-[1.01] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]',
              ].join(' ')}
              onClick={() => setPending(option)}
              style={{ background: THEME_GRADIENTS[option] }}
              type="button"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-8 -left-8 h-24 w-24 rounded-full blur-3xl"
                style={{ background: option === 'blue' ? 'rgba(169,201,255,0.7)' : 'rgba(232,232,232,0.8)' }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full blur-3xl"
                style={{ background: option === 'blue' ? 'rgba(169,201,255,0.5)' : 'rgba(240,222,218,0.7)' }}
              />
              <div className="relative flex h-32 flex-col items-center justify-end px-4 pb-4">
                <span className="rounded-full border border-white/60 bg-white/55 px-3 py-1 text-xs font-bold text-black backdrop-blur-sm">
                  {THEME_LABELS[option]}
                </span>
              </div>
            </button>
          )
        })}
      </div>
      <button
        className="min-h-12 w-full rounded-xl bg-black text-base font-bold text-white transition hover:bg-gray-800 active:bg-black disabled:cursor-not-allowed disabled:opacity-50"
        disabled={pending === theme}
        onClick={handleSave}
        type="button"
      >
        저장
      </button>
    </div>
  )
}
