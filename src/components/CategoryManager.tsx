import { useState } from 'react'
import type { Category, TransactionType } from '../types'

interface Props {
  categories: Category[]
  initialType?: TransactionType
  onAdd: (name: string, color: string, type: TransactionType) => void
  onUpdate: (id: string, name: string, color: string, type: TransactionType) => void
  onDelete: (id: string) => void
  onClose: () => void
}

const COLORS = ['#111827', '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280']

export default function CategoryManager({ categories, initialType = 'expense', onAdd, onUpdate, onDelete, onClose }: Props) {
  const [activeType, setActiveType] = useState<TransactionType>(initialType)
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [editingId, setEditingId] = useState<string | null>(null)
  const editing = categories.find(category => category.id === editingId)
  const visibleCategories = categories.filter(category => category.type === activeType)

  function resetForm() {
    setName('')
    setColor(COLORS[0])
    setEditingId(null)
  }

  function startEdit(category: Category) {
    setActiveType(category.type)
    setEditingId(category.id)
    setName(category.name)
    setColor(category.color)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    if (editing) onUpdate(editing.id, trimmed, color, activeType)
    else onAdd(trimmed, color, activeType)
    resetForm()
  }

  function changeType(type: TransactionType) {
    setActiveType(type)
    resetForm()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-t-2xl md:rounded-2xl px-5 py-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">카테고리 관리</h2>
            <p className="text-xs text-gray-400 mt-1">기록할 때 사용할 분류를 정리해요</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black p-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 mb-5">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {(['expense', 'income'] as TransactionType[]).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => changeType(type)}
                className={`flex-1 py-1.5 text-xs rounded-md font-bold transition-colors ${
                  activeType === type
                    ? type === 'expense' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                    : 'text-gray-500'
                }`}
              >
                {type === 'expense' ? '지출' : '수입'}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">이름</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="예: 배달, 교통, 월급"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-2 block">색상</label>
            <div className="grid grid-cols-10 gap-2">
              {COLORS.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setColor(item)}
                  className={`h-7 rounded-full border-2 ${color === item ? 'border-black' : 'border-white'}`}
                  style={{ backgroundColor: item }}
                  aria-label={`${item} 색상`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 bg-black text-white text-sm font-bold py-2.5 rounded-xl disabled:opacity-30"
            >
              {editing ? '수정 저장' : `${activeType === 'expense' ? '지출' : '수입'} 카테고리 추가`}
            </button>
            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 border border-gray-200 text-sm font-bold text-gray-500 rounded-xl"
              >
                취소
              </button>
            )}
          </div>
        </form>

        <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
          {visibleCategories.length === 0 ? (
            <p className="text-center text-gray-300 text-sm py-8">카테고리가 없어요</p>
          ) : (
            visibleCategories.map(category => (
              <div key={category.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: category.color }} />
                  <span className="text-sm font-medium text-gray-800 truncate">{category.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(category)}
                    className="px-2 py-1 text-xs text-gray-500 hover:text-black"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(category.id)}
                    className="px-2 py-1 text-xs text-gray-300 hover:text-red-500"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
