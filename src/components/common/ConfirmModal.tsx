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
    <div className="fixed inset-0 z-50 grid place-items-center bg-[rgb(17_17_17_/_40%)] p-4">
      <section
        aria-modal="true"
        className="max-h-[calc(100dvh-32px)] w-[min(420px,calc(100vw-32px))] overflow-y-auto rounded-[var(--radius-12)] bg-[var(--color-white)] p-6 shadow-[0_24px_60px_rgb(17_17_17_/_20%)] max-[480px]:w-full max-[480px]:p-4"
        role="dialog"
      >
        <div className="mb-6 grid gap-2">
          <h2 className="m-0 text-xl font-extrabold text-[var(--color-black)]">{title}</h2>
          <p className="m-0 leading-6 text-[var(--color-gray)]">{description}</p>
        </div>

        <div className="grid gap-3">
          <Button onClick={onConfirm}>{confirmText}</Button>
          <Button onClick={onClose} variant="secondary">
            {cancelText}
          </Button>
        </div>
      </section>
    </div>
  )
}
