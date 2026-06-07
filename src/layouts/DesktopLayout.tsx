import type { ReactNode } from 'react'
import Header from '../components/desktop/Header'
import Nav from '../components/desktop/Nav'

type DesktopLayoutProps = {
  children: ReactNode
}

export default function DesktopLayout({ children }: DesktopLayoutProps) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-360 flex-col px-4 py-6 md:px-6">
      <Header />
      <Nav />
      {children}
    </main>
  )
}
