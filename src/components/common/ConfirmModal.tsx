import Button from './Button'

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
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4 py-6">
      <section
        aria-modal="true"
        className="max-h-dvh w-full max-w-[360px] overflow-y-auto rounded-2xl bg-white px-6 pt-7 pb-5 shadow-xl"
        role="dialog"
      >
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
      </section>
    </div>
  )
}
