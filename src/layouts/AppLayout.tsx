import { Outlet } from 'react-router-dom'
import DesktopHeader from '../components/navigation/DesktopHeader'
import DesktopNav from '../components/navigation/DesktopNav'
import MobileBottomNavigation from '../components/navigation/MobileBottomNavigation'

export default function AppLayout() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-360 flex-col px-4 pt-5 pb-32 md:bg-white md:px-6 md:py-6 md:pt-6">
      <div className="hidden md:block">
        <DesktopHeader />
        <DesktopNav />
      </div>

      <Outlet />
      <MobileBottomNavigation />
    </main>
  )
}
