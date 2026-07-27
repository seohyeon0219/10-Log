import type { ReactNode } from 'react'
import OnboardingProgressBar from './OnboardingProgressBar'

type Props = {
  step: number
  totalSteps: number
  title: string
  subtitle?: string
  onNext: () => void
  onBack: () => void
  nextDisabled?: boolean
  nextLabel?: string
  children: ReactNode
}

export default function OnboardingStepLayout({
  step,
  totalSteps,
  title,
  subtitle,
  onNext,
  onBack,
  nextDisabled = false,
  nextLabel = '다음',
  children,
}: Props) {
  return (
    <div className="flex h-full w-full flex-col">
      <OnboardingProgressBar current={step} total={totalSteps} />

      <div key={step} className="flex-1 overflow-y-auto px-6 pt-8 pb-4 animate-fade-up">
        <div className="mb-8">
          <h2 className="whitespace-pre-line text-[24px] font-extrabold leading-snug text-black">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-[14px] font-medium text-(--color-text-muted)">{subtitle}</p>
          )}
        </div>
        {children}
      </div>

      <div className="flex items-center gap-3 px-6 pb-[calc(36px+env(safe-area-inset-bottom))] pt-4">
        {step > 0 && (
          <button
            className="flex h-12 shrink-0 items-center justify-center rounded-full border border-white/50 bg-white/50 px-6 text-sm font-semibold text-black backdrop-blur-md"
            onClick={onBack}
            type="button"
          >
            이전
          </button>
        )}
        <button
          className={[
            'h-12 flex-1 rounded-full text-sm font-bold transition-all duration-150',
            nextDisabled
              ? 'cursor-not-allowed bg-black/10 text-black/30'
              : 'bg-black text-white shadow-[0_4px_16px_rgba(0,0,0,0.18)]',
          ].join(' ')}
          disabled={nextDisabled}
          onClick={onNext}
          type="button"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  )
}
