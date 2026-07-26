import { useState } from 'react'

type SummaryType = 'income' | 'expense' | 'total'

type CalendarMonthlySummaryProps = {
  income: number
  fixedIncome: number
  expense: number
  fixedExpense: number
}

const formatAmount = (amount: number) => amount.toLocaleString('ko-KR')

const glassCardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.45)',
  backdropFilter: 'blur(20px) saturate(170%)',
  WebkitBackdropFilter: 'blur(20px) saturate(170%)',
  border: '1px solid rgba(255,255,255,0.6)',
  boxShadow: '0 10px 30px rgba(120,95,40,0.10)',
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
    <section className="w-full rounded-[22px] p-4.5" style={glassCardStyle}>
      <div className="grid grid-cols-3">
        <button
          type="button"
          className="min-w-0 text-center"
          onClick={() => toggleSummary('income')}
        >
          <p className="mb-1.5 text-xs font-semibold text-gray-500">수입</p>
          <strong className="block min-w-0 truncate whitespace-nowrap text-base font-bold text-(--color-income-blue)">
            {formatAmount(totalIncome)}원
          </strong>
        </button>

        <button
          type="button"
          className="min-w-0 text-center"
          onClick={() => toggleSummary('expense')}
        >
          <p className="mb-1.5 text-xs font-semibold text-gray-500">지출</p>
          <strong className="block min-w-0 truncate whitespace-nowrap text-base font-bold text-(--color-expense-red)">
            {formatAmount(totalExpense)}원
          </strong>
        </button>

        <button
          type="button"
          className="min-w-0 text-center"
          onClick={() => toggleSummary('total')}
        >
          <p className="mb-1.5 text-xs font-semibold text-gray-500">합계</p>
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
          <div className="my-4 border-t border-gray-200" />
          <div className="grid gap-3">
            {detailRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">{row.label}</span>
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
