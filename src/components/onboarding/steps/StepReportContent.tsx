import OnboardingCardOption from '../OnboardingCardOption'
import type { OnboardingAnswers, ReportContent } from '../../../types/onboarding'

const MAX_SELECT = 5

type Props = {
  answers: OnboardingAnswers
  onChange: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void
}

const CONTENTS: { value: ReportContent; label: string }[] = [
  { value: 'habits', label: '소비 습관 분석' },
  { value: 'tips', label: '절약 팁' },
  { value: 'goodSpending', label: '잘한 소비' },
  { value: 'badSpending', label: '아쉬운 소비' },
  { value: 'goalRate', label: '목표 달성률' },
  { value: 'comparison', label: '지난달과 비교' },
  { value: 'top5', label: '소비 TOP 5' },
]

export default function StepReportContent({ answers, onChange }: Props) {
  const toggle = (value: ReportContent) => {
    const current = answers.reportContents
    if (current.includes(value)) {
      onChange('reportContents', current.filter((v) => v !== value))
    } else if (current.length < MAX_SELECT) {
      onChange('reportContents', [...current, value])
    }
  }

  return (
    <div className="flex flex-col gap-2.5">
      <p className="mb-1 text-xs font-semibold text-(--color-text-muted)">
        {answers.reportContents.length} / {MAX_SELECT} 선택
      </p>
      {CONTENTS.map(({ value, label }) => {
        const selected = answers.reportContents.includes(value)
        return (
          <OnboardingCardOption
            disabled={!selected && answers.reportContents.length >= MAX_SELECT}
            key={value}
            label={label}
            onClick={() => toggle(value)}
            selected={selected}
          />
        )
      })}
    </div>
  )
}
