import type { ReactNode } from 'react'

type MobileLayoutProps = {
  children: ReactNode
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <main className="flex min-h-dvh px-4 py-5">
      {children}
    </main>
  )
}
