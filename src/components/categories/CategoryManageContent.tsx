import { useState } from 'react'
import { categoryColors } from '../../constants/color'
import { useCategoryForm } from '../../hooks/useCategoryForm'
import type { TransactionType } from '../../types/finance'
import Input from '../common/Input'
import CategoryDeleteConfirm from './CategoryDeleteConfirm'

type Category = {
  color: string
  id: string
  name: string
}

type CategoryManageContentProps = {
  expenseCategories: Category[]
  initialType?: TransactionType
  incomeCategories: Category[]
  onClose?: () => void
  onCreateCategory?: (values: { color: string; name: string; type: TransactionType }) => Promise<void> | void
  onDeleteCategory?: (categoryId: string) => Promise<void> | void
  onUpdateCategory?: (
    categoryId: string,
    values: { color: string; name: string },
  ) => Promise<void> | void
}

const typeOptions: Array<{ id: TransactionType; label: string }> = [
  { id: 'expense', label: '지출' },
  { id: 'income', label: '수입' },
]

const categoryLabelByType: Record<TransactionType, string> = {
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
  const [activeType, setActiveType] = useState<TransactionType>(initialType)
  const { del, edit, form, formSectionRef } = useCategoryForm({ activeType, onClose, onCreateCategory, onDeleteCategory, onUpdateCategory })

  const activeItems = activeType === 'expense' ? expenseCategories : incomeCategories

  return (
    <>
      <CategoryDeleteConfirm
        category={del.target}
        onCancel={del.onCancel}
        onConfirm={del.onConfirm}
      />

      {/* 지출 / 수입 토글 */}
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-2xl bg-black/6 p-1">
        {typeOptions.map((option) => (
          <button
            className={[
              'h-11 rounded-xl text-[15px] font-bold transition-all duration-200',
              activeType === option.id
                ? 'bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.10)]'
                : 'text-(--color-text-muted) hover:text-black',
            ].join(' ')}
            disabled={form.isSaving}
            key={option.id}
            onClick={() => { setActiveType(option.id); form.onReset() }}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* 이름 + 색상 폼 */}
      <section className="mb-6 grid gap-5" ref={formSectionRef}>
        <Input
          label="카테고리 이름"
          onChange={(e) => form.onNameChange(e.target.value)}
          placeholder="예: 식비"
          value={form.name}
        />

        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-3 p-0 text-sm font-semibold text-(--color-text-muted)">색상</legend>
          <div className="flex flex-wrap gap-3">
            {categoryColors.map((color) => (
              <button
                aria-label={`색상 ${color}`}
                aria-pressed={form.selectedColor === color}
                className={[
                  'h-9 w-9 cursor-pointer rounded-full transition-all duration-150',
                  form.selectedColor === color
                    ? 'scale-110 shadow-[0_0_0_2.5px_white,0_0_0_4.5px_black]'
                    : 'hover:scale-105 active:scale-95',
                ].join(' ')}
                key={color}
                onClick={() => form.onColorChange(color)}
                style={{ backgroundColor: color }}
                type="button"
              />
            ))}
          </div>
        </fieldset>
      </section>

      {/* 액션 버튼 */}
      <div className="flex gap-3">
        {(edit.isEditing || !!form.name) && (
          <button
            className="flex h-12 shrink-0 items-center justify-center rounded-xl glass-button px-5 text-sm font-bold text-(--color-text-muted) transition"
            onClick={form.onReset}
            type="button"
          >
            취소
          </button>
        )}
        <button
          className="h-12 flex-1 rounded-xl bg-black text-sm font-bold text-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] transition disabled:cursor-not-allowed disabled:opacity-35"
          disabled={!form.canSave}
          onClick={form.onSave}
          type="button"
        >
          {edit.isEditing ? '수정 저장' : '저장'}
        </button>
      </div>

      {form.errorMessage && (
        <p className="mt-3 text-sm font-semibold text-(--color-expense-red)" role="alert">
          {form.errorMessage}
        </p>
      )}

      <div className="my-7 h-px bg-black/8" />

      {/* 카테고리 목록 */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <span className="text-sm font-bold text-black">
            {categoryLabelByType[activeType]} 카테고리
          </span>
          <span className="rounded-full bg-black/7 px-2 py-0.5 text-xs font-bold text-(--color-text-muted)">
            {activeItems.length}
          </span>
        </div>

        <div className="grid gap-2.5">
          {activeItems.map((category) => (
            <div
              className={[
                'flex items-center gap-3 rounded-2xl px-4 transition-all duration-150',
                edit.id === category.id
                  ? 'bg-black/6 ring-1 ring-black/10'
                  : 'interactive-row',
              ].join(' ')}
              key={category.id}
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="min-w-0 flex-1 truncate text-[15px] font-bold text-black">
                {category.name}
              </span>
              <button
                aria-label={`${category.name} 수정`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-(--color-text-muted) transition interactive-icon hover:text-black disabled:opacity-30"
                disabled={form.isSaving}
                onClick={() => edit.onEdit(category)}
                type="button"
              >
                <svg fill="none" height="16" viewBox="0 0 15 15" width="16">
                  <path d="M11 1.5a1.5 1.5 0 012 2l-8.5 8.5-3 .75.75-3L11 1.5z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
                </svg>
              </button>
              <button
                aria-label={`${category.name} 삭제`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-(--color-text-muted) transition interactive-icon hover:text-(--color-expense-red) disabled:opacity-30"
                disabled={form.isSaving}
                onClick={() => del.onDelete(category)}
                type="button"
              >
                <svg fill="none" height="16" viewBox="0 0 15 15" width="16">
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
