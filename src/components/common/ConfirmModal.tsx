import Button from './Button'
import ModalSurface from './ModalSurface'

type ConfirmModalProps = {
  cancelText?: string
  confirmText?: string
  description: string
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
}

export default function ConfirmModal({
  cancelText = '닫기',
  confirmText = '확인',
  description,
  isOpen,
  onClose,
  onConfirm,
  title,
}: ConfirmModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <ModalSurface className="max-h-dvh w-full max-w-90 overflow-y-auto rounded-2xl bg-white px-6 pt-7 pb-5 shadow-xl">
      <div className="mb-7 grid gap-2">
        <h2 className="m-0 text-lg font-bold text-black">{title}</h2>
        <p className="m-0 text-sm leading-6 font-semibold text-gray-500">{description}</p>
      </div>

      <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-3">
        <Button onClick={onClose} variant="soft">
          {cancelText}
        </Button>
        <Button onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </ModalSurface>
  )
}
