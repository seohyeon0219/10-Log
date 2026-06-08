import { Outlet } from 'react-router-dom'
import Header from '../components/navigation/DesktopHeader'
import Nav from '../components/navigation/DesktopNav'
import MobileBottomNavigation from '../components/navigation/MobileBottomNavigation'

export default function AppPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-360 flex-col bg-stone-50 px-4 pt-5 pb-24 md:bg-white md:px-6 md:py-6">
      <div className="hidden md:block">
        <Header />
        <Nav />
      </div>

      <Outlet />
      <MobileBottomNavigation />
    </main>
  )
}
