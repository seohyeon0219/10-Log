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
    <div
      ref={containerRef}
      className="fixed right-5 bottom-[calc(90px+env(safe-area-inset-bottom))] z-41 flex flex-col items-center gap-3 md:bottom-8 md:right-8"
    >
      {/* 팬아웃 옵션 */}
      <div
        className={[
          'flex flex-col items-center gap-3 transition-all duration-200',
          isOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-3 opacity-0',
        ].join(' ')}
      >
        <button
          aria-label="수입 추가"
          className="flex h-12 w-12 items-center justify-center rounded-full glass-card shadow-[0_4px_16px_rgba(24,99,220,0.2)] transition active:scale-90"
          onClick={handleAddIncome}
          tabIndex={isOpen ? 0 : -1}
          type="button"
        >
          <svg fill="none" height="18" viewBox="0 0 18 18" width="18">
            <path d="M9 3v12M3 9h12" stroke="var(--color-income-blue)" strokeLinecap="round" strokeWidth="2.5" />
          </svg>
        </button>

        <button
          aria-label="지출 추가"
          className="flex h-12 w-12 items-center justify-center rounded-full glass-card shadow-[0_4px_16px_rgba(224,24,24,0.2)] transition active:scale-90"
          onClick={handleAddExpense}
          tabIndex={isOpen ? 0 : -1}
          type="button"
        >
          <svg fill="none" height="18" viewBox="0 0 18 18" width="18">
            <path d="M3 9h12" stroke="var(--color-expense-red)" strokeLinecap="round" strokeWidth="2.5" />
          </svg>
        </button>
      </div>

      {/* 메인 FAB */}
      <button
        aria-label={isOpen ? '닫기' : '거래 추가'}
        className="flex h-14 w-14 items-center justify-center rounded-full glass-card shadow-[0_6px_24px_rgba(0,0,0,0.15)] transition-all duration-200"
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
          <path d="M11 3v16M3 11h16" stroke="black" strokeLinecap="round" strokeWidth="2.5" />
        </svg>
      </button>
    </div>,
    document.body,
  )
}
