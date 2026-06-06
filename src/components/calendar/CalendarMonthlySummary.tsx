import { useState } from 'react'

type CalendarMonthlySummaryProps = {
  income: number
  fixedIncome: number
  expense: number
  fixedExpense: number
}

const formatAmount = (amount: number) => amount.toLocaleString('ko-KR')

export default function CalendarMonthlySummary({
  income,
  fixedIncome,
  expense,
  fixedExpense,
}: CalendarMonthlySummaryProps) {
  const [isIncomeExpanded, setIsIncomeExpanded] = useState(false)
  const [isExpenseExpanded, setIsExpenseExpanded] = useState(false)
  const totalIncome = income + fixedIncome
  const totalExpense = expense + fixedExpense
  const total = totalIncome - totalExpense

  return (
    <section className="w-full px-2 py-5">
      <div className="grid grid-cols-3 gap-6">
        <div className="relative min-w-0 pr-10">
          <p className="mb-1 text-xs text-(--color-dark-gray)">수입</p>
          <strong className="block truncate text-base font-bold text-(--color-income-blue)">
            {formatAmount(totalIncome)}
          </strong>
          <SummaryExpandButton
            ariaLabel={isIncomeExpanded ? '수입 상세 닫기' : '수입 상세 보기'}
            isExpanded={isIncomeExpanded}
            onClick={() => setIsIncomeExpanded((expanded) => !expanded)}
          />
        </div>

        <div className="relative min-w-0 pr-10">
          <p className="mb-1 text-xs text-(--color-dark-gray)">지출</p>
          <strong className="block truncate text-base font-bold text-(--color-expense-red)">
            {formatAmount(totalExpense)}
          </strong>
          <SummaryExpandButton
            ariaLabel={isExpenseExpanded ? '지출 상세 닫기' : '지출 상세 보기'}
            isExpanded={isExpenseExpanded}
            onClick={() => setIsExpenseExpanded((expanded) => !expanded)}
          />
        </div>

        <div className="min-w-0">
          <p className="mb-1 text-xs text-(--color-dark-gray)">합계</p>
          <strong
            className={[
              'block truncate text-base font-bold',
              total >= 0 ? 'text-(--color-income-blue)' : 'text-(--color-expense-red)',
            ].join(' ')}
          >
            {total >= 0 ? '+' : '-'}
            {formatAmount(Math.abs(total))}
          </strong>
        </div>
      </div>

      {isIncomeExpanded || isExpenseExpanded ? (
        <div className="mt-5 grid grid-cols-3 gap-6 border-t border-gray-100 pt-4">
          <div className="grid min-w-0 gap-2">
            {isIncomeExpanded ? (
              <>
                <SummaryDetailRow label="수입" value={income} valueClassName="text-(--color-income-blue)" />
                <SummaryDetailRow
                  label="고정수입"
                  value={fixedIncome}
                  valueClassName="text-(--color-income-blue)"
                />
                <SummaryDetailRow
                  label="합계"
                  value={totalIncome}
                  valueClassName="text-(--color-income-blue)"
                  isEmphasized
                />
              </>
            ) : null}
          </div>

          <div className="grid min-w-0 gap-2">
            {isExpenseExpanded ? (
              <>
                <SummaryDetailRow label="지출" value={expense} valueClassName="text-(--color-expense-red)" />
                <SummaryDetailRow
                  label="고정지출"
                  value={fixedExpense}
                  valueClassName="text-(--color-expense-red)"
                />
                <SummaryDetailRow
                  label="합계"
                  value={totalExpense}
                  valueClassName="text-(--color-expense-red)"
                  isEmphasized
                />
              </>
            ) : null}
          </div>

          <div />
        </div>
      ) : null}
    </section>
  )
}

type SummaryExpandButtonProps = {
  ariaLabel: string
  isExpanded: boolean
  onClick: () => void
}

function SummaryExpandButton({ ariaLabel, isExpanded, onClick }: SummaryExpandButtonProps) {
  return (
    <button
      type="button"
      className="absolute right-0 bottom-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-(--color-dark-gray)"
      onClick={onClick}
      aria-expanded={isExpanded}
      aria-label={ariaLabel}
    >
      <svg
        aria-hidden="true"
        className={isExpanded ? 'rotate-180 transition-transform' : 'transition-transform'}
        width="12"
        height="7"
        viewBox="0 0 12 7"
        fill="none"
      >
        <path
          d="M1 1L6 6L11 1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

type SummaryDetailRowProps = {
  label: string
  value: number
  valueClassName: string
  isEmphasized?: boolean
}

function SummaryDetailRow({
  label,
  value,
  valueClassName,
  isEmphasized = false,
}: SummaryDetailRowProps) {
  const weightClassName = isEmphasized ? 'font-bold' : 'font-medium'

  return (
    <div className={['flex min-w-0 items-center justify-between gap-3 text-sm', isEmphasized ? 'mt-1' : ''].join(' ').trim()}>
      <span className={['truncate text-(--color-dark-gray)', weightClassName].join(' ')}>{label}</span>
      <strong className={['truncate text-right', weightClassName, valueClassName].join(' ')}>
        {formatAmount(value)}
      </strong>
    </div>
  )
}
