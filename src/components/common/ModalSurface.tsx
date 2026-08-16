import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'

type ModalSurfaceProps = {
  children: ReactNode
  className: string
  layer?: 1 | 2
  onBackdropClick?: () => void
}

export default function ModalSurface({ children, className, layer = 1, onBackdropClick }: ModalSurfaceProps) {
  useBodyScrollLock(true)

  const backdropClass = `fixed inset-0 z-70 grid place-items-center px-4 py-6 ${layer === 2 ? 'bg-black/15' : 'bg-black/35'}`

  const content = (
    <div className={backdropClass} onClick={onBackdropClick}>
      <section aria-modal="true" className={className} role="dialog" onClick={(e) => e.stopPropagation()}>
        {children}
      </section>
    </div>
  )

  return layer === 2 ? createPortal(content, document.body) : content
}
