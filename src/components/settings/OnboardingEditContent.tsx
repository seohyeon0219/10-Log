import { useEffect, useState } from 'react'
import { getOnboardingAnswers, saveOnboardingAnswers } from '../../lib/onboardingApi'
import Button from '../common/Button'
import StepGoal from '../onboarding/steps/StepGoal'
import StepProfile from '../onboarding/steps/StepProfile'
import StepReportContent from '../onboarding/steps/StepReportContent'
import StepReportStyle from '../onboarding/steps/StepReportStyle'
import StepSaveAreas from '../onboarding/steps/StepSaveAreas'
import StepSpendingValue from '../onboarding/steps/StepSpendingValue'
import { INITIAL_ANSWERS } from '../../types/onboarding'
import type { OnboardingAnswers } from '../../types/onboarding'

type Props = {
  onClose: () => void
}

function SectionHeader({ children }: { children: string }) {
  return (
    <div className="mt-6 mb-4 border-t border-black/6 pt-6">
      <p className="text-sm font-bold text-black">{children}</p>
    </div>
  )
}

export default function OnboardingEditContent({ onClose }: Props) {
  const [answers, setAnswers] = useState<OnboardingAnswers>(INITIAL_ANSWERS)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getOnboardingAnswers()
      .then((data) => { if (data) setAnswers(data) })
      .catch(() => setError('정보를 불러오지 못했어요.'))
      .finally(() => setIsLoading(false))
  }, [])

  const setAnswer = <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError('')
    try {
      await saveOnboardingAnswers(answers)
      onClose()
    } catch {
      setError('저장에 실패했어요. 다시 시도해주세요.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="py-10 text-center text-sm font-semibold text-gray-400">
        불러오는 중...
      </div>
    )
  }

  return (
    <>
      <StepProfile answers={answers} onChange={setAnswer} />

      <SectionHeader>소비 목표</SectionHeader>
      <StepGoal answers={answers} onChange={setAnswer} />

      <SectionHeader>절약 분야</SectionHeader>
      <StepSaveAreas answers={answers} onChange={setAnswer} />

      <SectionHeader>소비 가치</SectionHeader>
      <StepSpendingValue answers={answers} onChange={setAnswer} />

      <SectionHeader>AI 리포트 관심 항목</SectionHeader>
      <StepReportContent answers={answers} onChange={setAnswer} />

      <SectionHeader>AI 리포트 스타일</SectionHeader>
      <StepReportStyle answers={answers} onChange={setAnswer} />

      {error && (
        <p className="mt-4 text-sm font-semibold text-(--color-expense-red)">{error}</p>
      )}

      <div className="mt-8">
        <Button disabled={isSaving} onClick={() => void handleSave()}>
          {isSaving ? '저장 중...' : '저장'}
        </Button>
      </div>
    </>
  )
}
