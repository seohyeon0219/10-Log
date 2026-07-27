import { useEffect } from 'react'
import { getBackgroundGradient } from '../utils/budgetTheme'

export function useBudgetTheme(budget: number, spent: number) {
  useEffect(() => {
    const gradient = getBackgroundGradient(budget, spent)
    document.documentElement.style.setProperty('--gradient-page-bg', gradient)
  }, [budget, spent])
}
