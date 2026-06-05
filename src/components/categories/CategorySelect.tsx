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
    <fieldset className="common-category-select">
      <legend>{label}</legend>
      <div className="common-category-select-list">
        {categories.map((category) => (
          <button
            aria-pressed={category.id === selectedCategoryId}
            className="common-category-chip"
            key={category.id}
            onClick={() => onChange(category.id)}
            type="button"
          >
            <span style={{ backgroundColor: category.color }} />
            {category.name}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
