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
      <div className="grid gap-2">
        {THEME_OPTIONS.map((option) => (
          <label
            key={option}
            className={[
              'flex cursor-pointer items-center gap-3 rounded-xl p-4 transition',
              pending === option ? 'glass-button' : 'glass-panel opacity-70 hover:opacity-90',
            ].join(' ')}
            style={{ background: THEME_GRADIENTS[option] }}
          >
            <input
              checked={pending === option}
              className="accent-black"
              name="app-theme"
              onChange={() => setPending(option)}
              type="radio"
              value={option}
            />
            <span className="text-sm font-semibold text-black">{THEME_LABELS[option]}</span>
          </label>
        ))}
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
