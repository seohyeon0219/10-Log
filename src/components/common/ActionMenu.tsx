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
    <div className="common-action-menu">
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="더보기"
        className="common-action-menu-trigger"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        ⋮
      </button>

      {isOpen ? (
        <div className="common-action-menu-list" role="menu">
          {menuItems.map((item) => (
            <button
              className={`common-action-menu-item common-action-menu-item-${item.variant ?? 'default'}`}
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
