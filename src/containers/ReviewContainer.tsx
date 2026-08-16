import { useEffect, useState } from 'react'
import BackHeader from '../components/common/BackHeader'
import { useCalendarStore } from '../stores/calendarStore'
import { getOnboardingAnswers } from '../lib/onboardingApi'
import type { OnboardingAnswers } from '../types/onboarding'

const GOAL_LABELS: Partial<Record<string, string>> = {
  saving: '저축',
  travel: '여행',
  independence: '독립',
  purchase: '목돈 마련',
  investment: '투자',
  job: '취업',
  habits: '소비 습관 개선',
}

const SAVE_AREA_LABELS: Partial<Record<string, string>> = {
  food: '식비',
  cafe: '카페',
  shopping: '쇼핑',
  delivery: '배달',
  alcohol: '술·유흥',
  hobby: '취미',
  transport: '교통',
  subscription: '구독',
}

function buildMessage(answers: OnboardingAnswers | null): { title: string; body: string } {
  if (!answers?.name) {
    return {
      title: '아직 리포트가 준비되지 않았어요',
      body: '거래 데이터가 쌓이면 AI가 분석해드릴게요.',
    }
  }

  const { name, spendingGoals, saveAreas, reportStyle } = answers
  const goalLabel = GOAL_LABELS[spendingGoals[0] ?? '']
  const areaLabels = saveAreas.slice(0, 2).map((a) => SAVE_AREA_LABELS[a] ?? a).join('·')

  const bodyParts: string[] = []
  if (goalLabel) bodyParts.push(`${goalLabel} 목표에 맞춰`)
  if (areaLabels) bodyParts.push(`${areaLabels} 절약 패턴도 함께`)
  bodyParts.push('분석해드릴게요.')

  const body = bodyParts.join(' ')

  if (reportStyle === 'cheerful') {
    return { title: `${name}님, 리포트가 곧 도착해요!`, body }
  }
  if (reportStyle === 'coach') {
    return { title: `${name}님의 소비, 꼼꼼히 살펴보고 있어요`, body }
  }
  return { title: `${name}님의 맞춤 리포트 준비 중`, body }
}

export default function ReviewContainer() {
  const currentDate = useCalendarStore((state) => state.currentDate)
  const monthLabel = `${currentDate.getMonth() + 1}월`
  const [answers, setAnswers] = useState<OnboardingAnswers | null>(null)

  useEffect(() => {
    getOnboardingAnswers().then(setAnswers).catch(() => {})
  }, [])

  const { title, body } = buildMessage(answers)

  return (
    <section className="w-full self-start animate-fade-up md:mt-4 md:min-h-80">
      <BackHeader title={`${monthLabel} AI 리포트`} to="/app/log" />
      <div className="flex flex-col items-center py-16 text-center">
        <p className="text-sm font-bold text-black">{title}</p>
        <p className="mt-1.5 text-[13px] font-medium text-gray-400">{body}</p>
      </div>
    </section>
  )
}
