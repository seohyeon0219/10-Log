import { useLocation, useNavigate } from 'react-router-dom'
import { useNavigationStore } from '../../stores/navigationStore'

type NavTab = {
  id: string
  label: string
}

const navIconPathById: Record<string, string> = {
  calendar: 'M4 5.5A2.5 2.5 0 0 1 6.5 3h7A2.5 2.5 0 0 1 16 5.5v8A2.5 2.5 0 0 1 13.5 16h-7A2.5 2.5 0 0 1 4 13.5v-8ZM4.5 7h11M7 2.5v2M13 2.5v2',
  more: 'M5 10h.01M10 10h.01M15 10h.01',
  review: 'M5 4.5h10v8H8l-3 3v-11ZM7.5 7.5h5M7.5 10h3.5',
  stats: 'M4.5 15.5V10M10 15.5v-11M15.5 15.5V7.5',
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
    <nav className="fixed right-0 bottom-0 left-0 z-40 border-t border-gray-100 bg-white/95 px-3 pb-[max(8px,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-6px_20px_rgba(15,23,42,0.04)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId

          return (
            <button
              aria-current={isActive ? 'page' : undefined}
              className={[
                'flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-[11px] font-bold transition',
                isActive ? 'text-black-600' : 'text-gray-400 hover:text-gray-600',
              ].join(' ')}
              key={tab.id}
              onClick={() => navigate(`/app/${tab.id}`)}
              type="button"
            >
              <span
                className={[
                  'grid h-7 w-7 place-items-center rounded-full transition',
                  isActive ? 'text-black-600' : 'text-current',
                ].join(' ')}
              >
                <MobileNavIcon path={navIconPathById[tab.id]} />
              </span>
              {tab.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

type MobileNavIconProps = {
  path?: string
}

function MobileNavIcon({ path }: MobileNavIconProps) {
  if (!path) {
    return null
  }

  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 20 20" width="18">
      <path
        d={path}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  )
}
