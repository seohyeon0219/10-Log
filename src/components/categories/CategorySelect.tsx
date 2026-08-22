import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

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
  const [showAll, setShowAll] = useState(false)

  const sorted =
    recentCategoryIds.length > 0
      ? [
          ...categories
            .filter((c) => recentCategoryIds.includes(c.id))
            .sort((a, b) => recentCategoryIds.indexOf(a.id) - recentCategoryIds.indexOf(b.id)),
          ...categories.filter((c) => !recentCategoryIds.includes(c.id)),
        ]
      : categories

  const selectedHidden =
    !showAll &&
    sorted.length > COLLAPSED_COUNT &&
    sorted.slice(COLLAPSED_COUNT).some((c) => selectedCategoryIds.includes(c.id))

  const displayed = showAll || sorted.length <= COLLAPSED_COUNT || selectedHidden ? sorted : sorted.slice(0, COLLAPSED_COUNT)
  const hasToggle = sorted.length > COLLAPSED_COUNT

  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <div className="flex items-center justify-between gap-3">
        <legend className="p-0 text-sm font-semibold text-gray-500">{label}</legend>
        <div className="flex items-center">
          {onManageCategories && (
            <button
              className="flex min-h-11 cursor-pointer items-center rounded-lg border-0 bg-transparent px-3 text-sm font-medium text-gray-400 transition hover:bg-white/50 hover:text-black"
              onClick={onManageCategories}
              type="button"
            >
              관리
            </button>
          )}
          {hasToggle && (
            <button
              className="flex min-h-11 cursor-pointer items-center rounded-lg border-0 bg-transparent px-2 text-gray-400 transition hover:bg-white/50 hover:text-black"
              onClick={() => setShowAll((v) => !v)}
              type="button"
              aria-label={showAll ? '접기' : '전체보기'}
            >
              {showAll
                ? <ChevronUpIcon className="h-4 w-4" />
                : <ChevronDownIcon className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {displayed.map((category) => {
          const isSelected = selectedCategoryIds.includes(category.id)
          return (
            <button
              aria-pressed={isSelected}
              className={[
                'inline-flex min-h-9 min-w-0 cursor-pointer items-center gap-2 rounded-xl border border-white/60 bg-white/55 px-3 text-left text-xs text-black transition',
                isSelected ? 'font-bold' : 'font-medium text-gray-500 hover:bg-white/70',
              ].join(' ').trim()}
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
        })}
      </div>
    </fieldset>
  )
}
