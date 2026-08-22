type Option<T extends string> = {
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
        {options.map((option) => (
          <button
            aria-pressed={option.value === value}
            className={[
              'h-11 flex-1 rounded-xl text-[15px] font-bold transition-all duration-200',
              option.value === value
                ? 'bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.10)]'
                : 'text-(--color-text-muted) hover:text-black',
            ].join(' ')}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    )
  }

  const btnCls =
    size === 'md'
      ? 'h-9 px-3 text-sm font-bold'
      : 'h-7 px-2.5 text-xs font-bold'

  return (
    <div className="inline-flex rounded-lg glass-panel p-0.5">
      {options.map((option) => (
        <button
          aria-pressed={option.value === value}
          className={[
            'rounded-md transition',
            btnCls,
            option.value === value
              ? 'bg-white/90 text-black shadow-sm'
              : 'bg-transparent text-gray-400',
          ].join(' ')}
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
