import { useLocation, useNavigate } from 'react-router-dom'
import Tabs from '../common/Tabs'
import { useNavigationStore } from '../../stores/navigationStore'

const getActiveTabId = (pathname: string, fallbackTabId: string) => {
  const [, appPath, tabId] = pathname.split('/')

  if (appPath !== 'app') {
    return fallbackTabId
  }

  return tabId || fallbackTabId
}

export default function Nav() {
  const location = useLocation()
  const navigate = useNavigate()
  const tabs = useNavigationStore((state) => state.tabs)
  const activeTabId = getActiveTabId(location.pathname, tabs[0].id)

  return (
    <section className="mt-2">
      <Tabs
        activeTabId={activeTabId}
        onChange={(tabId: string) => navigate(`/app/${tabId}`)}
        tabs={tabs}
      />
    </section>
  )
}
