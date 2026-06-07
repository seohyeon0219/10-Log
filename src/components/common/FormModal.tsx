import type { ReactNode } from 'react'

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
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4 py-6">
      <section
        aria-modal="true"
        className="flex max-h-[88dvh] w-full max-w-125 flex-col rounded-2xl bg-white shadow-xl"
        role="dialog"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 px-6 pt-6 pb-4">
          <div>
            <h2 className="m-0 text-xl font-bold text-black">{title}</h2>
            {description ? (
              <p className="mt-2 mb-0 text-sm font-medium text-gray-400">{description}</p>
            ) : null}
          </div>
          <button
            aria-label={`${title} 닫기`}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-transparent text-3xl leading-none text-gray-300 transition hover:bg-gray-50 hover:text-gray-500 active:bg-gray-100"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </header>

        <div className="min-h-0 overflow-y-auto px-6 pb-6">{children}</div>
      </section>
    </div>
  )
}
