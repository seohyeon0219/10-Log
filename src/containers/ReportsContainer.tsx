import { useNavigate } from 'react-router-dom'
import BackHeader from '../components/common/BackHeader'

const APP_START_YEAR = 2026
const APP_START_MONTH = 6

type MonthEntry = { year: number; month: number }

function generateMonths(): MonthEntry[] {
  const now = new Date()
  const endYear = now.getFullYear()
  const endMonth = now.getMonth() + 1

  const months: MonthEntry[] = []
  let year = APP_START_YEAR
  let month = APP_START_MONTH

  while (year < endYear || (year === endYear && month <= endMonth)) {
    months.push({ year, month })
    month++
    if (month > 12) {
      month = 1
      year++
    }
  }

  return months.reverse()
}

const MONTHS = generateMonths()

const byYear = MONTHS.reduce<Record<number, MonthEntry[]>>((acc, entry) => {
  ;(acc[entry.year] ??= []).push(entry)
  return acc
}, {})

const sortedYears = Object.keys(byYear)
  .map(Number)
  .sort((a, b) => b - a)

export default function ReportsContainer() {
  const navigate = useNavigate()

  return (
    <section className="w-full self-start animate-fade-up md:mt-4 md:min-h-80">
      <BackHeader to="/app/more" />

      <div className="grid gap-6">
        {sortedYears.map((year) => (
          <div key={year}>
            <p className="mb-2 text-[13px] font-bold text-gray-400">{year}</p>
            <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/55">
              {byYear[year].map((entry, i) => (
                <div key={`${entry.year}-${entry.month}`}>
                  {i > 0 && <div className="mx-5 h-px bg-gray-100" />}
                  <button
                    className="flex w-full items-center justify-between px-5 py-4 text-left transition active:bg-gray-50"
                    onClick={() => navigate(`/app/reports/${entry.year}/${entry.month}`)}
                    type="button"
                  >
                    <span className="text-[15px] font-semibold text-gray-900">
                      {entry.month}월 리포트
                    </span>
                    <svg aria-hidden="true" fill="none" height="12" viewBox="0 0 7 12" width="7">
                      <path
                        d="M1 1l5 5-5 5"
                        stroke="var(--color-gray)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
