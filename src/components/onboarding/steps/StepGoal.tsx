import Input from '../../common/Input'
import OnboardingCardOption from '../OnboardingCardOption'
import type { OnboardingAnswers, SpendingGoal } from '../../../types/onboarding'

type Props = {
  answers: OnboardingAnswers
  onChange: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void
}

const GOALS: { value: SpendingGoal; label: string }[] = [
  { value: 'saving', label: '돈 모으기' },
  { value: 'travel', label: '여행' },
  { value: 'independence', label: '자취/독립' },
  { value: 'purchase', label: '물품 구매' },
  { value: 'investment', label: '투자' },
  { value: 'job', label: '취업 준비' },
  { value: 'habits', label: '소비 습관 개선' },
  { value: 'custom', label: '직접 입력' },
]

const MAX_SELECT = 3

export default function StepGoal({ answers, onChange }: Props) {
  const selected = answers.spendingGoals

  const toggle = (value: SpendingGoal) => {
    if (selected.includes(value)) {
      onChange('spendingGoals', selected.filter((v) => v !== value))
    } else if (selected.length < MAX_SELECT) {
      onChange('spendingGoals', [...selected, value])
    }
  }

  return (
    <div className="flex flex-col gap-2.5">
      {GOALS.map(({ value, label }) => (
        <OnboardingCardOption
          key={value}
          disabled={!selected.includes(value) && selected.length >= MAX_SELECT}
          label={label}
          onClick={() => toggle(value)}
          selected={selected.includes(value)}
        />
      ))}

      {selected.includes('custom') && (
        <div className="mt-1">
          <Input
            autoFocus
            onChange={(e) => onChange('customGoal', e.target.value)}
            placeholder="목표를 입력해주세요"
            type="text"
            value={answers.customGoal}
          />
        </div>
      )}
    </div>
  )
}
