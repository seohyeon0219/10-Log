type ExpandButtonProps = {
  ariaLabel: string
  className?: string
  isExpanded: boolean
  onClick: () => void
}

const cn = (...classNames: Array<string | undefined>) => classNames.filter(Boolean).join(' ')

export default function ExpandButton({
  ariaLabel,
  className,
  isExpanded,
  onClick,
}: ExpandButtonProps) {
  return (
    <button
      aria-expanded={isExpanded}
      aria-label={ariaLabel}
      className={cn(
        'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-gray-400 transition hover:bg-gray-50 hover:text-gray-600 active:bg-gray-100',
        className,
      )}
      onClick={onClick}
      type="button"
    >
      <svg
        aria-hidden="true"
        className={isExpanded ? 'rotate-180 transition-transform' : 'transition-transform'}
        fill="none"
        height="7"
        viewBox="0 0 12 7"
        width="12"
      >
        <path
          d="M1 1L6 6L11 1"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
    </button>
  )
}
