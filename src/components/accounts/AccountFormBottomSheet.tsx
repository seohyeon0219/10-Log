import BottomSheet from '../common/BottomSheet'
import AccountFormContent from './AccountFormContent'
import type { Account, AccountFormValues } from '../../types/account'

type Props = {
  editTarget: Account | null
  isLiability: boolean
  isOpen: boolean
  onArchive?: (id: string) => Promise<void>
  onClose: () => void
  onDelete?: (id: string) => Promise<void>
  onSave: (values: AccountFormValues, id?: string) => Promise<void>
}

export default function AccountFormBottomSheet({
  editTarget,
  isLiability,
  isOpen,
  onArchive,
  onClose,
  onDelete,
  onSave,
}: Props) {
  const isEdit = Boolean(editTarget)
  const typeLabel = isLiability ? '부채' : '자산'

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `${typeLabel} 수정` : `${typeLabel} 추가`}
    >
      <AccountFormContent
        isLiability={isLiability}
        initialValues={editTarget ?? undefined}
        onArchive={editTarget && onArchive ? () => onArchive(editTarget.id) : undefined}
        onDelete={editTarget && onDelete ? () => onDelete(editTarget.id) : undefined}
        onSave={(values) => onSave(values, editTarget?.id)}
      />
    </BottomSheet>
  )
}
