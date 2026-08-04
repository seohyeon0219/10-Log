import { useRef, useState } from 'react'
import { categoryColors } from '../constants/color'
import type { TransactionType } from '../types/finance'

type Category = {
  color: string
  id: string
  name: string
}

type UseCategoryFormParams = {
  activeType: TransactionType
  onClose?: () => void
  onCreateCategory?: (values: { color: string; name: string; type: TransactionType }) => Promise<void> | void
  onDeleteCategory?: (categoryId: string) => Promise<void> | void
  onUpdateCategory?: (categoryId: string, values: { color: string; name: string }) => Promise<void> | void
}

export function useCategoryForm({
  activeType,
  onClose,
  onCreateCategory,
  onDeleteCategory,
  onUpdateCategory,
}: UseCategoryFormParams) {
  const formSectionRef = useRef<HTMLElement>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [editingCategoryId, setEditingCategoryId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [name, setName] = useState('')
  const [selectedColor, setSelectedColor] = useState(categoryColors[0])

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

  const handleDeleteClick = (category: Category) => setDeleteTarget(category)

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

  return {
    del: {
      onCancel: () => setDeleteTarget(null),
      onConfirm: handleConfirmDelete,
      onDelete: handleDeleteClick,
      target: deleteTarget,
    },
    edit: {
      id: editingCategoryId,
      isEditing,
      onEdit: handleEdit,
    },
    form: {
      canSave,
      errorMessage,
      isSaving,
      name,
      onColorChange: setSelectedColor,
      onNameChange: setName,
      onReset: resetForm,
      onSave: handleSave,
      selectedColor,
    },
    formSectionRef,
  }
}
