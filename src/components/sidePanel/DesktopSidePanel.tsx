import { useState } from 'react'
import Tabs from '../common/Tabs'

const sidePanelTabs = [
  { id: 'stats', label: '통계' },
  { id: 'review', label: '회고' },
  { id: 'more', label: '더보기' },
]

const tabContentById: Record<string, string> = {
  stats: '통계 탭입니다',
  review: '회고 탭입니다',
  more: '더보기 탭입니다',
}

export default function DesktopSidePanel() {
  const [activeTabId, setActiveTabId] = useState(sidePanelTabs[0].id)
  const activeTabContent = tabContentById[activeTabId] ?? ''

  return (
    <aside className="w-full">
      <Tabs activeTabId={activeTabId} onChange={setActiveTabId} tabs={sidePanelTabs} />
      <section className="min-h-80 border-b border-(--color-gray) py-6">
        <p className="m-0 text-base font-bold text-black">{activeTabContent}</p>
      </section>
    </aside>
  )
}
