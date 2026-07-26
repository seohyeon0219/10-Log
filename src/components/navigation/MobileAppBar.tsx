import { useLocation } from 'react-router-dom'
import { useCalendarStore } from '../../stores/calendarStore'
import { useNavigationStore } from '../../stores/navigationStore'
import CalendarMonthHeader from '../calendar/CalendarMonthHeader'
// import logo from '../../assets/logo.png'

const getActiveTabId = (pathname: string) => {
  const [, appPath, tabId] = pathname.split('/')
  return appPath === 'app' ? (tabId ?? '') : ''
}

export default function MobileAppBar() {
  const location = useLocation()
  const tabs = useNavigationStore((state) => state.tabs)
  const activeTabId = getActiveTabId(location.pathname) || tabs[0]?.id || ''
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0]

  const currentDate = useCalendarStore((state) => state.currentDate)
  const goNextMonth = useCalendarStore((state) => state.goNextMonth)
  const goPrevMonth = useCalendarStore((state) => state.goPrevMonth)

  const isCalendar = activeTabId === 'calendar'

  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex h-14 items-center border-b border-white/60 bg-(--color-glass-white) px-4 backdrop-blur-md md:hidden">
      {isCalendar ? (
        <CalendarMonthHeader
          currentDate={currentDate}
          onNextMonth={goNextMonth}
          onPrevMonth={goPrevMonth}
        />
      ) : (
        <h1 className="text-[17px] font-bold text-black">{activeTab?.label}</h1>
      )}
    </header>
  )
}
