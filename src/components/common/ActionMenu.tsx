import { useState } from 'react'

type ActionMenuItem = {
  label: string
  onClick: () => void
  variant?: 'default' | 'danger'
}

type ActionMenuProps = {
  items?: ActionMenuItem[]
  onDelete?: () => void
  onEdit?: () => void
}

export default function ActionMenu({ items, onDelete, onEdit }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuItems = items ?? [
    { label: '수정', onClick: onEdit ?? (() => undefined) },
    { label: '삭제', onClick: onDelete ?? (() => undefined), variant: 'danger' as const },
  ]

  const handleItemClick = (onClick: () => void) => {
    onClick()
    setIsOpen(false)
  }

  return (
    <div className="relative inline-flex">
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="더보기"
        className="h-9 w-9 cursor-pointer rounded-lg border-0 bg-transparent text-2xl leading-none font-extrabold text-[var(--color-black)] hover:bg-[var(--color-warm-gray)] aria-expanded:bg-[var(--color-warm-gray)]"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        ⋮
      </button>

      {isOpen ? (
        <div
          className="absolute top-full right-0 z-20 mt-2 grid min-w-24 overflow-hidden rounded-lg border border-[var(--color-gray)] bg-[var(--color-white)] shadow-lg"
          role="menu"
        >
          {menuItems.map((item) => (
            <button
              className={[
                'min-h-10 cursor-pointer border-0 bg-transparent px-3 text-left text-[var(--color-black)] hover:bg-[var(--color-warm-gray)]',
                item.variant === 'danger' ? 'text-[var(--color-expense-red)]' : '',
              ].join(' ').trim()}
              key={item.label}
              onClick={() => handleItemClick(item.onClick)}
              role="menuitem"
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
