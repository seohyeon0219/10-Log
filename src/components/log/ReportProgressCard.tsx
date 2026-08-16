type Props = {
  currentDate: Date
  satisfactionCount: number
}

export default function ReportProgressCard({ currentDate, satisfactionCount }: Props) {
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
    <section className="rounded-[22px] glass-card p-5 shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-(--color-text-sand)">AI 리포트</p>
      <h3 className="mt-0.5 text-[15px] font-bold text-black">{monthLabel} 리포트 준비 중</h3>
      <p className="mt-0.5 text-[13px] font-medium text-gray-400">
        감정 기록 {satisfactionCount}건 · {arrivalLabel}
      </p>

      <div className="mt-3.5">
        <div className="h-2 w-full overflow-hidden rounded-full bg-black/8">
          <div
            className="h-full rounded-full bg-black/70 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
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
