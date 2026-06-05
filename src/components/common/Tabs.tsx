type TabItem = {
  id: string
  label: string
}

type TabsProps = {
  activeTabId: string
  tabs: TabItem[]
  onChange: (tabId: string) => void
}

export default function Tabs({ activeTabId, onChange, tabs }: TabsProps) {
  return (
    <div className="common-tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          aria-selected={tab.id === activeTabId}
          className="common-tab"
          key={tab.id}
          onClick={() => onChange(tab.id)}
          role="tab"
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
