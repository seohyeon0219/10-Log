import { useEffect, useRef, useState } from 'react'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'

type MenuItem = {
  label: string
  onClick: () => void
  danger?: boolean
}

type Props = {
  items: MenuItem[]
}

export default function DropdownMenu({ items }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  return (
    <div className="relative" ref={ref}>
      <button
        aria-label="더보기"
        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-black/5 active:opacity-60"
        onClick={() => setIsOpen((v) => !v)}
        type="button"
      >
        <EllipsisVerticalIcon className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-10 z-50 min-w-32 overflow-hidden rounded-2xl glass-card shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          {items.map((item, i) => (
            <div key={item.label}>
              {i > 0 && <div className="h-px bg-black/6" />}
              <button
                className={[
                  'w-full px-4 py-3 text-left text-sm font-semibold transition hover:bg-black/5',
                  item.danger ? 'text-(--color-expense-red)' : 'text-black',
                ].join(' ')}
                onClick={() => { setIsOpen(false); item.onClick() }}
                type="button"
              >
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
