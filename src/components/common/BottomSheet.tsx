import type { ReactNode } from 'react'

type BottomSheetProps = {
  children: ReactNode
  description?: string
  isOpen: boolean
  maxHeightClassName?: string
  onClose: () => void
  title?: string
}

export default function BottomSheet({
  children,
  description,
  isOpen,
  maxHeightClassName = 'max-h-[90dvh]',
  onClose,
  title,
}: BottomSheetProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-60 bg-black/35">
      <section
        aria-modal="true"
        className={[
          'fixed right-0 bottom-0 left-0 overflow-y-auto rounded-t-3xl glass-card px-5 pt-3 pb-[calc(20px+env(safe-area-inset-bottom))] shadow-xl md:px-6',
          maxHeightClassName,
        ].join(' ')}
        role="dialog"
      >
        <div className="mx-auto w-full max-w-2xl">
          <header className="mb-5 grid gap-3">
            <span aria-hidden="true" className="mx-auto h-1 w-9 rounded-full bg-gray-200" />
            <div className="flex items-start justify-between gap-4">
              {title ? (
                <div>
                  <h2 className="m-0 pt-2 text-xl font-bold text-black">{title}</h2>
                  {description ? (
                    <p className="mt-2 mb-0 text-sm font-medium text-gray-400">{description}</p>
                  ) : null}
                </div>
              ) : (
                <span className="min-h-11" />
              )}
              <button
                aria-label={`${title ?? '바텀시트'} 닫기`}
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-3xl leading-none text-gray-300 active:bg-gray-100"
                onClick={onClose}
                type="button"
              >
                ×
              </button>
            </div>
          </header>

          {children}
        </div>
      </section>
    </div>
  )
}
