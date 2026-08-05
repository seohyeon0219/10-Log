import OnboardingCardOption from '../OnboardingCardOption'
import type { OnboardingAnswers, SaveArea } from '../../../types/onboarding'

type Props = {
  answers: OnboardingAnswers
  onChange: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void
}

const AREAS: { value: SaveArea; label: string }[] = [
  { value: 'food', label: '식비' },
  { value: 'cafe', label: '카페' },
  { value: 'shopping', label: '쇼핑' },
  { value: 'delivery', label: '배달' },
  { value: 'alcohol', label: '술/유흥' },
  { value: 'hobby', label: '취미·문화생활' },
  { value: 'transport', label: '교통' },
  { value: 'subscription', label: '구독 서비스' },
  { value: 'other', label: '기타' },
]

const MAX_SELECT = 3

export default function StepSaveAreas({ answers, onChange }: Props) {
  const toggle = (value: SaveArea) => {
    const current = answers.saveAreas
    if (current.includes(value)) {
      onChange('saveAreas', current.filter((v) => v !== value))
    } else if (current.length < MAX_SELECT) {
      onChange('saveAreas', [...current, value])
    }
  }

  return (
    <div className="flex flex-col gap-2.5">
{AREAS.map(({ value, label }) => (
        <OnboardingCardOption
          key={value}
          disabled={!answers.saveAreas.includes(value) && answers.saveAreas.length >= MAX_SELECT}
          label={label}
          onClick={() => toggle(value)}
          selected={answers.saveAreas.includes(value)}
        />
      ))}
    </div>
  )
}
