import { useEffect, useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import { categoryColors } from '../../constants/color'

type CategoryType = 'income' | 'expense'

type Category = {
  color: string
  id: string
  name: string
}

type CategoryManageContentProps = {
  expenseCategories: Category[]
  incomeCategories: Category[]
}

const typeOptions: Array<{ id: CategoryType; label: string }> = [
  { id: 'expense', label: '지출' },
  { id: 'income', label: '수입' },
]

const categoryLabelByType: Record<CategoryType, string> = {
  expense: '지출',
  income: '수입',
}

export default function CategoryManageContent({
  expenseCategories,
  incomeCategories,
}: CategoryManageContentProps) {
  const [activeType, setActiveType] = useState<CategoryType>('expense')
  const [editingCategoryId, setEditingCategoryId] = useState('')
  const [expenseItems, setExpenseItems] = useState(expenseCategories)
  const [incomeItems, setIncomeItems] = useState(incomeCategories)
  const [name, setName] = useState('')
  const [selectedColor, setSelectedColor] = useState(categoryColors[0])
  const activeItems = activeType === 'expense' ? expenseItems : incomeItems
  const isEditing = editingCategoryId.length > 0
  const trimmedName = name.trim()
  const canSave = trimmedName.length > 0

  useEffect(() => {
    setExpenseItems(expenseCategories)
    setIncomeItems(incomeCategories)
    setActiveType('expense')
    setEditingCategoryId('')
    setName('')
    setSelectedColor(categoryColors[0])
  }, [expenseCategories, incomeCategories])

  const resetForm = () => {
    setEditingCategoryId('')
    setName('')
    setSelectedColor(categoryColors[0])
  }

  const updateItems = (nextItems: Category[]) => {
    if (activeType === 'expense') {
      setExpenseItems(nextItems)
      return
    }

    setIncomeItems(nextItems)
  }

  const handleSave = () => {
    if (!canSave) {
      return
    }

    if (isEditing) {
      updateItems(
        activeItems.map((category) =>
          category.id === editingCategoryId
            ? { ...category, color: selectedColor, name: trimmedName }
            : category,
        ),
      )
      resetForm()
      return
    }

    updateItems([
      ...activeItems,
      {
        color: selectedColor,
        id: `${activeType}-${Date.now()}`,
        name: trimmedName,
      },
    ])
    resetForm()
  }

  const handleEdit = (category: Category) => {
    setEditingCategoryId(category.id)
    setName(category.name)
    setSelectedColor(category.color)
  }

  const handleDelete = (categoryId: string) => {
    if (activeType === 'expense') {
      setExpenseItems((items) => items.filter((category) => category.id !== categoryId))
    }

    if (activeType === 'income') {
      setIncomeItems((items) => items.filter((category) => category.id !== categoryId))
    }

    if (editingCategoryId === categoryId) {
      resetForm()
    }
  }

  return (
    <>
      <section className="rounded-2xl bg-gray-50 p-4">
        <div className="mb-5 grid grid-cols-2 rounded-xl bg-gray-100 p-1">
          {typeOptions.map((option) => (
            <button
              className={[
                'h-10 cursor-pointer rounded-lg text-sm font-bold transition',
                activeType === option.id ? 'bg-white text-black shadow-sm' : 'text-gray-400',
              ].join(' ')}
              key={option.id}
              onClick={() => {
                setActiveType(option.id)
                resetForm()
              }}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid gap-5">
          <Input
            label={`${categoryLabelByType[activeType]} 카테고리 이름`}
            onChange={(event) => setName(event.target.value)}
            placeholder="예: 식비"
            value={name}
          />

          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-3 p-0 text-sm font-semibold text-gray-500">색상</legend>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(36px,36px))] gap-3">
              {categoryColors.map((color) => (
                <button
                  aria-label={`색상 ${color}`}
                  aria-pressed={selectedColor === color}
                  className={[
                    'aspect-square min-h-9 cursor-pointer rounded-full border-4 transition',
                    selectedColor === color ? 'border-black' : 'border-transparent',
                  ].join(' ')}
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  type="button"
                />
              ))}
            </div>
          </fieldset>

          <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-3">
            <Button disabled={!isEditing && !name} onClick={resetForm} variant="soft">
              취소
            </Button>
            <Button disabled={!canSave} onClick={handleSave}>
              {isEditing ? '수정 저장' : '저장'}
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="m-0 text-base font-bold text-black">
            {categoryLabelByType[activeType]}
          </h3>
          <span className="text-sm font-bold text-gray-400">{activeItems.length}개</span>
        </div>

        <div className="grid gap-1">
          {activeItems.map((category) => (
            <div
              className="flex min-h-14 items-center gap-3 rounded-xl px-2 transition hover:bg-gray-50 active:bg-gray-100"
              key={category.id}
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="min-w-0 flex-1 truncate text-base font-bold text-black">
                {category.name}
              </span>
              <button
                className="cursor-pointer rounded-lg px-2 py-1 text-sm font-bold text-gray-400 transition hover:bg-gray-100 hover:text-black"
                onClick={() => handleEdit(category)}
                type="button"
              >
                수정
              </button>
              <button
                className="cursor-pointer rounded-lg px-2 py-1 text-sm font-bold text-gray-400 transition hover:bg-gray-100 hover:text-(--color-expense-red)"
                onClick={() => handleDelete(category.id)}
                type="button"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
