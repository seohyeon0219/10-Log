import { useState } from 'react'
import { mockSidePanelTabContentById, mockSidePanelTabs } from '../../mocks/data'
import Tabs from '../common/Tabs'

export default function DesktopSidePanel() {
  const [activeTabId, setActiveTabId] = useState(mockSidePanelTabs[0].id)
  const activeTabContent = mockSidePanelTabContentById[activeTabId] ?? ''

  return (
    <aside className="w-full">
      <Tabs activeTabId={activeTabId} onChange={setActiveTabId} tabs={mockSidePanelTabs} />
      <section className="min-h-80 border-b border-(--color-gray) py-6">
        <p className="m-0 text-base font-bold text-black">{activeTabContent}</p>
      </section>
    </aside>
  )
}
