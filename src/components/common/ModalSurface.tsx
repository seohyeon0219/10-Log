import type { ReactNode } from 'react'

type ModalSurfaceProps = {
  children: ReactNode
  className: string
}

export default function ModalSurface({ children, className }: ModalSurfaceProps) {
  return (
    <div className="fixed inset-0 z-70 grid place-items-center bg-black/35 px-4 py-6">
      <section aria-modal="true" className={className} role="dialog">
        {children}
      </section>
    </div>
  )
}
