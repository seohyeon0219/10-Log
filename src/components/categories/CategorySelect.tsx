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
  selectedCategoryIds: string[]
}

export default function CategorySelect({
  categories,
  label = '카테고리',
  onChange,
  onManageCategories,
  selectedCategoryIds,
}: CategorySelectProps) {
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <legend className="p-0 text-sm font-semibold text-gray-500">{label}</legend>
        {onManageCategories ? (
          <button
            className="flex min-h-11 cursor-pointer items-center rounded-lg border-0 bg-transparent px-3 text-sm font-medium text-gray-400 transition hover:bg-white/50 hover:text-black"
            onClick={onManageCategories}
            type="button"
          >
            관리
          </button>
        ) : null}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {categories.map((category) => {
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
