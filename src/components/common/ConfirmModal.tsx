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
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <section
        aria-modal="true"
        className="max-h-dvh w-full max-w-md overflow-y-auto rounded-xl bg-white p-8 shadow-2xl max-sm:p-4"
        role="dialog"
      >
        <div className="mb-6 grid gap-2">
          <h2 className="m-0 text-lg font-semibold text-black">{title}</h2>
          <p className="m-0 text-sm leading-6 text-(--color-dark-gray)">{description}</p>
        </div>

        <div className="grid gap-2">
          <Button onClick={onConfirm}>{confirmText}</Button>
          <Button onClick={onClose} variant="ghost">
            {cancelText}
          </Button>
        </div>
      </section>
    </div>
  )
}
