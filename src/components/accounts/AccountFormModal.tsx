import FormModal from '../common/FormModal'
import AccountFormContent from './AccountFormContent'
import type { Account, AccountFormValues } from '../../types/account'

type Props = {
  editTarget: Account | null
  isOpen: boolean
  onArchive: (id: string) => Promise<void>
  onClose: () => void
  onDelete: (id: string) => Promise<void>
  onSave: (values: AccountFormValues, id?: string) => Promise<void>
}

export default function AccountFormModal({
  editTarget,
  isOpen,
  onArchive,
  onClose,
  onDelete,
  onSave,
}: Props) {
  const isEdit = Boolean(editTarget)

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? '자산 수정' : '자산 추가'}
    >
      <AccountFormContent
        initialValues={editTarget ?? undefined}
        onArchive={editTarget ? () => onArchive(editTarget.id) : undefined}
        onDelete={editTarget ? () => onDelete(editTarget.id) : undefined}
        onSave={(values) => onSave(values, editTarget?.id)}
      />
    </FormModal>
  )
}
