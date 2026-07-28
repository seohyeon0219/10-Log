import { useRef, useState } from 'react'
import Input from '../common/Input'
import { categoryColors } from '../../constants/color'
import CategoryDeleteConfirm from './CategoryDeleteConfirm'

type CategoryType = 'income' | 'expense'

type Category = {
  color: string
  id: string
  name: string
}

type CategoryManageContentProps = {
  expenseCategories: Category[]
  initialType?: CategoryType
  incomeCategories: Category[]
  onClose?: () => void
  onCreateCategory?: (values: { color: string; name: string; type: CategoryType }) => Promise<void> | void
  onDeleteCategory?: (categoryId: string) => Promise<void> | void
  onUpdateCategory?: (
    categoryId: string,
    values: { color: string; name: string },
  ) => Promise<void> | void
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
  initialType = 'expense',
  incomeCategories,
  onClose,
  onCreateCategory,
  onDeleteCategory,
  onUpdateCategory,
}: CategoryManageContentProps) {
  const formSectionRef = useRef<HTMLElement>(null)
  const [activeType, setActiveType] = useState<CategoryType>(initialType)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [editingCategoryId, setEditingCategoryId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [name, setName] = useState('')
  const [selectedColor, setSelectedColor] = useState(categoryColors[0])
  const activeItems = activeType === 'expense' ? expenseCategories : incomeCategories
  const isEditing = editingCategoryId.length > 0
  const trimmedName = name.trim()
  const canSave = trimmedName.length > 0 && !isSaving

  const resetForm = () => {
    setEditingCategoryId('')
    setErrorMessage('')
    setName('')
    setSelectedColor(categoryColors[0])
  }

  const handleSave = async () => {
    if (!canSave) return

    setErrorMessage('')
    setIsSaving(true)

    try {
      if (isEditing) {
        await onUpdateCategory?.(editingCategoryId, { color: selectedColor, name: trimmedName })
        resetForm()
        return
      }
      await onCreateCategory?.({ color: selectedColor, name: trimmedName, type: activeType })
      resetForm()
      onClose?.()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '카테고리를 저장하지 못했어요.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategoryId(category.id)
    setName(category.name)
    setSelectedColor(category.color)

    let parent = formSectionRef.current?.parentElement
    while (parent) {
      const { overflowY } = getComputedStyle(parent)
      if ((overflowY === 'auto' || overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight) {
        parent.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      parent = parent.parentElement
    }
  }

  const handleDeleteClick = (category: Category) => {
    setDeleteTarget(category)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    const targetId = deleteTarget.id
    setDeleteTarget(null)
    setErrorMessage('')
    setIsSaving(true)

    try {
      await onDeleteCategory?.(targetId)
      if (editingCategoryId === targetId) resetForm()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '카테고리를 삭제하지 못했어요.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <CategoryDeleteConfirm
        category={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* 지출 / 수입 토글 */}
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-2xl bg-black/6 p-1">
        {typeOptions.map((option) => (
          <button
            className={[
              'h-11 rounded-xl text-sm font-bold transition-all duration-200',
              activeType === option.id
                ? 'bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.10)]'
                : 'text-(--color-text-muted) hover:text-black',
            ].join(' ')}
            disabled={isSaving}
            key={option.id}
            onClick={() => { setActiveType(option.id); resetForm() }}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* 이름 + 색상 폼 */}
      <section className="mb-5 grid gap-5 rounded-2xl bg-white/25 px-4 py-5" ref={formSectionRef}>
        <Input
          label={`${categoryLabelByType[activeType]} 카테고리 이름`}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 식비"
          value={name}
        />

        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-3 p-0 text-sm font-semibold text-(--color-text-muted)">색상</legend>
          <div className="grid grid-cols-5 gap-3">
            {categoryColors.map((color) => (
              <button
                aria-label={`색상 ${color}`}
                aria-pressed={selectedColor === color}
                className={[
                  'aspect-square w-full cursor-pointer rounded-full transition-all duration-150',
                  selectedColor === color
                    ? 'scale-110 shadow-[0_0_0_2.5px_white,0_0_0_4.5px_black]'
                    : 'hover:scale-105 active:scale-95',
                ].join(' ')}
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{ backgroundColor: color }}
                type="button"
              />
            ))}
          </div>
        </fieldset>
      </section>

      {/* 액션 버튼 */}
      <div className="mb-2 flex gap-2.5">
        <button
          className="flex h-12 shrink-0 items-center justify-center rounded-full glass-button px-5 text-sm font-bold text-(--color-text-muted) transition disabled:opacity-30"
          disabled={!isEditing && !name}
          onClick={resetForm}
          type="button"
        >
          취소
        </button>
        <button
          className="h-12 flex-1 rounded-full bg-black text-sm font-bold text-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] transition disabled:cursor-not-allowed disabled:opacity-35"
          disabled={!canSave}
          onClick={handleSave}
          type="button"
        >
          {isEditing ? '수정 저장' : '저장'}
        </button>
      </div>

      {errorMessage && (
        <p className="mb-2 text-sm font-semibold text-(--color-expense-red)" role="alert">
          {errorMessage}
        </p>
      )}

      {/* 카테고리 목록 */}
      <section className="mt-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-sm font-bold text-black">
            {categoryLabelByType[activeType]} 카테고리
          </span>
          <span className="rounded-full bg-black/7 px-2 py-0.5 text-xs font-bold text-(--color-text-muted)">
            {activeItems.length}
          </span>
        </div>

        <div className="grid gap-2">
          {activeItems.map((category) => (
            <div
              className={[
                'flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-150',
                editingCategoryId === category.id
                  ? 'bg-black/6 ring-1 ring-black/10'
                  : 'bg-white/25 hover:bg-white/40',
              ].join(' ')}
              key={category.id}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="min-w-0 flex-1 truncate text-[15px] font-bold text-black">
                {category.name}
              </span>
              <button
                aria-label={`${category.name} 수정`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-(--color-text-muted) transition hover:bg-white/60 hover:text-black disabled:opacity-30"
                disabled={isSaving}
                onClick={() => handleEdit(category)}
                type="button"
              >
                <svg fill="none" height="15" viewBox="0 0 15 15" width="15">
                  <path d="M11 1.5a1.5 1.5 0 012 2l-8.5 8.5-3 .75.75-3L11 1.5z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
                </svg>
              </button>
              <button
                aria-label={`${category.name} 삭제`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-(--color-text-muted) transition hover:bg-red-50/70 hover:text-(--color-expense-red) disabled:opacity-30"
                disabled={isSaving}
                onClick={() => handleDeleteClick(category)}
                type="button"
              >
                <svg fill="none" height="15" viewBox="0 0 15 15" width="15">
                  <path d="M2 4h11M5.5 4V2.5A.5.5 0 016 2h3a.5.5 0 01.5.5V4M6 7v4.5M9 7v4.5M3 4l.8 8.5A.5.5 0 004.3 13h6.4a.5.5 0 00.5-.5L12 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
                </svg>
              </button>
            </div>
          ))}

          {activeItems.length === 0 && (
            <div className="py-8 text-center text-sm font-semibold text-(--color-text-muted)">
              아직 카테고리가 없어요
            </div>
          )}
        </div>
      </section>
    </>
  )
}
