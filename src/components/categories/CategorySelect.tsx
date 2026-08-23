import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

type CategoryOption = {
  color: string
  id: string
  name: string
}

type CategorySelectProps = {
  categories: CategoryOption[]
  label?: string
  onChange: (categoryId: string) => void
  onManageCategories?: () => void
  recentCategoryIds?: string[]
  selectedCategoryIds: string[]
}

const COLLAPSED_COUNT = 3

export default function CategorySelect({
  categories,
  label = '카테고리',
  onChange,
  onManageCategories,
  recentCategoryIds = [],
  selectedCategoryIds,
}: CategorySelectProps) {
  const sorted =
    recentCategoryIds.length > 0
      ? [
          ...categories
            .filter((c) => recentCategoryIds.includes(c.id))
            .sort((a, b) => recentCategoryIds.indexOf(a.id) - recentCategoryIds.indexOf(b.id)),
          ...categories.filter((c) => !recentCategoryIds.includes(c.id)),
        ]
      : categories

  const hasMore = sorted.length > COLLAPSED_COUNT
  const selectedHidden = hasMore && sorted.slice(COLLAPSED_COUNT).some((c) => selectedCategoryIds.includes(c.id))
  const [showAll, setShowAll] = useState(selectedHidden)
  const isExpanded = showAll || selectedHidden

  const top = sorted.slice(0, COLLAPSED_COUNT)
  const rest = sorted.slice(COLLAPSED_COUNT)

  const renderButton = (category: CategoryOption) => {
    const isSelected = selectedCategoryIds.includes(category.id)
    return (
      <button
        aria-pressed={isSelected}
        className={[
          'inline-flex min-h-9 min-w-0 cursor-pointer items-center gap-2 rounded-xl border border-white/60 bg-white/55 px-3 text-left text-xs text-black transition',
          isSelected ? 'font-bold' : 'font-medium text-gray-500 hover:bg-white/70',
        ].join(' ')}
        key={category.id}
        onClick={() => onChange(category.id)}
        style={isSelected ? {
          backgroundColor: `${category.color}18`,
          boxShadow: `inset 0 0 0 1.5px ${category.color}55`,
        } : undefined}
        type="button"
      >
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: category.color }} />
        <span className="min-w-0 truncate">{category.name}</span>
      </button>
    )
  }

  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-gray-400">{label}</span>
        <div className="flex items-center">
          {onManageCategories && (
            <button
              className="flex cursor-pointer items-center rounded-lg border-0 bg-transparent px-3 py-1 text-sm font-medium text-gray-500 transition hover:bg-white/50 hover:text-black"
              onClick={onManageCategories}
              type="button"
            >
              관리
            </button>
          )}
          {hasMore && (
            <button
              aria-label={isExpanded ? '접기' : '전체보기'}
              className="flex cursor-pointer items-center rounded-lg border-0 bg-transparent px-2 py-1 text-gray-500 transition hover:bg-white/50 hover:text-black"
              onClick={() => setShowAll((v) => !v)}
              type="button"
            >
              <ChevronDownIcon
                className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.2,0.9,0.25,1)]"
                style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {top.map(renderButton)}
      </div>

      {hasMore && (
        <div
          style={{
            overflow: 'hidden',
            maxHeight: isExpanded ? `${Math.ceil(rest.length / 3) * 48 + 8}px` : '0px',
            opacity: isExpanded ? 1 : 0,
            transition: 'max-height 0.32s cubic-bezier(0.2,0.9,0.25,1), opacity 0.22s',
          }}
        >
          <div className="grid grid-cols-3 gap-2 pt-2">
            {rest.map(renderButton)}
          </div>
        </div>
      )}
    </fieldset>
  )
}
