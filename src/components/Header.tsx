import { useState } from 'react'
import type { Transaction } from '../types'
import { formatAmount } from '../utils/format'

interface Props {
  year: number
  month: number
  transactions: Transaction[]
  showMobileSummary?: boolean
  onPrev: () => void
  onNext: () => void
}

function Summary({ transactions }: { transactions: Transaction[] }) {
  const income = transactions.filter(t => t.type === 'income')
  const expense = transactions.filter(t => t.type === 'expense')

  const incomeFixed = income.filter(t => t.is_fixed).reduce((s, t) => s + t.amount, 0)
  const incomeVar = income.filter(t => !t.is_fixed).reduce((s, t) => s + t.amount, 0)
  const incomeTotal = incomeFixed + incomeVar

  const expenseFixed = expense.filter(t => t.is_fixed).reduce((s, t) => s + t.amount, 0)
  const expenseVar = expense.filter(t => !t.is_fixed).reduce((s, t) => s + t.amount, 0)
  const expenseTotal = expenseFixed + expenseVar

  const net = incomeTotal - expenseTotal

  return { incomeFixed, incomeVar, incomeTotal, expenseFixed, expenseVar, expenseTotal, net }
}

export default function Header({ year, month, transactions, showMobileSummary = true, onPrev, onNext }: Props) {
  const [openDropdown, setOpenDropdown] = useState<'income' | 'expense' | null>(null)
  const s = Summary({ transactions })

  const toggle = (type: 'income' | 'expense') => {
    setOpenDropdown(prev => prev === type ? null : type)
  }

  return (
    <div className="bg-white border-b border-gray-100 px-4 pt-3 pb-2 relative z-20">
      {/* Month navigation */}
      <div className="flex items-center justify-center gap-4 mb-3">
        <button onClick={onPrev} className="p-1 text-gray-500 hover:text-black">
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
            <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="text-lg font-bold text-black">{year}년 {month}월</span>
        <button onClick={onNext} className="p-1 text-gray-500 hover:text-black">
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
            <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Summary boxes */}
      <div className={`${showMobileSummary ? 'flex' : 'hidden'} md:flex gap-2`}>
        {/* Income */}
        <button
          onClick={() => toggle('income')}
          className="flex-1 rounded-xl px-3 py-2 text-left hover:bg-gray-50"
        >
          <div className="text-xs text-gray-400">수입</div>
          <div className="text-base font-bold text-blue-700 mt-0.5">{formatAmount(s.incomeTotal)}</div>
        </button>

        {/* Expense */}
        <button
          onClick={() => toggle('expense')}
          className="flex-1 rounded-xl px-3 py-2 text-left hover:bg-gray-50"
        >
          <div className="text-xs text-gray-400">지출</div>
          <div className="text-base font-bold text-red-700 mt-0.5">{formatAmount(s.expenseTotal)}</div>
        </button>

        {/* Net */}
        <div className="flex-1 rounded-xl px-3 py-2">
          <div className="text-xs text-gray-400">합계</div>
          <div className={`text-base font-bold mt-0.5 ${s.net >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
            {s.net >= 0 ? '+' : ''}{formatAmount(s.net)}
          </div>
        </div>
      </div>

      {/* Income dropdown */}
      {openDropdown === 'income' && (
        <div className={`${showMobileSummary ? 'block' : 'hidden'} md:block mt-2 bg-white px-4 py-3 text-sm`}>
          <div className="flex justify-between py-1">
            <span className="text-gray-600">수입</span>
            <span className="text-blue-700 font-medium">{formatAmount(s.incomeVar)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-600">고정수입</span>
            <span className="text-blue-700 font-medium">{formatAmount(s.incomeFixed)}</span>
          </div>
          <div className="mt-1 pt-2 flex justify-between font-bold">
            <span>합계</span>
            <span className="text-blue-700">{formatAmount(s.incomeTotal)}</span>
          </div>
        </div>
      )}

      {/* Expense dropdown */}
      {openDropdown === 'expense' && (
        <div className={`${showMobileSummary ? 'block' : 'hidden'} md:block mt-2 bg-white px-4 py-3 text-sm`}>
          <div className="flex justify-between py-1">
            <span className="text-gray-600">지출</span>
            <span className="text-red-700 font-medium">{formatAmount(s.expenseVar)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-600">고정지출</span>
            <span className="text-red-700 font-medium">{formatAmount(s.expenseFixed)}</span>
          </div>
          <div className="mt-1 pt-2 flex justify-between font-bold">
            <span>합계</span>
            <span className="text-red-700">{formatAmount(s.expenseTotal)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
