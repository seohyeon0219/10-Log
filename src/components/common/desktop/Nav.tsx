import Tabs from '../Tabs'

type NavTab = {
  id: string
  label: string
}

type NavProps = {
  activeTabId: string
  onChange: (tabId: string) => void
  tabs: NavTab[]
}

export default function Nav({ activeTabId, onChange, tabs }: NavProps) {
  return (
    <section className="mt-2">
      <Tabs activeTabId={activeTabId} onChange={onChange} tabs={tabs} />
    </section>
  )
}
