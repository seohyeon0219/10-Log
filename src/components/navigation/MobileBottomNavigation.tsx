import { useLocation, useNavigate } from 'react-router-dom'
import { useNavigationStore } from '../../stores/navigationStore'

type NavTab = {
  id: string
  label: string
}

const getActiveTabId = (pathname: string, tabs: NavTab[]) => {
  const fallbackTabId = tabs[0]?.id ?? ''
  const [, appPath, tabId] = pathname.split('/')

  if (appPath !== 'app') {
    return fallbackTabId
  }

  return tabs.some((tab) => tab.id === tabId) ? tabId : fallbackTabId
}

export default function MobileBottomNavigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const tabs = useNavigationStore((state) => state.tabs)
  const activeTabId = getActiveTabId(location.pathname, tabs)

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-40 border-t border-stone-200 bg-white/95 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.06)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId

          return (
            <button
              aria-current={isActive ? 'page' : undefined}
              className={[
                'min-h-12 rounded-xl px-2 text-xs font-extrabold transition',
                isActive ? 'bg-stone-950 text-white' : 'text-stone-400 hover:bg-stone-50 hover:text-stone-700',
              ].join(' ')}
              key={tab.id}
              onClick={() => navigate(`/app/${tab.id}`)}
              type="button"
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
