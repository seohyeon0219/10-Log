import { useEffect, useState } from 'react'
import StatisticsCard from '../statistics/StatisticsCard'
import { getOnboardingAnswers } from '../../lib/onboardingApi'
import type { ReportContent } from '../../types/onboarding'

const CONTENT_LABELS: Record<ReportContent, string> = {
  habits: '소비 습관 분석',
  tips: '절약 팁',
  goodSpending: '잘한 소비',
  badSpending: '아쉬운 소비',
  goalRate: '목표 달성률',
  comparison: '지난달과 비교',
  top5: '소비 TOP 5',
}

const FALLBACK_ITEMS = ['이달의 소비 패턴 분석', '카테고리별 변화 요약', '다음 달을 위한 제안']

type Props = {
  monthLabel?: string
}

export default function AiMonthlyReview({ monthLabel = '이번 달' }: Props) {
  const [items, setItems] = useState<string[] | null>(null)

  useEffect(() => {
    getOnboardingAnswers()
      .then((answers) => {
        if (answers && answers.reportContents.length > 0) {
          setItems(answers.reportContents.map((c) => CONTENT_LABELS[c]))
        } else {
          setItems(FALLBACK_ITEMS)
        }
      })
      .catch(() => setItems(FALLBACK_ITEMS))
  }, [])

  return (
    <StatisticsCard eyebrow={`${monthLabel} AI 월간로그`} title="나만을 위한 월간 AI 리포트">
      <div className="mt-4 flex items-center gap-2">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black/25 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-black/40" />
        </span>
        <span className="text-[11px] font-bold uppercase tracking-widest text-(--color-text-muted)">
          준비 중
        </span>
      </div>

      <div className="mt-5 rounded-2xl border border-black/6 bg-black/3 px-4 py-4">
        <p className="text-xs font-bold uppercase tracking-widest text-(--color-text-muted)">
          포함될 내용
        </p>
        <p className="mt-1.5 text-[12px] text-(--color-text-muted) leading-relaxed">
          한 달에 한 번, 내가 작성한 소비내역을 바탕으로 맞춤 리포트를 보내드려요.
        </p>
        <ul className="mt-3 grid gap-2">
          {items?.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-[13px] font-semibold text-(--color-dark-gray)">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-black/25" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </StatisticsCard>
  )
}
