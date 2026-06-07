import { useLocation, useNavigate } from 'react-router-dom'
import Tabs from '../common/Tabs'
import { useNavigationStore } from '../../stores/navigationStore'

type NavTab = {
  id: string
  label: string
}

const getActiveTabId = (pathname: string, tabs: NavTab[]) => {
  const fallbackTabId = tabs[0].id
  const [, appPath, tabId] = pathname.split('/')

  if (appPath !== 'app') {
    return fallbackTabId
  }

  return tabs.some((tab) => tab.id === tabId) ? tabId : fallbackTabId
}

export default function Nav() {
  const location = useLocation()
  const navigate = useNavigate()
  const tabs = useNavigationStore((state) => state.tabs)
  const activeTabId = getActiveTabId(location.pathname, tabs)

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
