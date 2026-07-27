import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type FloatingAddButtonProps = {
  onAddExpense: () => void
  onAddIncome: () => void
}

export default function FloatingAddButton({ onAddExpense, onAddIncome }: FloatingAddButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleAddIncome = () => {
    setIsOpen(false)
    onAddIncome()
  }

  const handleAddExpense = () => {
    setIsOpen(false)
    onAddExpense()
  }

  return createPortal(
    <>
      {/* 우하단 그라데이션 오버레이 */}
      <div
        className={[
          'pointer-events-none fixed inset-0 z-39 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        style={{
          background: 'radial-gradient(ellipse at 105% 110%, rgba(0,0,0,0.50) 0%, transparent 62%)',
        }}
      />

      {/* FAB 컨테이너 */}
      <div
        ref={containerRef}
        className="fixed right-5 bottom-[calc(90px+env(safe-area-inset-bottom))] z-41 flex flex-col items-end gap-5 md:bottom-8 md:right-8"
      >
        {/* 팬아웃 옵션 */}
        <div
          className={[
            'flex flex-col items-end gap-3 transition-all duration-200',
            isOpen
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none translate-y-3 opacity-0',
          ].join(' ')}
        >
          <button
            className="flex items-center gap-3"
            onClick={handleAddIncome}
            tabIndex={isOpen ? 0 : -1}
            type="button"
          >
            <span className="text-[14px] font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.6)]">
              수입
            </span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-(--color-income-blue) shadow-[0_6px_20px_rgba(24,99,220,0.45)]">
              <svg fill="none" height="18" viewBox="0 0 18 18" width="18">
                <path d="M9 3v12M3 9h12" stroke="white" strokeLinecap="round" strokeWidth="2.5" />
              </svg>
            </span>
          </button>

          <button
            className="flex items-center gap-3"
            onClick={handleAddExpense}
            tabIndex={isOpen ? 0 : -1}
            type="button"
          >
            <span className="text-[14px] font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.6)]">
              지출
            </span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-(--color-expense-red) shadow-[0_6px_20px_rgba(224,24,24,0.40)]">
              <svg fill="none" height="18" viewBox="0 0 18 18" width="18">
                <path d="M9 3v12M3 9h12" stroke="white" strokeLinecap="round" strokeWidth="2.5" />
              </svg>
            </span>
          </button>
        </div>

        {/* 메인 FAB */}
        <button
          aria-label={isOpen ? '닫기' : '거래 추가'}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/70 shadow-[0_8px_28px_rgba(0,0,0,0.30)] backdrop-blur-[20px] transition-all duration-200"
          onClick={() => setIsOpen((v) => !v)}
          type="button"
        >
          <svg
            className={['transition-transform duration-200', isOpen ? 'rotate-45' : ''].join(' ')}
            fill="none"
            height="22"
            viewBox="0 0 22 22"
            width="22"
          >
            <path d="M11 3v16M3 11h16" stroke="white" strokeLinecap="round" strokeWidth="2.5" />
          </svg>
        </button>
      </div>
    </>,
    document.body,
  )
}
