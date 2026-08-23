import { ChevronRightIcon } from '@heroicons/react/24/outline'

type Props = {
  currentDate: Date
  insights?: string[]
  satisfactionCount: number
}

export default function ReportProgressCard({ currentDate, insights = [], satisfactionCount }: Props) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const today = new Date()

  const totalDays = new Date(year, month + 1, 0).getDate()
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month
  const elapsedDays = isCurrentMonth ? today.getDate() : totalDays
  const progressPercent = Math.round((elapsedDays / totalDays) * 100)

  const monthLabel = `${month + 1}월`
  const arrivalLabel = `${month + 1}월 ${totalDays}일 도착`

  return (
    <section
      className="rounded-[22px] p-5 shadow-[0_6px_20px_rgba(0,0,0,0.06)]"
      style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.06) 100%), rgba(255,255,255,0.45)',
        backdropFilter: 'blur(20px) saturate(170%)',
        border: '1px solid rgba(139,92,246,0.2)',
      }}
    >
      <div className="flex items-center justify-between">
        <span className="rounded-full px-2 py-0.5 text-xs font-bold tracking-wide" style={{ background: 'rgba(139,92,246,0.12)', color: '#7c3aed' }}>
          AI 리포트
        </span>
        <ChevronRightIcon className="h-4 w-4 text-gray-400" />
      </div>

      <h3 className="mt-2.5 text-[15px] font-bold text-black">{monthLabel} 리포트 준비 중</h3>
      {insights.length > 0 ? (
        <ul className="mt-1.5 grid gap-0.5">
          {insights.map((text) => (
            <li key={text} className="text-[13px] font-medium text-gray-500">{text}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-0.5 text-[13px] font-medium text-gray-400">
          {satisfactionCount === 0
            ? '감정을 기록할수록 리포트가 풍성해져요'
            : `감정 기록 ${satisfactionCount}건 · ${arrivalLabel}`}
        </p>
      )}

      <div className="mt-3.5">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/8">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #818cf8 0%, #a855f7 100%)' }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[11px] font-semibold text-gray-400">
          <span>1일</span>
          <span>{elapsedDays}/{totalDays}일</span>
          <span>{totalDays}일</span>
        </div>
      </div>
    </section>
  )
}
