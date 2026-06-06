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
    <div className="flex gap-8 overflow-x-auto border-b border-[var(--color-gray)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[480px]:gap-6" role="tablist">
      {tabs.map((tab) => (
        <button
          aria-selected={tab.id === activeTabId}
          className={[
            'min-h-10 flex-none cursor-pointer border-0 border-b-2 border-transparent bg-transparent pb-2 font-bold text-[var(--color-gray)]',
            tab.id === activeTabId ? 'border-b-[var(--color-black)] text-[var(--color-black)]' : '',
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
