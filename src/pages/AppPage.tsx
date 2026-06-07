import { Outlet } from 'react-router-dom'
import DesktopLayout from '../layouts/DesktopLayout'
import MobileLayout from '../layouts/MobileLayout'

export default function AppPage() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopLayout>
          <Outlet />
        </DesktopLayout>
      </div>
      <div className="block md:hidden">
        <MobileLayout>
          <Outlet />
        </MobileLayout>
      </div>
    </>
  )
}
