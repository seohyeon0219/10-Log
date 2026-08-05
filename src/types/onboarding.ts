export type Gender = 'male' | 'female' | 'other'

export type AgeRange = 'under10' | '10s' | '20s' | '30s' | '40s' | '50s' | '60plus'

export type SpendingGoal =
  | 'saving'
  | 'travel'
  | 'independence'
  | 'purchase'
  | 'investment'
  | 'job'
  | 'habits'
  | 'custom'

export type SaveArea =
  | 'food'
  | 'cafe'
  | 'shopping'
  | 'delivery'
  | 'alcohol'
  | 'hobby'
  | 'transport'
  | 'subscription'
  | 'other'

export type SpendingValue = 'price' | 'quality' | 'experience' | 'convenience' | 'satisfaction' | 'value'

export type ReportContent =
  | 'habits'
  | 'tips'
  | 'goodSpending'
  | 'badSpending'
  | 'goalRate'
  | 'comparison'
  | 'top5'

export type ReportStyle = 'cheerful' | 'coach' | 'data'

export interface OnboardingAnswers {
  name: string
  gender: Gender | null
  ageRange: AgeRange | null
  spendingGoals: SpendingGoal[]
  customGoal: string
  saveAreas: SaveArea[]
  spendingValue: SpendingValue | null
  reportContents: ReportContent[]
  reportStyle: ReportStyle | null
}

export const INITIAL_ANSWERS: OnboardingAnswers = {
  name: '',
  gender: null,
  ageRange: null,
  spendingGoals: [],
  customGoal: '',
  saveAreas: [],
  spendingValue: null,
  reportContents: [],
  reportStyle: null,
}
