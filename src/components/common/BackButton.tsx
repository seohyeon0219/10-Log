import { useNavigate } from 'react-router-dom'

type BackButtonProps = {
  label?: string
  to?: string
}

export default function BackButton({ label, to }: BackButtonProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (to) {
      navigate(to)
    } else {
      navigate(-1)
    }
  }

  return (
    <button
      className="flex items-center gap-1.5 text-sm font-semibold text-(--color-text-sand) transition hover:text-black active:opacity-60"
      onClick={handleBack}
      type="button"
    >
      <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
        <path
          d="M10 3L5 8L10 13"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
      {label}
    </button>
  )
}
