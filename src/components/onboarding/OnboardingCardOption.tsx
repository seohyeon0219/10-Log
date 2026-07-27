type Props = {
  label: string
  description?: string
  selected: boolean
  onClick: () => void
  disabled?: boolean
}

export default function OnboardingCardOption({ label, description, selected, onClick, disabled = false }: Props) {
  return (
    <button
      className="flex w-full items-center justify-between rounded-2xl border border-black/10 bg-white/80 px-5 py-4 text-left transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-30"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-black">{label}</p>
        {description && (
          <p className="mt-0.5 text-[13px] text-(--color-text-muted)">{description}</p>
        )}
      </div>
      <span className={[
        'ml-4 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150',
        selected ? 'border-black' : 'border-black/20',
      ].join(' ')}>
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-black" />}
      </span>
    </button>
  )
}
