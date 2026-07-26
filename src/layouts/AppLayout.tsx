import { Outlet } from 'react-router-dom'
import DesktopHeader from '../components/navigation/DesktopHeader'
import DesktopNav from '../components/navigation/DesktopNav'
import MobileBottomNavigation from '../components/navigation/MobileBottomNavigation'

export default function AppLayout() {
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10" style={{ background: 'var(--gradient-page-bg)' }} />
      <div aria-hidden="true" className="pointer-events-none fixed -top-16 -left-16 -z-10 h-[280px] w-[280px] rounded-full opacity-55" style={{ background: 'var(--color-blob-cream)', filter: 'blur(80px)' }} />
      <div aria-hidden="true" className="pointer-events-none fixed -right-20 -bottom-20 -z-10 h-[320px] w-[320px] rounded-full opacity-35" style={{ background: 'var(--color-muted-lavender)', filter: 'blur(75px)' }} />
      <div aria-hidden="true" className="pointer-events-none fixed -right-10 -z-10 h-[220px] w-[220px] rounded-full" style={{ top: '40%', background: 'var(--color-blob-blue)', filter: 'blur(85px)', opacity: 0.22 }} />
      <main className="mx-auto flex min-h-dvh w-full max-w-360 flex-col px-4 pt-5 pb-32 md:px-6 md:py-6 md:pt-6">
      <div className="hidden md:block">
        <DesktopHeader />
        <DesktopNav />
      </div>

      <Outlet />
      <MobileBottomNavigation />
    </main>
    </>
  )
}
