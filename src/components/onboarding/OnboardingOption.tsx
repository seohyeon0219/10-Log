type Props = {
  label: string
  description?: string
  selected: boolean
  onClick: () => void
  variant?: 'chip' | 'card'
  disabled?: boolean
}

export default function OnboardingOption({
  label,
  description,
  selected,
  onClick,
  variant = 'chip',
  disabled = false,
}: Props) {
  const base = 'transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-30'

  if (variant === 'card') {
    return (
      <button
        className={[
          base,
          'w-full rounded-2xl border px-5 py-4 text-left',
          selected
            ? 'border-black bg-black text-white'
            : 'border-white/50 bg-white/50 text-black backdrop-blur-md',
        ].join(' ')}
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        <p className="font-semibold">{label}</p>
        {description && (
          <p className={['mt-1 text-sm', selected ? 'text-white/65' : 'text-(--color-text-muted)'].join(' ')}>
            {description}
          </p>
        )}
      </button>
    )
  }

  return (
    <button
      className={[
        base,
        'rounded-full border px-4 py-2 text-sm font-semibold',
        selected
          ? 'border-black bg-black text-white'
          : 'border-white/50 bg-white/50 text-black backdrop-blur-md',
      ].join(' ')}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )
}
