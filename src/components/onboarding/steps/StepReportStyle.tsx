import OnboardingCardOption from '../OnboardingCardOption'
import type { OnboardingAnswers, ReportStyle } from '../../../types/onboarding'

type Props = {
  answers: OnboardingAnswers
  onChange: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void
}

const STYLES: { value: ReportStyle; label: string; description: string }[] = [
  { value: 'cheerful', label: '응원형', description: '"이번 달도 정말 수고했어요!"' },
  { value: 'coach', label: '코치형', description: '"다음 달에는 이런 점을 개선해보세요."' },
  { value: 'data', label: '데이터형', description: '"수치와 통계를 중심으로 분석해드릴게요."' },
]

export default function StepReportStyle({ answers, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2.5">
      {STYLES.map(({ value, label, description }) => (
        <OnboardingCardOption
          description={description}
          key={value}
          label={label}
          onClick={() => onChange('reportStyle', value)}
          selected={answers.reportStyle === value}
        />
      ))}
    </div>
  )
}
