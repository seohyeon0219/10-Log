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
    <div className="flex gap-7 overflow-x-auto border-b border-gray-100 max-sm:gap-6" role="tablist">
      {tabs.map((tab) => (
        <button
          aria-selected={tab.id === activeTabId}
          className={[
            'min-h-11 flex-none cursor-pointer border-0 border-b-2 bg-transparent px-0 pb-2 text-base transition',
            tab.id === activeTabId
              ? 'border-black font-bold text-black'
              : 'border-transparent font-semibold text-gray-400 hover:text-gray-600',
          ].join(' ').trim()}
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
