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
  selectedCategoryId: string
}

export default function CategorySelect({
  categories,
  label = '카테고리',
  onChange,
  onManageCategories,
  selectedCategoryId,
}: CategorySelectProps) {
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <legend className="p-0 text-sm font-semibold text-gray-500">{label}</legend>
        {onManageCategories ? (
          <button
            className="cursor-pointer rounded-lg border-0 bg-transparent px-2 py-1 text-sm font-medium text-gray-400 transition hover:bg-white/50 hover:text-black"
            onClick={onManageCategories}
            type="button"
          >
            관리
          </button>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {categories.map((category) => (
          <button
            aria-pressed={category.id === selectedCategoryId}
            className={[
              'inline-flex min-h-11 min-w-0 cursor-pointer items-center gap-2 rounded-xl border px-3 text-left text-sm text-black transition',
              category.id === selectedCategoryId
                ? 'border-black/10 bg-black/6 font-bold'
                : 'border-white/70 bg-white/55 font-semibold text-gray-600 hover:bg-white/75',
            ].join(' ').trim()}
            key={category.id}
            onClick={() => onChange(category.id)}
            type="button"
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: category.color }} />
            <span className="min-w-0 truncate">{category.name}</span>
          </button>
        ))}
      </div>
    </fieldset>
  )
}
