import { Outlet } from 'react-router-dom'
import DesktopHeader from '../components/navigation/DesktopHeader'
import DesktopNav from '../components/navigation/DesktopNav'
import MobileAppBar from '../components/navigation/MobileAppBar'
import MobileBottomNavigation from '../components/navigation/MobileBottomNavigation'

export default function AppLayout() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-360 flex-col px-4 pt-16 pb-24 md:bg-white md:px-6 md:py-6 md:pt-6">
      <div className="hidden md:block">
        <DesktopHeader />
        <DesktopNav />
      </div>

      <Outlet />
      <MobileAppBar />
      <MobileBottomNavigation />
    </main>
  )
}
