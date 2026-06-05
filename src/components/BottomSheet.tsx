import type { Transaction } from '../types'
import { formatAmount } from '../utils/format'

interface Props {
  date: string
  transactions: Transaction[]
  onAddIncome: () => void
  onAddExpense: () => void
  onDelete: (id: string) => void
  onClose: () => void
}

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  const month = d.getMonth() + 1
  const day = d.getDate()
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
  const weekday = weekdays[d.getDay()]
  return `${month}월 ${day}일 (${weekday})`
}

export default function BottomSheet({ date, transactions, onAddIncome, onAddExpense, onDelete, onClose }: Props) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />

      {/* Sheet */}
      <div className="fixed left-0 right-0 bottom-0 z-40 bg-white rounded-t-2xl shadow-2xl max-h-[60vh] flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-4 py-2">
          <span className="font-bold text-base">{formatDateLabel(date)}</span>
          <button onClick={onClose} className="text-gray-400 hover:text-black p-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 px-4 pb-3">
          <button
            onClick={onAddIncome}
            className="flex-1 bg-blue-50 border border-blue-200 text-blue-700 font-bold py-2.5 rounded-xl hover:bg-blue-100 transition-colors"
          >
            + 수입
          </button>
          <button
            onClick={onAddExpense}
            className="flex-1 bg-red-50 border border-red-200 text-red-700 font-bold py-2.5 rounded-xl hover:bg-red-100 transition-colors"
          >
            - 지출
          </button>
        </div>

        {/* Transaction list */}
        <div className="overflow-y-auto flex-1 px-4 pb-4">
          {transactions.length === 0 ? (
            <p className="text-center text-gray-300 text-sm py-6">내역이 없어요</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {transactions.map(tx => (
                <li key={tx.id} className="flex items-center justify-between py-3 group">
                  <div className="flex items-center gap-2">
                    {tx.category && (
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tx.category.color }}
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {tx.category?.name ?? '미분류'}
                        {tx.is_fixed && <span className="ml-1 text-[10px] text-gray-400">고정</span>}
                      </div>
                      {tx.memo && <div className="text-xs text-gray-400">{tx.memo}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${tx.type === 'income' ? 'text-blue-600' : 'text-red-600'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatAmount(tx.amount)}
                    </span>
                    <button
                      onClick={() => onDelete(tx.id)}
                      className="text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
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
      </div>
    </>
  )
}
