import { useEffect, useRef, useState } from 'react'
import StatisticsCard from './StatisticsCard'
import SegmentedControl from '../common/SegmentedControl'
import { formatAmount } from '../../utils/formatters'
import type { TransactionType } from '../../types/finance'

const yearOptions = [
  { label: '올해', value: 'current' },
  { label: '작년 대비', value: 'lastYear' },
] as const

type YearMode = (typeof yearOptions)[number]['value']

type BarChartPoint = {
  amount: number
  month: string
}

type SpendingTransactionLineChartProps = {
  data: Record<TransactionType, BarChartPoint[]>
  lastYearExpense: BarChartPoint[]
}

const chartHeight = 200
const plotLeft = 52
const plotRight = 8
const plotTop = 12
const plotBottom = 28
const plotHeight = chartHeight - plotTop - plotBottom

const getRoundedMaxAmount = (amount: number) => {
  if (amount <= 0) return 1
  const unit = 10 ** Math.max(String(Math.floor(amount)).length - 2, 0)
  return Math.ceil(amount / unit) * unit
}

const getAxisLabel = (amount: number) => {
  if (amount >= 100000000) return `${Math.round(amount / 100000000)}억`
  if (amount >= 10000) return `${Math.round(amount / 10000)}만`
  return amount.toLocaleString('ko-KR')
}

export default function SpendingTransactionLineChart({ data, lastYearExpense }: SpendingTransactionLineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [chartWidth, setChartWidth] = useState(360)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [yearMode, setYearMode] = useState<YearMode>('current')
  const showLastYear = yearMode === 'lastYear'

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(([entry]) => {
      setChartWidth(Math.max(Math.round(entry.contentRect.width), 280))
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const months = data.income.map((d) => d.month)
  const N = months.length
  const maxAmount = getRoundedMaxAmount(
    Math.max(
      ...data.income.map((d) => d.amount),
      ...data.expense.map((d) => d.amount),
      ...(showLastYear ? lastYearExpense.map((d) => d.amount) : []),
      1,
    ),
  )

  const plotWidth = chartWidth - plotLeft - plotRight
  const groupWidth = plotWidth / N
  const barPad = groupWidth * 0.2
  const barWidth = groupWidth - barPad * 2

  const gridLines = [1, 0.5, 0].map((ratio) => ({
    amount: Math.round(maxAmount * ratio),
    y: plotTop + plotHeight * (1 - ratio),
  }))

  const getBarY = (amount: number) =>
    plotTop + plotHeight - (amount / maxAmount) * plotHeight

  const getBarH = (amount: number) =>
    (amount / maxAmount) * plotHeight

  const incomeLinePoints = data.income
    .map((d, i) => {
      const x = plotLeft + i * groupWidth + groupWidth / 2
      const y = getBarY(d.amount)
      return `${x},${y}`
    })
    .join(' ')

  const hasLastYearData = lastYearExpense.some((d) => d.amount > 0)

  const toggle = hasLastYearData ? (
    <SegmentedControl
      onChange={(v) => { setYearMode(v); setSelectedIndex(null) }}
      options={yearOptions}
      value={yearMode}
    />
  ) : null

  return (
    <StatisticsCard action={toggle} title="지출 흐름">
      <div className="mt-4 grid gap-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
            <span className="inline-block h-0.5 w-4 rounded-full bg-(--color-income-blue)" />
            수입
          </span>
          {selectedIndex !== null && (
            <span className="text-xs font-bold text-(--color-income-blue)">
              {formatAmount(data.income[selectedIndex]?.amount ?? 0)}원
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
            <span className="h-2.5 w-2.5 rounded-sm bg-(--color-expense-red)" />
            지출
          </span>
          {selectedIndex !== null && (
            <span className="text-xs font-bold text-(--color-expense-red)">
              {formatAmount(data.expense[selectedIndex]?.amount ?? 0)}원
            </span>
          )}
        </div>
        {showLastYear && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
            <span className="h-2.5 w-2.5 rounded-sm bg-gray-300" />
            작년 같은 달
          </div>
        )}
      </div>

      <div className="mt-4" ref={containerRef}>
        <svg
          className="w-full overflow-visible"
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          width="100%"
        >
          {/* 그리드 라인 + Y축 라벨 */}
          {gridLines.map((line) => (
            <g key={line.y}>
              <line
                stroke="#e5e7eb"
                strokeDasharray="4 4"
                strokeWidth="1"
                x1={plotLeft}
                x2={chartWidth - plotRight}
                y1={line.y}
                y2={line.y}
              />
              <text
                fill="#9ca3af"
                fontSize="10"
                fontWeight="700"
                textAnchor="end"
                x={plotLeft - 6}
                y={line.y + 4}
              >
                {getAxisLabel(line.amount)}
              </text>
            </g>
          ))}

          {/* 바 + 라벨 */}
          {months.map((month, i) => {
            const groupX = plotLeft + i * groupWidth + barPad
            const expenseAmount = data.expense[i]?.amount ?? 0
            const lastYearAmount = lastYearExpense[i]?.amount ?? 0
            const expenseH = getBarH(expenseAmount)
            const lastYearH = getBarH(lastYearAmount)
            const isSelected = selectedIndex === i
            const barOpacity = selectedIndex === null || isSelected ? 1 : 0.35

            return (
              <g key={month} onClick={() => setSelectedIndex(isSelected ? null : i)} style={{ cursor: 'pointer' }}>
                {isSelected && (
                  <rect
                    fill="rgba(0,0,0,0.05)"
                    height={plotHeight + plotTop}
                    rx="6"
                    width={groupWidth - barPad}
                    x={groupX - barPad / 2}
                    y={0}
                  />
                )}

                {/* 작년 지출 바 (회색, 뒤) */}
                {showLastYear && lastYearAmount > 0 && (
                  <rect
                    fill="#d1d5db"
                    height={lastYearH}
                    opacity={barOpacity}
                    rx="3"
                    width={barWidth}
                    x={groupX}
                    y={getBarY(lastYearAmount)}
                  />
                )}

                {/* 올해 지출 바 (빨강) */}
                {expenseAmount > 0 && (
                  <rect
                    fill="var(--color-expense-red)"
                    height={expenseH}
                    opacity={barOpacity}
                    rx="3"
                    width={barWidth}
                    x={groupX}
                    y={getBarY(expenseAmount)}
                  />
                )}

                {/* X축 월 라벨 */}
                <text
                  fill={isSelected ? '#111111' : '#9ca3af'}
                  fontSize="10"
                  fontWeight="700"
                  textAnchor="middle"
                  x={groupX + barWidth / 2}
                  y={chartHeight - 4}
                >
                  {month}
                </text>

                {/* 클릭 투명 영역 */}
                <rect
                  fill="transparent"
                  height={chartHeight}
                  width={groupWidth}
                  x={plotLeft + i * groupWidth}
                  y={0}
                />
              </g>
            )
          })}

          {/* 수입 선 */}
          <polyline
            fill="none"
            points={incomeLinePoints}
            stroke="var(--color-income-blue)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />

          {/* 수입 점 */}
          {data.income.map((d, i) => (
            <circle
              key={i}
              cx={plotLeft + i * groupWidth + groupWidth / 2}
              cy={getBarY(d.amount)}
              fill="var(--color-income-blue)"
              r={selectedIndex === i ? 4 : 3}
              stroke="white"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </div>
    </StatisticsCard>
  )
}
