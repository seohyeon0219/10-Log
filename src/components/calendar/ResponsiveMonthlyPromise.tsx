import { useIsDesktop } from '../../hooks/useIsDesktop'
import MonthlyPromiseBottomSheet from './MonthlyPromiseBottomSheet'
import MonthlyPromiseModal from './MonthlyPromiseModal'

type Props = Parameters<typeof MonthlyPromiseModal>[0]

export default function ResponsiveMonthlyPromise(props: Props) {
  const isDesktop = useIsDesktop()
  return isDesktop ? <MonthlyPromiseModal {...props} /> : <MonthlyPromiseBottomSheet {...props} />
}
