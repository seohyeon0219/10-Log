import { useIsDesktop } from '../../hooks/useIsDesktop'
import CategoryManageBottomSheet from './CategoryManageBottomSheet'
import CategoryManageModal from './CategoryManageModal'

type Props = Parameters<typeof CategoryManageModal>[0]

export default function ResponsiveCategoryManage(props: Props) {
  const isDesktop = useIsDesktop()
  return isDesktop ? <CategoryManageModal {...props} /> : <CategoryManageBottomSheet {...props} />
}
