import { useIsDesktop } from '../../hooks/useIsDesktop'
import BottomSheet from '../common/BottomSheet'
import FormModal from '../common/FormModal'
import ThemeSelectContent from './ThemeSelectContent'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function ResponsiveThemeSelect({ isOpen, onClose }: Props) {
  const isDesktop = useIsDesktop()
  return isDesktop ? (
    <FormModal isOpen={isOpen} onClose={onClose} title="화면 테마">
      <ThemeSelectContent onClose={onClose} />
    </FormModal>
  ) : (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="화면 테마">
      <ThemeSelectContent onClose={onClose} />
    </BottomSheet>
  )
}
