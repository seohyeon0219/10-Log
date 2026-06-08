import { type RefObject, useLayoutEffect, useRef, useState } from 'react'
import ExpandButton from '../common/ExpandButton'

type SummaryType = 'income' | 'expense'

type CalendarMonthlySummaryProps = {
  income: number
  fixedIncome: number
  expense: number
  fixedExpense: number
}

const formatAmount = (amount: number) => amount.toLocaleString('ko-KR')
const cn = (...classNames: string[]) => classNames.filter(Boolean).join(' ')
const amountTextClassName = 'block min-w-0 truncate whitespace-nowrap text-sm leading-5 font-bold md:text-base'

export default function CalendarMonthlySummary({
  income,
  fixedIncome,
  expense,
  fixedExpense,
}: CalendarMonthlySummaryProps) {
  const [expandedType, setExpandedType] = useState<SummaryType | ''>('')
  const [shouldStackTotal, setShouldStackTotal] = useState(false)
  const measureGridRef = useRef<HTMLDivElement | null>(null)
  const measureAmountRefs = useRef<Array<HTMLElement | null>>([])
  const totalIncome = income + fixedIncome
  const totalExpense = expense + fixedExpense
  const total = totalIncome - totalExpense
  const expandedSummary = expandedType
    ? {
        details:
          expandedType === 'income'
            ? [
                { label: '수입', value: income, valueClassName: 'text-(--color-income-blue)' },
                { label: '고정수입', value: fixedIncome, valueClassName: 'text-(--color-income-blue)' },
                {
                  isEmphasized: true,
                  label: '합계',
                  value: totalIncome,
                  valueClassName: 'text-(--color-income-blue)',
                },
              ]
            : [
                { label: '지출', value: expense, valueClassName: 'text-(--color-expense-red)' },
                {
                  label: '고정지출',
                  value: fixedExpense,
                  valueClassName: 'text-(--color-expense-red)',
                },
                {
                  isEmphasized: true,
                  label: '합계',
                  value: totalExpense,
                  valueClassName: 'text-(--color-expense-red)',
                },
              ],
        label: expandedType === 'income' ? '수입 상세' : '지출 상세',
      }
    : null

  const toggleSummary = (type: SummaryType) => {
    setExpandedType((currentType) => (currentType === type ? '' : type))
  }

  useLayoutEffect(() => {
    const measureGrid = measureGridRef.current

    if (!measureGrid) {
      return
    }

    let animationFrameId = 0

    const updateStackState = () => {
      window.cancelAnimationFrame(animationFrameId)
      animationFrameId = window.requestAnimationFrame(() => {
        const hasOverflow = measureAmountRefs.current.some((element) => {
          if (!element) {
            return false
          }

          return element.scrollWidth > element.clientWidth + 1
        })

        setShouldStackTotal(hasOverflow)
      })
    }

    updateStackState()

    const resizeObserver = new ResizeObserver(updateStackState)
    resizeObserver.observe(measureGrid)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
    }
  }, [totalExpense, totalIncome, total])

  return (
    <section className="relative w-full border-b border-gray-100 px-2 py-4">
      <MeasurementGrid
        refCallback={(element, index) => {
          measureAmountRefs.current[index] = element
        }}
        rootRef={measureGridRef}
        total={total}
        totalExpense={totalExpense}
        totalIncome={totalIncome}
      />

      <div
        className={[
          'grid gap-2 md:grid-cols-3 md:gap-6',
          shouldStackTotal ? 'grid-cols-2 gap-y-4' : 'grid-cols-3',
        ].join(' ')}
      >
        <div className="relative min-w-0 pr-8 md:pr-10">
          <p className="mb-1 text-xs font-semibold text-gray-400">수입</p>
          <strong className={cn(amountTextClassName, 'text-(--color-income-blue)')}>
            {formatAmount(totalIncome)}
          </strong>
          <ExpandButton
            ariaLabel={expandedType === 'income' ? '수입 상세 닫기' : '수입 상세 보기'}
            className="absolute right-0 bottom-0"
            isExpanded={expandedType === 'income'}
            onClick={() => toggleSummary('income')}
          />
        </div>

        <div className="relative min-w-0 pr-8 md:pr-10">
          <p className="mb-1 text-xs font-semibold text-gray-400">지출</p>
          <strong className={cn(amountTextClassName, 'text-(--color-expense-red)')}>
            {formatAmount(totalExpense)}
          </strong>
          <ExpandButton
            ariaLabel={expandedType === 'expense' ? '지출 상세 닫기' : '지출 상세 보기'}
            className="absolute right-0 bottom-0"
            isExpanded={expandedType === 'expense'}
            onClick={() => toggleSummary('expense')}
          />
        </div>

        <div className={shouldStackTotal ? 'col-span-2 min-w-0 md:col-span-1' : 'min-w-0'}>
          <p className="mb-1 text-xs font-semibold text-gray-400">합계</p>
          <strong
            className={[
              amountTextClassName,
              total >= 0 ? 'text-(--color-income-blue)' : 'text-(--color-expense-red)',
            ].join(' ')}
          >
            {total >= 0 ? '+' : '-'}
            {formatAmount(Math.abs(total))}
          </strong>
        </div>
      </div>

      {expandedSummary ? (
        <div className="mt-4 rounded-xl p-4 max-[380px]:p-3">
          <p className="text-sm font-extrabold text-black">{expandedSummary.label}</p>
          <div className="mt-3 grid gap-2">
            {expandedSummary.details.map((detail) => (
              <SummaryDetailRow
                isEmphasized={detail.isEmphasized}
                key={detail.label}
                label={detail.label}
                value={detail.value}
                valueClassName={detail.valueClassName}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

type MeasurementGridProps = {
  refCallback: (element: HTMLElement | null, index: number) => void
  rootRef: RefObject<HTMLDivElement | null>
  total: number
  totalExpense: number
  totalIncome: number
}

function MeasurementGrid({
  refCallback,
  rootRef,
  total,
  totalExpense,
  totalIncome,
}: MeasurementGridProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-2 top-4 -z-10 grid grid-cols-3 gap-2 opacity-0 md:gap-6"
      ref={rootRef}
    >
      <div className="min-w-0 pr-8 md:pr-10">
        <p className="mb-1 text-xs font-semibold">수입</p>
        <strong
          className={amountTextClassName}
          ref={(element) => refCallback(element, 0)}
        >
          {formatAmount(totalIncome)}
        </strong>
      </div>
      <div className="min-w-0 pr-8 md:pr-10">
        <p className="mb-1 text-xs font-semibold">지출</p>
        <strong
          className={amountTextClassName}
          ref={(element) => refCallback(element, 1)}
        >
          {formatAmount(totalExpense)}
        </strong>
      </div>
      <div className="min-w-0">
        <p className="mb-1 text-xs font-semibold">합계</p>
        <strong
          className={amountTextClassName}
          ref={(element) => refCallback(element, 2)}
        >
          {total >= 0 ? '+' : '-'}
          {formatAmount(Math.abs(total))}
        </strong>
      </div>
    </div>
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
    <div className={cn('flex min-w-0 items-center justify-between gap-2 text-sm md:gap-3', isEmphasized ? 'mt-1' : '')}>
      <span className={cn('truncate text-gray-400', weightClassName)}>{label}</span>
      <strong className={cn('whitespace-nowrap text-right', weightClassName, valueClassName)}>
        {formatAmount(value)}
      </strong>
    </div>
  )
}
