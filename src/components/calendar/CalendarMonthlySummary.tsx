import { useState } from 'react'
import { formatAmount } from '../../utils/formatters'

type SummaryType = 'income' | 'expense' | 'total'

type CalendarMonthlySummaryProps = {
  income: number
  fixedIncome: number
  expense: number
  fixedExpense: number
}

export default function CalendarMonthlySummary({
  income,
  fixedIncome,
  expense,
  fixedExpense,
}: CalendarMonthlySummaryProps) {
  const [expandedType, setExpandedType] = useState<SummaryType | ''>('')
  const totalIncome = income + fixedIncome
  const totalExpense = expense + fixedExpense
  const total = totalIncome - totalExpense

  const toggleSummary = (type: SummaryType) => {
    setExpandedType((current) => (current === type ? '' : type))
  }

  const detailRows =
    expandedType === 'income'
      ? [
          { label: '고정 수입', value: fixedIncome, className: 'text-(--color-income-blue)' },
          { label: '변동 수입', value: income, className: 'text-(--color-income-blue)' },
        ]
      : expandedType === 'expense'
        ? [
            { label: '고정 지출', value: fixedExpense, className: 'text-(--color-expense-red)' },
            { label: '변동 지출', value: expense, className: 'text-(--color-expense-red)' },
          ]
        : expandedType === 'total'
          ? [
              { label: '고정 수입', value: fixedIncome, className: 'text-(--color-income-blue)' },
              { label: '변동 수입', value: income, className: 'text-(--color-income-blue)' },
              { label: '고정 지출', value: fixedExpense, className: 'text-(--color-expense-red)' },
              { label: '변동 지출', value: expense, className: 'text-(--color-expense-red)' },
            ]
          : []

  return (
    <section className="w-full rounded-[26px] glass-card my-5 p-4.5">
      <div className="grid grid-cols-3">
        <button
          type="button"
          className="min-w-0 rounded-xl text-center transition interactive-chip"
          onClick={() => toggleSummary('income')}
        >
          <p className="mb-1 text-xs font-semibold text-(--ink-3)">수입</p>
          <strong className="block min-w-0 truncate whitespace-nowrap text-base font-bold text-(--color-income-blue)">
            {formatAmount(totalIncome)}원
          </strong>
        </button>

        <button
          type="button"
          className="min-w-0 rounded-xl text-center transition interactive-chip"
          onClick={() => toggleSummary('expense')}
        >
          <p className="mb-1 text-xs font-semibold text-(--ink-3)">지출</p>
          <strong className="block min-w-0 truncate whitespace-nowrap text-base font-bold text-(--color-expense-red)">
            {formatAmount(totalExpense)}원
          </strong>
        </button>

        <button
          type="button"
          className="min-w-0 rounded-xl text-center transition interactive-chip"
          onClick={() => toggleSummary('total')}
        >
          <p className="mb-1 text-xs font-semibold text-(--ink-3)">합계</p>
          <strong
            className={[
              'block min-w-0 truncate whitespace-nowrap text-base font-bold',
              total >= 0 ? 'text-(--color-income-blue)' : 'text-(--color-expense-red)',
            ].join(' ')}
          >
            {total >= 0 ? '+' : '-'}
            {formatAmount(Math.abs(total))}원
          </strong>
        </button>
      </div>

      {detailRows.length > 0 && (
        <>
          <div className="my-4 border-t border-black/8" />
          <div className="grid gap-2">
            {detailRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-xs font-medium text-(--ink-3)">{row.label}</span>
                <strong className={['text-sm font-bold', row.className].join(' ')}>
                  {formatAmount(row.value)}원
                </strong>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
