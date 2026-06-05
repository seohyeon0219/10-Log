import type { Transaction, JournalEntry } from '../types'
import { formatAmount } from '../utils/format'

interface Props {
  year: number
  month: number
  transactions: Transaction[]
  journals: JournalEntry[]
  selectedDate: string | null
  onSelectDate: (date: string) => void
}

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

export default function Calendar({ year, month, transactions, journals, selectedDate, onSelectDate }: Props) {
  const firstDay = new Date(year, month - 1, 1).getDay()
  const lastDay = new Date(year, month, 0).getDate()

  const journalDates = new Set(journals.map(j => j.date))

  const txByDate = transactions.reduce<Record<string, { income: number; expense: number }>>((acc, tx) => {
    if (!acc[tx.date]) acc[tx.date] = { income: 0, expense: 0 }
    if (tx.type === 'income') acc[tx.date].income += tx.amount
    else acc[tx.date].expense += tx.amount
    return acc
  }, {})

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: lastDay }, (_, i) => i + 1),
  ]

  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="flex-1 p-2">
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-xs py-1 font-medium ${
              i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-100 border border-gray-100 rounded-xl overflow-hidden">
        {cells.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} className="bg-white min-h-[60px] md:min-h-[80px]" />
          }

          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dayTx = txByDate[dateStr]
          const hasJournal = journalDates.has(dateStr)
          const isSelected = selectedDate === dateStr
          const dayOfWeek = (firstDay + day - 1) % 7

          return (
            <button
              key={day}
              onClick={() => onSelectDate(dateStr)}
              className={`bg-white min-h-[60px] md:min-h-[80px] p-1.5 text-left flex flex-col hover:bg-gray-50 transition-colors ${
                isSelected ? 'ring-2 ring-inset ring-black' : ''
              }`}
            >
              <div className="flex items-center gap-0.5">
                <span className={`text-xs font-medium leading-none ${
                  dayOfWeek === 0 ? 'text-red-500' :
                  dayOfWeek === 6 ? 'text-blue-500' :
                  'text-gray-800'
                }`}>
                  {day}
                </span>
                {hasJournal && (
                  <span className="w-1 h-1 rounded-full bg-black inline-block mt-px" />
                )}
              </div>
              <div className="mt-auto w-full">
                {dayTx?.income ? (
                  <div className="text-blue-600 text-[10px] md:text-xs leading-tight font-medium truncate">
                    +{formatAmount(dayTx.income)}
                  </div>
                ) : null}
                {dayTx?.expense ? (
                  <div className="text-red-600 text-[10px] md:text-xs leading-tight font-medium truncate">
                    -{formatAmount(dayTx.expense)}
                  </div>
                ) : null}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
