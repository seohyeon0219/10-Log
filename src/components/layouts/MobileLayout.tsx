import type { ReactNode } from 'react'

type MobileLayoutProps = {
  children: ReactNode
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-white px-4 py-6">
      {children}
    </main>
  )
}
