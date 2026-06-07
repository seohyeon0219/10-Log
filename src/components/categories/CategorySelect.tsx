type CategoryOption = {
  color: string
  id: string
  name: string
}

type CategorySelectProps = {
  categories: CategoryOption[]
  label?: string
  onChange: (categoryId: string) => void
  selectedCategoryId: string
}

export default function CategorySelect({
  categories,
  label = '카테고리',
  onChange,
  selectedCategoryId,
}: CategorySelectProps) {
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="mb-3 p-0 text-sm font-semibold text-gray-500">{label}</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {categories.map((category) => (
          <button
            aria-pressed={category.id === selectedCategoryId}
            className={[
              'inline-flex min-h-11 min-w-0 cursor-pointer items-center gap-2 rounded-xl border px-3 text-left text-sm text-black transition',
              category.id === selectedCategoryId
                ? 'border-transparent bg-gray-100 font-bold'
                : 'border-gray-100 bg-white font-semibold text-gray-600 hover:bg-gray-50',
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
