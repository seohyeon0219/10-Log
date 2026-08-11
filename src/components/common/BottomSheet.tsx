import { createPortal } from 'react-dom'
import { useRef, useCallback } from 'react'
import type { ReactNode, TouchEvent } from 'react'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'

const CLOSE_THRESHOLD = 100  // px 이상 내리면 닫힘
const VELOCITY_THRESHOLD = 0.4  // px/ms 이상 빠르게 내리면 닫힘

type BottomSheetProps = {
  children: ReactNode
  description?: string
  isOpen: boolean
  layer?: 1 | 2
  maxHeightClassName?: string
  onClose: () => void
  title?: string
}

export default function BottomSheet({
  children,
  description,
  isOpen,
  layer = 1,
  maxHeightClassName = 'max-h-[90dvh]',
  onClose,
  title,
}: BottomSheetProps) {
  useBodyScrollLock(isOpen)

  const sheetRef = useRef<HTMLElement>(null)
  const drag = useRef<{ startY: number; lastY: number; startTime: number } | null>(null)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    drag.current = {
      startY: e.touches[0].clientY,
      lastY: e.touches[0].clientY,
      startTime: Date.now(),
    }
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!drag.current || !sheetRef.current) return
    const touchY = e.touches[0].clientY
    drag.current.lastY = touchY
    const dy = touchY - drag.current.startY
    // 위로 당기거나 콘텐츠가 스크롤된 상태면 시트 드래그 아님
    if (dy <= 0 || sheetRef.current.scrollTop > 0) return
    sheetRef.current.style.transition = 'none'
    sheetRef.current.style.transform = `translateY(${dy}px)`
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!drag.current || !sheetRef.current) return
    const dy = drag.current.lastY - drag.current.startY
    const velocity = dy / (Date.now() - drag.current.startTime)
    drag.current = null
    if (dy > CLOSE_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
      sheetRef.current.style.transition = 'transform 0.25s ease-out'
      sheetRef.current.style.transform = `translateY(${window.innerHeight}px)`
      setTimeout(onClose, 250)
    } else {
      sheetRef.current.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)'
      sheetRef.current.style.transform = ''
    }
  }, [onClose])

  if (!isOpen) {
    return null
  }

  const backdropClass = `fixed inset-0 z-60 ${layer === 2 ? 'bg-black/15' : 'bg-black/35'}`

  const content = (
    <div className={backdropClass}>
      <section
        aria-modal="true"
        className={[
          'fixed right-0 bottom-0 left-0 overflow-y-auto overscroll-contain rounded-t-3xl glass-card px-5 pt-3 pb-[calc(20px+env(safe-area-inset-bottom))] shadow-xl md:px-6',
          maxHeightClassName,
        ].join(' ')}
        ref={sheetRef}
        role="dialog"
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
      >
        <div className="mx-auto w-full max-w-2xl">
          <header className="mb-5 grid gap-3">
            <span aria-hidden="true" className="mx-auto h-1 w-9 rounded-full bg-gray-200" />
            <div className="flex items-start justify-between gap-4">
              {title ? (
                <div>
                  <h2 className="m-0 pt-2 text-xl font-bold text-black">{title}</h2>
                  {description ? (
                    <p className="mt-2 mb-0 text-sm font-medium text-gray-400">{description}</p>
                  ) : null}
                </div>
              ) : (
                <span className="min-h-11" />
              )}
              <button
                aria-label={`${title ?? '바텀시트'} 닫기`}
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-3xl leading-none text-gray-500 transition interactive-icon"
                onClick={onClose}
                type="button"
              >
                ×
              </button>
            </div>
          </header>

          {children}
        </div>
      </section>
    </div>
  )

  return layer === 2 ? createPortal(content, document.body) : content
}
