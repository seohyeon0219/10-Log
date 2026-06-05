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
    <div className="common-modal-backdrop">
      <section aria-modal="true" className="common-confirm-modal" role="dialog">
        <div className="common-confirm-modal-copy">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        <div className="common-confirm-modal-actions">
          <Button onClick={onConfirm}>{confirmText}</Button>
          <Button onClick={onClose} variant="secondary">
            {cancelText}
          </Button>
        </div>
      </section>
    </div>
  )
}
