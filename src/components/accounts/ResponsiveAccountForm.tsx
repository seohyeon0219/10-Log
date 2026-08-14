import { useIsDesktop } from '../../hooks/useIsDesktop'
import AccountFormBottomSheet from './AccountFormBottomSheet'
import AccountFormModal from './AccountFormModal'
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

export default function ResponsiveAccountForm(props: Props) {
  const isDesktop = useIsDesktop()
  return isDesktop ? <AccountFormModal {...props} /> : <AccountFormBottomSheet {...props} />
}
