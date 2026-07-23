import { useEffect, useRef, useState } from 'react'
import IncomeExpenseToggle from '../common/IncomeExpenseToggle'
import StatisticsCard from './StatisticsCard'

type TransactionType = 'income' | 'expense'

type LineChartPoint = {
  amount: number
  month: string
}

type SpendngTransactionLineChartProps = {
  data: Record<TransactionType, LineChartPoint[]>
  lineChartType: TransactionType
  onLineChartTypeChange: (type: TransactionType) => void
}

const chartHeight = 220
const plotLeft = 62
const plotRight = 24
const plotTop = 20
const plotBottom = 44
const plotHeight = chartHeight - plotTop - plotBottom

const formatWon = (amount: number) => `${amount.toLocaleString('ko-KR')}원`

const getRoundedMaxAmount = (amount: number) => {
  if (amount <= 0) {
    return 1
  }

  const unit = 10 ** Math.max(String(Math.floor(amount)).length - 2, 0)

  return Math.ceil(amount / unit) * unit
}

const getChartPoints = (points: LineChartPoint[], maxAmount: number, chartWidth: number) => {
  const plotWidth = chartWidth - plotLeft - plotRight
  const stepX = points.length > 1 ? plotWidth / (points.length - 1) : plotWidth

  return points.map((point, index) => {
    const x = plotLeft + index * stepX
    const y = plotTop + plotHeight - (point.amount / maxAmount) * plotHeight

    return { ...point, x, y }
  })
}

const getAxisLabel = (amount: number) => {
  if (amount >= 10000) {
    return `${Math.round(amount / 10000).toLocaleString('ko-KR')}만`
  }

  return amount.toLocaleString('ko-KR')
}

const getGridLines = (maxAmount: number) =>
  [1, 0.5, 0].map((ratio) => {
    const amount = Math.round(maxAmount * ratio)
    const y = plotTop + plotHeight - ratio * plotHeight

    return { amount, y }
  })

const lineColorByType: Record<TransactionType, string> = {
  expense: 'var(--color-expense-red)',
  income: 'var(--color-income-blue)',
}

export default function SpendngTransactionLineChart({
  data,
  lineChartType,
  onLineChartTypeChange,
}: SpendngTransactionLineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [chartWidth, setChartWidth] = useState(420)
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null)
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null)

  const handleTypeChange = (type: TransactionType) => {
    setSelectedPointIndex(null)
    onLineChartTypeChange(type)
  }

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const observer = new ResizeObserver(([entry]) => {
      setChartWidth(Math.max(Math.round(entry.contentRect.width), 320))
    })

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [])

  const activePoints = data[lineChartType]
  const lineColor = lineColorByType[lineChartType]
  const latestPoint = activePoints[activePoints.length - 1]
  const maxAmount = getRoundedMaxAmount(Math.max(...activePoints.map((point) => point.amount), 1))
  const chartPoints = getChartPoints(activePoints, maxAmount, chartWidth)
  const polylinePoints = chartPoints.map((point) => `${point.x},${point.y}`).join(' ')
  const gridLines = getGridLines(maxAmount)
  const activePointIndex = hoveredPointIndex ?? selectedPointIndex
  const activePoint = activePointIndex !== null ? chartPoints[activePointIndex] : null
  const tooltipWidth = 108
  const tooltipHeight = 36
  const tooltipX = activePoint ? Math.min(Math.max(activePoint.x, plotLeft + tooltipWidth / 2), chartWidth - plotRight - tooltipWidth / 2) : 0
  const shouldPlaceTooltipBelow = activePoint ? activePoint.y < plotTop + tooltipHeight + 8 : false
  const tooltipY = activePoint
    ? Math.min(
      Math.max(shouldPlaceTooltipBelow ? activePoint.y + 14 : activePoint.y - tooltipHeight - 10, 8),
      chartHeight - plotBottom - tooltipHeight,
    )
    : 0

  return (
    <StatisticsCard
      action={<IncomeExpenseToggle onChange={handleTypeChange} value={lineChartType} />}
      eyebrow="최근 6개월 거래 추이"
      title={`${lineChartType === 'expense' ? '지출' : '수입'} 흐름을 한눈에 봐요`}
    >
      <div className="mt-5 rounded-xl bg-gray-50 p-4 max-[380px]:p-3">
        <div className="flex items-end justify-between gap-3 max-[380px]:items-start">
          <div>
            <p className="text-sm font-bold text-(--color-dark-gray)">이번 달</p>
            <p className="mt-1 text-base font-extrabold text-black">{lineChartType === 'expense' ? '전체 지출' : '전체 수입'}</p>
          </div>
          <p className="text-xl font-extrabold max-[380px]:text-lg" style={{ color: lineColor }}>
            {formatWon(latestPoint.amount)}
          </p>
        </div>

        <div className="mt-4 overflow-x-auto pb-1" ref={containerRef}>
          <svg className="h-55 w-full min-w-80" viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%">
            {gridLines.map((line) => (
              <g key={line.y}>
                <line stroke="#e5e7eb" strokeDasharray="4 5" strokeWidth="1" x1={plotLeft} x2={chartWidth - plotRight} y1={line.y} y2={line.y} />
                <text fill="#9ca3af" fontSize="11" fontWeight="700" textAnchor="end" x={plotLeft - 10} y={line.y + 4}>
                  {getAxisLabel(line.amount)}
                </text>
              </g>
            ))}
            <polyline fill="none" points={polylinePoints} stroke={lineColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
            {activePoint ? (
              <g>
                <line stroke={lineColor} strokeDasharray="3 4" strokeWidth="1.5" x1={activePoint.x} x2={activePoint.x} y1={plotTop} y2={plotTop + plotHeight} />
                <rect fill="white" height={tooltipHeight} rx="9" stroke="#e5e7eb" width={tooltipWidth} x={tooltipX - tooltipWidth / 2} y={tooltipY} />
                <text fill="#111111" fontSize="11" fontWeight="800" textAnchor="middle" x={tooltipX} y={tooltipY + 15}>
                  {activePoint.month}
                </text>
                <text fill={lineColor} fontSize="11" fontWeight="800" textAnchor="middle" x={tooltipX} y={tooltipY + 29}>
                  {formatWon(activePoint.amount)}
                </text>
              </g>
            ) : null}
            {chartPoints.map((point, index) => (
              <circle
                cx={point.x}
                cy={point.y}
                fill="white"
                key={point.month}
                onClick={() => setSelectedPointIndex(selectedPointIndex === index ? null : index)}
                onMouseEnter={() => setHoveredPointIndex(index)}
                onMouseLeave={() => setHoveredPointIndex(null)}
                r={activePointIndex === index ? '7' : '5'}
                stroke={lineColor}
                strokeWidth="3"
                style={{ cursor: 'pointer' }}
              />
            ))}
            {chartPoints.map((point) => (
              <text fill="#9ca3af" fontSize="11" fontWeight="700" key={point.month} textAnchor="middle" x={point.x} y={chartHeight - 12}>
                {point.month}
              </text>
            ))}
          </svg>
        </div>
      </div>
    </StatisticsCard>
  )
}
