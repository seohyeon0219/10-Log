import type { ReactNode } from 'react'
import ModalSurface from './ModalSurface'

type FormModalProps = {
  children: ReactNode
  description?: string
  isOpen: boolean
  onClose: () => void
  title: string
}

export default function FormModal({
  children,
  description,
  isOpen,
  onClose,
  title,
}: FormModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <ModalSurface className="flex max-h-[88dvh] w-full max-w-125 flex-col rounded-2xl glass-card shadow-xl">
      <header className="flex shrink-0 items-start justify-between gap-4 px-6 pt-6 pb-4">
        <div>
          <h2 className="m-0 text-xl font-bold text-black">{title}</h2>
          {description ? (
            <p className="mt-2 mb-0 text-sm font-medium text-gray-400">{description}</p>
          ) : null}
        </div>
        <button
          aria-label={`${title ?? '바텀시트'} 닫기`}
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-3xl leading-none text-gray-500 transition interactive-icon"
          onClick={onClose}
          type="button"
        >
          ×
        </button>
      </header>

      <div className="min-h-0 overflow-y-auto overscroll-contain px-6 pb-6">{children}</div>
    </ModalSurface>
  )
}
