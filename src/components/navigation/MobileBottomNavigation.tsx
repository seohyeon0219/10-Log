import { useLocation, useNavigate } from 'react-router-dom'
import { useNavigationStore } from '../../stores/navigationStore'
import {
  CalendarIcon,
  EllipsisHorizontalIcon,
  ChatBubbleLeftEllipsisIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import {
  CalendarIcon as CalendarSolid,
  EllipsisHorizontalIcon as EllipsisSolid,
  ChatBubbleLeftEllipsisIcon as ChatSolid,
  ChartBarIcon as ChartSolid,
} from '@heroicons/react/24/solid'

type NavTab = {
  id: string
  label: string
}

const navIconsById: Record<string, { outline: React.ElementType; solid: React.ElementType }> = {
  calendar: { outline: CalendarIcon, solid: CalendarSolid },
  more: { outline: EllipsisHorizontalIcon, solid: EllipsisSolid },
  review: { outline: ChatBubbleLeftEllipsisIcon, solid: ChatSolid },
  stats: { outline: ChartBarIcon, solid: ChartSolid },
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
    <nav className="fixed right-0 bottom-0 left-0 z-40 border-t border-gray-100 bg-white/96 px-1 pb-[max(6px,env(safe-area-inset-bottom))] pt-0 shadow-[0_-4px_20px_rgba(15,23,42,0.05)] backdrop-blur-md md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId
          const icons = navIconsById[tab.id]
          const Icon = isActive ? icons?.solid : icons?.outline

          return (
            <button
              aria-current={isActive ? 'page' : undefined}
              className="group relative flex flex-col items-center justify-center gap-0.5 px-1 pt-2 pb-1.5"
              key={tab.id}
              onClick={() => navigate(`/app/${tab.id}`)}
              type="button"
            >
              <span
                className={[
                  'absolute top-0 left-1/2 -translate-x-1/2 h-[2.5px] rounded-full transition-all duration-300 ease-out',
                  isActive ? 'w-6 bg-black' : 'w-0 bg-transparent',
                ].join(' ')}
              />

              <span
                className={[
                  'flex items-center justify-center w-10 h-9 rounded-2xl transition-all duration-200',
                  isActive ? 'bg-gray-100' : 'group-active:bg-gray-100',
                ].join(' ')}
              >
                {Icon ? (
                  <Icon
                    className={[
                      'w-5.5 h-5.5 transition-all duration-200',
                      isActive ? 'text-black' : 'text-gray-400',
                    ].join(' ')}
                    aria-hidden="true"
                  />
                ) : null}
              </span>

              <span
                className={[
                  'text-[10px] leading-none tracking-tight transition-all duration-200',
                  isActive ? 'font-bold text-black' : 'font-medium text-gray-400',
                ].join(' ')}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
