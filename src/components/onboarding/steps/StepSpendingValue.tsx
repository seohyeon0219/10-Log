import OnboardingCardOption from '../OnboardingCardOption'
import type { OnboardingAnswers, SpendingValue } from '../../../types/onboarding'

type Props = {
  answers: OnboardingAnswers
  onChange: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void
}

const VALUES: { value: SpendingValue; label: string }[] = [
  { value: 'price', label: '가격' },
  { value: 'quality', label: '품질' },
  { value: 'experience', label: '경험' },
  { value: 'convenience', label: '편리함' },
  { value: 'satisfaction', label: '만족감·행복' },
  { value: 'value', label: '가성비' },
]

export default function StepSpendingValue({ answers, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2.5">
      {VALUES.map(({ value, label }) => (
        <OnboardingCardOption
          key={value}
          label={label}
          onClick={() => onChange('spendingValue', value)}
          selected={answers.spendingValue === value}
        />
      ))}
    </div>
  )
}
