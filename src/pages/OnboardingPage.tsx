import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveOnboardingAnswers } from '../lib/onboardingApi'
import OnboardingStepLayout from '../components/onboarding/OnboardingStepLayout'
import StepGoal from '../components/onboarding/steps/StepGoal'
import StepIntro from '../components/onboarding/steps/StepIntro'
import StepProfile from '../components/onboarding/steps/StepProfile'
import StepReportContent from '../components/onboarding/steps/StepReportContent'
import StepReportStyle from '../components/onboarding/steps/StepReportStyle'
import StepSaveAreas from '../components/onboarding/steps/StepSaveAreas'
import StepSpendingValue from '../components/onboarding/steps/StepSpendingValue'
import { INITIAL_ANSWERS } from '../types/onboarding'
import type { OnboardingAnswers } from '../types/onboarding'

const TOTAL_STEPS = 6

const STEP_META: { title: string; subtitle?: string }[] = [
  { title: '기본 정보를\n알려주세요' },
  { title: '가장 이루고 싶은\n소비 목표는 무엇인가요?', subtitle: '최대 3개 선택' },
  { title: '특히 절약하고 싶은\n소비 분야가 있나요?', subtitle: '최대 3개 선택' },
  { title: '소비할 때 가장\n중요하게 생각하는 건 무엇인가요?' },
  { title: 'AI 리포트에서\n가장 보고 싶은 내용을 골라주세요?', subtitle: '최대 3개 선택' },
  { title: 'AI 리포트를\n어떤 스타일로 받고 싶으세요?' },
]

function isStepValid(step: number, answers: OnboardingAnswers): boolean {
  switch (step) {
    case 0: return !!answers.name.trim() && !!answers.gender && !!answers.ageRange
    case 1: return answers.spendingGoals.length > 0 && (!answers.spendingGoals.includes('custom') || !!answers.customGoal.trim())
    case 2: return answers.saveAreas.length > 0
    case 3: return !!answers.spendingValue
    case 4: return answers.reportContents.length > 0
    case 5: return !!answers.reportStyle
    default: return true
  }
}

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(-1)
  const [answers, setAnswers] = useState<OnboardingAnswers>(INITIAL_ANSWERS)
  const [isSaving, setIsSaving] = useState(false)

  const setAnswer = <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  const goNext = async () => {
    if (step === TOTAL_STEPS - 1) {
      setIsSaving(true)
      try {
        await saveOnboardingAnswers(answers)
      } catch {
        // 저장 실패해도 진행
      } finally {
        setIsSaving(false)
      }
      void navigate('/app/home')
    } else {
      setStep((prev) => prev + 1)
    }
  }

  const goBack = () => {
    if (step > -1) setStep((prev) => prev - 1)
  }

  if (step === -1) {
    return (
      <div className="h-dvh w-full [background:linear-gradient(160deg,#faf3e2_0%,#fdf9ef_35%,#e4eeff_68%,#c8dcff_100%)]">
        <StepIntro onNext={() => void goNext()} />
      </div>
    )
  }

  const meta = STEP_META[step]

  return (
    <div className="h-dvh w-full [background:linear-gradient(160deg,#faf3e2_0%,#fdf9ef_35%,#e4eeff_68%,#c8dcff_100%)]">
      <OnboardingStepLayout
        nextDisabled={!isStepValid(step, answers) || isSaving}
        nextLabel={isSaving ? '저장 중...' : step === TOTAL_STEPS - 1 ? '완료' : '다음'}
        onBack={goBack}
        onNext={() => void goNext()}
        step={step}
        subtitle={meta.subtitle}
        title={meta.title}
        totalSteps={TOTAL_STEPS}
      >
        {step === 0 && <StepProfile answers={answers} onChange={setAnswer} />}
        {step === 1 && <StepGoal answers={answers} onChange={setAnswer} />}
        {step === 2 && <StepSaveAreas answers={answers} onChange={setAnswer} />}
        {step === 3 && <StepSpendingValue answers={answers} onChange={setAnswer} />}
        {step === 4 && <StepReportContent answers={answers} onChange={setAnswer} />}
        {step === 5 && <StepReportStyle answers={answers} onChange={setAnswer} />}
      </OnboardingStepLayout>
    </div>
  )
}
