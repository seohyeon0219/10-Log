import DesktopStatsContainer from '../containers/desktop/StatsContainer'
import MobileStatsContainer from '../containers/mobile/StatsContainer'

export default function StatsPage() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopStatsContainer />
      </div>
      <div className="block md:hidden">
        <MobileStatsContainer />
      </div>
    </>
  )
}
