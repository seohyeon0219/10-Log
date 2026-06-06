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
    <div className="flex gap-8 overflow-x-auto border-b border-[var(--color-gray)] max-sm:gap-6" role="tablist">
      {tabs.map((tab) => (
        <button
          aria-selected={tab.id === activeTabId}
          className={[
            'min-h-10 flex-none cursor-pointer border-0 border-b-2 bg-transparent pb-2 font-bold',
            tab.id === activeTabId
              ? 'border-[var(--color-black)] text-[var(--color-black)]'
              : 'border-transparent text-[var(--color-gray)]',
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
