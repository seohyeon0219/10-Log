import { useLocation, useNavigate } from 'react-router-dom'
import { useNavigationStore } from '../../stores/navigationStore'
import { getActiveTabId } from '../../utils/navigation'
import {
  CalendarIcon,
  EllipsisHorizontalIcon,
  BookOpenIcon,
  ChartBarIcon,
  HomeIcon,
} from '@heroicons/react/24/outline'
import {
  CalendarIcon as CalendarSolid,
  EllipsisHorizontalIcon as EllipsisSolid,
  BookOpenIcon as BookOpenSolid,
  ChartBarIcon as ChartSolid,
  HomeIcon as HomeSolid,
} from '@heroicons/react/24/solid'

const navIconsById: Record<string, { outline: React.ElementType; solid: React.ElementType }> = {
  log: { outline: BookOpenIcon, solid: BookOpenSolid },
  calendar: { outline: CalendarIcon, solid: CalendarSolid },
  home: { outline: HomeIcon, solid: HomeSolid },
  more: { outline: EllipsisHorizontalIcon, solid: EllipsisSolid },
  stats: { outline: ChartBarIcon, solid: ChartSolid },
}

export default function MobileBottomNavigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const tabs = useNavigationStore((state) => state.tabs)
  const activeTabId = getActiveTabId(location.pathname, tabs)

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-40 md:hidden">
      <div
        className="mx-3.5 mb-[calc(8px+env(safe-area-inset-bottom))] grid grid-cols-5 rounded-full border border-white/55 bg-[linear-gradient(135deg,rgba(255,255,255,0.78),rgba(255,255,255,0.55)_60%)] px-1.5 py-2.5 backdrop-blur-[26px] backdrop-saturate-190 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),inset_0_-6px_12px_rgba(0,0,0,0.05),0_12px_30px_rgba(0,0,0,0.10)]"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId
          const icons = navIconsById[tab.id]
          const Icon = isActive ? icons?.solid : icons?.outline

          return (
            <button
              aria-current={isActive ? 'page' : undefined}
              className="flex flex-col items-center justify-center gap-0.5 py-1"
              key={tab.id}
              onClick={() => navigate(`/app/${tab.id}`)}
              type="button"
            >
              {Icon ? (
                <Icon
                  aria-hidden="true"
                  className={[
                    'h-5.5 w-5.5 transition-colors duration-200',
                    isActive ? 'text-black' : 'text-(--color-text-sand)',
                  ].join(' ')}
                />
              ) : null}
              <span
                className={[
                  'text-[10px] leading-none tracking-tight transition-all duration-200',
                  isActive ? 'font-extrabold text-black' : 'font-medium text-(--color-text-sand)',
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
