import DesktopCalendarContainer from '../containers/desktop/CalendarContainer'
import MobileCalendarContainer from '../containers/mobile/CalendarContainer'

export default function CalendarPage() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopCalendarContainer />
      </div>
      <div className="block md:hidden">
        <MobileCalendarContainer />
      </div>
    </>
  )
}
