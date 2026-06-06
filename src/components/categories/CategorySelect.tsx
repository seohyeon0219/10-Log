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
      <legend className="mb-3 p-0 text-sm font-bold text-black">{label}</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {categories.map((category) => (
          <button
            aria-pressed={category.id === selectedCategoryId}
            className={[
              'inline-flex min-h-11 min-w-0 cursor-pointer items-center gap-2 rounded-lg border border-(--color-gray) bg-white px-3 text-left text-sm text-black',
              category.id === selectedCategoryId
                ? 'border-black bg-(--color-warm-gray) font-bold'
                : 'font-semibold',
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
