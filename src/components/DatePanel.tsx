import type { Transaction } from '../types'
import { formatAmount } from '../utils/format'

interface Props {
  date: string
  transactions: Transaction[]
  onAddIncome: () => void
  onAddExpense: () => void
  onDelete: (id: string) => void
}

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  const month = d.getMonth() + 1
  const day = d.getDate()
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
  const weekday = weekdays[d.getDay()]
  return `${month}월 ${day}일 (${weekday})`
}

export default function DatePanel({ date, transactions, onAddIncome, onAddExpense, onDelete }: Props) {
  return (
    <div className="border-t border-gray-100 bg-white px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-base">{formatDateLabel(date)}</span>
        <div className="flex gap-2">
          <button
            onClick={onAddIncome}
            className="bg-blue-50 border border-blue-200 text-blue-700 text-sm font-bold px-4 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
          >
            + 수입
          </button>
          <button
            onClick={onAddExpense}
            className="bg-red-50 border border-red-200 text-red-700 text-sm font-bold px-4 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
          >
            - 지출
          </button>
        </div>
      </div>

      {transactions.length === 0 ? (
        <p className="text-gray-300 text-sm py-4">내역이 없어요</p>
      ) : (
        <ul className="divide-y divide-gray-50">
          {transactions.map(tx => (
            <li key={tx.id} className="flex items-center justify-between py-2.5 group">
              <div className="flex items-center gap-2">
                {tx.category && (
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tx.category.color }}
                  />
                )}
                <div>
                  <span className="text-sm font-medium text-gray-800">
                    {tx.category?.name ?? '미분류'}
                  </span>
                  {tx.is_fixed && <span className="ml-1 text-[10px] text-gray-400">고정</span>}
                  {tx.memo && <div className="text-xs text-gray-400">{tx.memo}</div>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${tx.type === 'income' ? 'text-blue-600' : 'text-red-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatAmount(tx.amount)}
                </span>
                <button
                  onClick={() => onDelete(tx.id)}
                  className="text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
