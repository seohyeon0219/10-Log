import BottomSheet from '../common/BottomSheet'
import AccountFormContent from './AccountFormContent'
import type { Account, AccountFormValues } from '../../types/account'

type Props = {
  editTarget: Account | null
  defaultIsLiability?: boolean
  isOpen: boolean
  onArchive: (id: string) => Promise<void>
  onClose: () => void
  onDelete: (id: string) => Promise<void>
  onSave: (values: AccountFormValues, id?: string) => Promise<void>
}

export default function AccountFormBottomSheet({
  editTarget,
  defaultIsLiability,
  isOpen,
  onArchive,
  onClose,
  onDelete,
  onSave,
}: Props) {
  const isEdit = Boolean(editTarget)

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? '자산 수정' : '자산 추가'}
    >
      <AccountFormContent
        defaultIsLiability={defaultIsLiability}
        initialValues={editTarget ?? undefined}
        onArchive={editTarget ? () => onArchive(editTarget.id) : undefined}
        onDelete={editTarget ? () => onDelete(editTarget.id) : undefined}
        onSave={(values) => onSave(values, editTarget?.id)}
      />
    </BottomSheet>
  )
}
