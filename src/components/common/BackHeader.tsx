import { useNavigate } from 'react-router-dom'

type BackHeaderProps = {
  to?: string
}

export default function BackHeader({ to }: BackHeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (to) {
      navigate(to)
    } else {
      navigate(-1)
    }
  }

  return (
    <header className="mb-4 flex items-center">
      <button
        className="flex items-center text-(--color-text-sand) transition active:opacity-60"
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
      </button>
    </header>
  )
}
