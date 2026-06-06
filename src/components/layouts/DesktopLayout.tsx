import type { ReactNode } from 'react'
import Header from '../common/desktop/Header'
import Nav from '../common/desktop/Nav'

type DesktopLayoutProps = {
  activeTabId: string
  children: ReactNode
  currentDate: Date
  monthlySummary: {
    expense: number
    fixedExpense: number
    fixedIncome: number
    income: number
  }
  navTabs: Array<{
    id: string
    label: string
  }>
  onNavChange: (tabId: string) => void
  onNextMonth: () => void
  onPrevMonth: () => void
}

export default function DesktopLayout({
  activeTabId,
  children,
  currentDate,
  monthlySummary,
  navTabs,
  onNavChange,
  onNextMonth,
  onPrevMonth,
}: DesktopLayoutProps) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-360 flex-col px-4 py-6 md:px-6">
      <Header
        currentDate={currentDate}
        monthlySummary={monthlySummary}
        onNextMonth={onNextMonth}
        onPrevMonth={onPrevMonth}
      />
      <Nav activeTabId={activeTabId} onChange={onNavChange} tabs={navTabs} />
      {children}
    </main>
  )
}
