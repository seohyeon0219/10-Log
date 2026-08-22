type Option<T extends string> = {
  color?: string
  label: string
  value: T
}

type Props<T extends string> = {
  onChange: (value: T) => void
  options: readonly Option<T>[]
  size?: 'sm' | 'md' | 'lg'
  value: T | null
}

export default function SegmentedControl<T extends string>({
  onChange,
  options,
  size = 'sm',
  value,
}: Props<T>) {
  if (size === 'lg') {
    return (
      <div className="flex gap-1 rounded-2xl bg-black/6 p-1">
        {options.map((option) => {
          const isSelected = option.value === value
          return (
            <button
              aria-pressed={isSelected}
              className={[
                'h-11 flex-1 rounded-xl text-[15px] font-bold transition-all duration-200',
                isSelected && !option.color ? 'bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.10)]' : '',
                !isSelected ? 'text-(--color-text-muted) hover:text-black' : '',
              ].join(' ')}
              key={option.value}
              onClick={() => onChange(option.value)}
              style={isSelected && option.color ? {
                background: `linear-gradient(135deg, ${option.color}99, ${option.color}66)`,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: `0 2px 12px ${option.color}40, inset 0 1px 0 rgba(255,255,255,0.25)`,
                color: 'white',
              } : undefined}
              type="button"
            >
              {option.label}
            </button>
          )
        })}
      </div>
    )
  }

  const btnCls =
    size === 'md'
      ? 'h-9 px-3 text-sm font-bold'
      : 'h-7 px-2.5 text-xs font-bold'

  return (
    <div className="inline-flex rounded-lg glass-panel p-0.5">
      {options.map((option) => {
        const isSelected = option.value === value
        return (
          <button
            aria-pressed={isSelected}
            className={[
              'rounded-md transition',
              btnCls,
              isSelected && !option.color ? 'bg-white/90 text-black shadow-sm' : '',
              !isSelected ? 'bg-transparent text-gray-400' : '',
            ].join(' ')}
            key={option.value}
            onClick={() => onChange(option.value)}
            style={isSelected && option.color ? {
              background: `linear-gradient(135deg, ${option.color}99, ${option.color}66)`,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: `0 2px 8px ${option.color}40, inset 0 1px 0 rgba(255,255,255,0.25)`,
              color: 'white',
            } : undefined}
            type="button"
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
