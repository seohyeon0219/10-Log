import { useEffect, useState } from 'react'
import type { Category, TransactionType } from '../types'

interface Props {
  type: 'income' | 'expense'
  defaultDate: string
  categories: Category[]
  onManageCategories: (type: TransactionType) => void
  onSubmit: (data: {
    type: 'income' | 'expense'
    amount: number
    category_id: string
    date: string
    memo: string | null
    is_fixed: boolean
  }) => void
  onClose: () => void
}

export default function TransactionForm({ type, defaultDate, categories, onManageCategories, onSubmit, onClose }: Props) {
  const filteredCategories = categories.filter(category => category.type === type)
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState(filteredCategories[0]?.id ?? '')
  const [date, setDate] = useState(defaultDate)
  const [memo, setMemo] = useState('')
  const [isFixed, setIsFixed] = useState(false)

  const isIncome = type === 'income'
  const canSubmit = Boolean(amount && categoryId && date)

  useEffect(() => {
    const hasSelectedCategory = filteredCategories.some(category => category.id === categoryId)
    if (!hasSelectedCategory) setCategoryId(filteredCategories[0]?.id ?? '')
  }, [filteredCategories, categoryId])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const num = parseInt(amount.replace(/,/g, ''), 10)
    if (!num || num <= 0 || !categoryId || !date) return
    onSubmit({
      type,
      amount: num,
      category_id: categoryId,
      date,
      memo: memo || null,
      is_fixed: isFixed,
    })
    onClose()
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    setAmount(raw ? Number(raw).toLocaleString('ko-KR') : '')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-t-2xl md:rounded-2xl px-5 py-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">
            {isIncome ? '수입 기록' : '지출 기록'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black p-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">금액</label>
            <div className={`flex items-center border-b-2 ${isIncome ? 'border-blue-500' : 'border-black'} pb-1`}>
              <span className={`text-lg font-medium mr-1 ${isIncome ? 'text-blue-600' : 'text-red-600'}`}>
                {isIncome ? '+' : '-'}
              </span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={amount}
                onChange={handleAmountChange}
                className="flex-1 text-xl font-bold outline-none bg-transparent"
                autoFocus
              />
              <span className="text-gray-400 text-sm">원</span>
            </div>
          </div>

          {/* Category */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-400 block">카테고리</label>
              <button
                type="button"
                onClick={() => onManageCategories(type)}
                className="text-xs font-bold text-gray-500 hover:text-black"
              >
                관리
              </button>
            </div>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
            >
              {filteredCategories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
              {filteredCategories.length === 0 && (
                <option value="">카테고리 없음</option>
              )}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">날짜</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>

          {/* Memo */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">메모</label>
            <input
              type="text"
              placeholder="메모를 입력하세요"
              value={memo}
              onChange={e => setMemo(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>

          {/* Fixed */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFixed}
              onChange={e => setIsFixed(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-600">고정 {isIncome ? '수입' : '지출'}</span>
          </label>

          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-bold text-white transition-opacity ${
              isIncome ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
            } ${!canSubmit ? 'opacity-40' : ''}`}
            disabled={!canSubmit}
          >
            저장
          </button>
        </form>
      </div>
    </div>
  )
}
