import { ChevronRightIcon } from '@heroicons/react/24/outline'
import SatisfactionIcon from '../common/SatisfactionIcon'

type Props = {
  currentDate: Date
  satisfactionCount: number
  totalExpenseCount: number
  untaggedCount: number
}

export default function ReportProgressCard({ currentDate, satisfactionCount, totalExpenseCount, untaggedCount }: Props) {
  const month = currentDate.getMonth() + 1
  const recordingRate = totalExpenseCount > 0 ? Math.round((satisfactionCount / totalExpenseCount) * 100) : 0

  return (
    <section
      className="rounded-[22px] p-4 shadow-[0_6px_20px_rgba(0,0,0,0.06)]"
      style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.06) 100%), rgba(255,255,255,0.45)',
        backdropFilter: 'blur(20px) saturate(170%)',
        border: '1px solid rgba(139,92,246,0.2)',
      }}
    >
      <div className="flex items-center gap-3">
        <SatisfactionIcon className="shrink-0 text-gray-300" size={42} value={null} />

        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold text-black">감정을 안 남긴 내역 {untaggedCount}건</p>
          <p className="mt-0.5 text-[13px] font-medium text-gray-400">
            기록률 {recordingRate}% · 지금 남기면 {month}월 리포트에 반영돼요
          </p>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-black/8">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${recordingRate}%`, background: 'linear-gradient(90deg, #818cf8 0%, #a855f7 100%)' }}
            />
          </div>
        </div>

        <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-400" />
      </div>
    </section>
  )
}
