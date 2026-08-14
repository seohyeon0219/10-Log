type Option<T extends string> = {
  label: string
  value: T
}

type Props<T extends string> = {
  onChange: (value: T) => void
  options: readonly Option<T>[]
  size?: 'sm' | 'md'
  value: T
}

export default function SegmentedControl<T extends string>({
  onChange,
  options,
  size = 'sm',
  value,
}: Props<T>) {
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
