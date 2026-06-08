import type { ReactNode } from 'react'
import Button from './Button'

type FeedbackModalProps = {
  confirmText?: string
  description: string
  icon?: ReactNode
  isOpen: boolean
  onClose: () => void
  title: string
}

export default function FeedbackModal({
  confirmText = '확인',
  description,
  icon,
  isOpen,
  onClose,
  title,
}: FeedbackModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4 py-6">
      <section
        aria-modal="true"
        className="w-full max-w-90 rounded-2xl bg-white px-6 pt-7 pb-5 text-center shadow-xl"
        role="dialog"
      >
        {icon ? (
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-amber-100 text-xl font-black text-amber-700">
            {icon}
          </div>
        ) : null}
        <h2 className="mt-4 break-keep text-xl font-black text-stone-950">{title}</h2>
        <p className="mt-2 whitespace-pre-line break-keep text-sm leading-6 font-bold text-stone-500">
          {description}
        </p>
        <Button className="mt-6" onClick={onClose}>
          {confirmText}
        </Button>
      </section>
    </div>
  )
}
