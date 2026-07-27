import { useLocation, useNavigate } from 'react-router-dom'
import Tabs from '../common/Tabs'
import { useNavigationStore } from '../../stores/navigationStore'
import { getActiveTabId } from '../../utils/navigation'

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
