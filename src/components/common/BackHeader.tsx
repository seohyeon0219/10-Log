import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

type BackHeaderProps = {
  action?: ReactNode
  title?: string
  to?: string
}

export default function BackHeader({ action, title, to }: BackHeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (to) {
      navigate(to)
    } else {
      navigate(-1)
    }
  }

  return (
    <header className="mb-4 flex h-12 items-center gap-2">
      <button
        aria-label="뒤로 가기"
        className="flex h-10 w-10 items-center justify-center text-(--color-text-sand) transition active:opacity-60"
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
      {title && <h1 className="min-w-0 flex-1 truncate text-xl font-bold text-black">{title}</h1>}
      {action ? <div className="ml-auto shrink-0">{action}</div> : null}
    </header>
  )
}
