import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import DesktopHeader from '../components/navigation/DesktopHeader'
import DesktopNav from '../components/navigation/DesktopNav'
import MobileBottomNavigation from '../components/navigation/MobileBottomNavigation'
import { THEME_GRADIENTS, useThemeStore } from '../stores/themeStore'

const NO_NAV_ROUTES = ['/app/search', '/app/profile', '/app/review', '/app/reports', '/app/log/tag']

function isNoNavRoute(pathname: string) {
  return NO_NAV_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'))
}

export default function AppLayout() {
  const theme = useThemeStore((state) => state.theme)
  const { pathname } = useLocation()
  const hideNav = isNoNavRoute(pathname)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    document.documentElement.style.setProperty('--gradient-page-bg', THEME_GRADIENTS[theme])
  }, [theme])

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 [background:var(--gradient-page-bg)]" />
      <div aria-hidden="true" className="pointer-events-none fixed -top-16 -left-16 -z-10 h-[280px] w-[280px] rounded-full bg-(--color-blob-cream) opacity-55 blur-[80px]" />
      <div aria-hidden="true" className="pointer-events-none fixed -right-20 -bottom-20 -z-10 h-[320px] w-[320px] rounded-full bg-(--color-blob-apricot) opacity-40 blur-[85px]" />
      <div aria-hidden="true" className="pointer-events-none fixed top-[40%] -right-10 -z-10 h-55 w-55 rounded-full bg-(--color-blob-blue) opacity-[0.22] blur-[85px]" />
      <main
        className={[
          'mx-auto flex min-h-dvh w-full max-w-360 flex-col overflow-x-clip px-4 pt-safe-top md:px-6 md:py-6 md:pt-6',
          hideNav ? 'pb-8' : 'pb-32',
        ].join(' ')}
      >
        {!hideNav && (
          <div className="hidden md:block">
            <DesktopHeader />
            <DesktopNav />
          </div>
        )}

        <Outlet />

        {!hideNav && <MobileBottomNavigation />}
      </main>
    </>
  )
}
