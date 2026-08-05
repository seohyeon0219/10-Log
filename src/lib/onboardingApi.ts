import { supabase } from './supabase'
import { getCurrentUserId } from './auth'
import type { OnboardingAnswers } from '../types/onboarding'

type ProfileRow = {
  age_range: string | null
  custom_goal: string | null
  gender: string | null
  name: string
  onboarding_completed: boolean
  report_contents: string[]
  report_style: string | null
  save_areas: string[]
  spending_goals: string[]
  spending_value: string | null
}

export const getOnboardingCompleted = async (): Promise<boolean> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('onboarding_completed')
    .maybeSingle()

  if (error) throw error
  return data?.onboarding_completed ?? false
}

export const saveOnboardingAnswers = async (answers: OnboardingAnswers): Promise<void> => {
  const userId = await getCurrentUserId()

  const { error } = await supabase.from('user_profiles').upsert(
    {
      age_range: answers.ageRange,
      custom_goal: answers.customGoal,
      gender: answers.gender,
      name: answers.name,
      onboarding_completed: true,
      report_contents: answers.reportContents,
      report_style: answers.reportStyle,
      save_areas: answers.saveAreas,
      spending_goals: answers.spendingGoals,
      spending_value: answers.spendingValue,
      user_id: userId,
    },
    { onConflict: 'user_id' },
  )

  if (error) throw error
}

export const getOnboardingAnswers = async (): Promise<OnboardingAnswers | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select(
      'name, gender, age_range, spending_goals, custom_goal, save_areas, spending_value, report_contents, report_style',
    )
    .maybeSingle<ProfileRow>()

  if (error) throw error
  if (!data) return null

  return {
    ageRange: (data.age_range as OnboardingAnswers['ageRange']) ?? null,
    customGoal: data.custom_goal ?? '',
    gender: (data.gender as OnboardingAnswers['gender']) ?? null,
    name: data.name,
    reportContents: (data.report_contents as OnboardingAnswers['reportContents']) ?? [],
    reportStyle: (data.report_style as OnboardingAnswers['reportStyle']) ?? null,
    saveAreas: (data.save_areas as OnboardingAnswers['saveAreas']) ?? [],
    spendingGoals: (data.spending_goals as OnboardingAnswers['spendingGoals']) ?? [],
    spendingValue: (data.spending_value as OnboardingAnswers['spendingValue']) ?? null,
  }
}
