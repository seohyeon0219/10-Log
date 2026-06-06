import DesktopPage from './DesktopPage'
import MobilePage from './MobilePage'

export default function AppPage() {
  return (
    <>
      <div className="block md:hidden">
        <MobilePage />
      </div>
      <div className="hidden md:block">
        <DesktopPage />
      </div>
    </>
  )
}
