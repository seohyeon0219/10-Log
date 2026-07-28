import type { ReactNode } from 'react'
import Button from './Button'
import ModalSurface from './ModalSurface'

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
    <ModalSurface className="w-full max-w-90 rounded-2xl glass-card px-6 pt-7 pb-5 text-center shadow-xl">
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
    </ModalSurface>
  )
}
