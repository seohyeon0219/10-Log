import type { ReactNode } from 'react'

type MenuGroupProps = {
  children: ReactNode
  title: string
}

export function MenuGroupDivider() {
  return <div className="mx-5 h-px bg-black/6" />
}

export default function MenuGroup({ children, title }: MenuGroupProps) {
  return (
    <div className="mb-4">
      <p className="mb-1 px-1 text-xs font-medium text-gray-400">{title}</p>
      <div className="overflow-hidden rounded-2xl glass-panel">
        {children}
      </div>
    </div>
  )
}
