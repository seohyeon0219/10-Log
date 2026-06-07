import DesktopMoreContainer from '../containers/desktop/MoreContainer'
import MobileMoreContainer from '../containers/mobile/MoreContainer'

export default function MorePage() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopMoreContainer />
      </div>
      <div className="block md:hidden">
        <MobileMoreContainer />
      </div>
    </>
  )
}
