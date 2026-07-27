import Button from '../../common/Button'
import Input from '../../common/Input'
import type { AgeRange, Gender, OnboardingAnswers } from '../../../types/onboarding'

type Props = {
  answers: OnboardingAnswers
  onChange: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void
}

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'male', label: '남성' },
  { value: 'female', label: '여성' },
  { value: 'other', label: '기타' },
]

const AGE_RANGES: { value: AgeRange; label: string }[] = [
  { value: 'under10', label: '9세 이하' },
  { value: '10s', label: '10대' },
  { value: '20s', label: '20대' },
  { value: '30s', label: '30대' },
  { value: '40s', label: '40대' },
  { value: '50s', label: '50대' },
  { value: '60plus', label: '60세 이상' },
]

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-3 text-[12px] font-bold uppercase tracking-widest text-(--color-text-muted)">
      {children}
    </p>
  )
}

export default function StepProfile({ answers, onChange }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <SectionLabel>이름</SectionLabel>
        <Input
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="어떻게 불러드릴까요?"
          type="text"
          value={answers.name}
        />
      </div>

      <div>
        <SectionLabel>성별</SectionLabel>
        <div className="flex gap-2">
          {GENDERS.map(({ value, label }) => (
            <Button
              className="w-auto! min-h-0! px-5! py-2.5! text-sm!"
              key={value}
              onClick={() => onChange('gender', value)}
              shape="pill"
              variant={answers.gender === value ? 'primary' : 'secondary'}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>나이</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {AGE_RANGES.map(({ value, label }) => (
            <Button
              className="w-auto! min-h-0! px-5! py-2.5! text-sm!"
              key={value}
              onClick={() => onChange('ageRange', value)}
              shape="pill"
              variant={answers.ageRange === value ? 'primary' : 'secondary'}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
