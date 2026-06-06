export const mockMonthlySummary = {
  expense: 3200,
  fixedExpense: 456,
  fixedIncome: 120000,
  income: 54124,
}

export const mockSidePanelTabs = [
  { id: 'stats', label: '통계' },
  { id: 'review', label: '회고' },
  { id: 'more', label: '더보기' },
]

export const mockSidePanelTabContentById: Record<string, string> = {
  stats: '통계 탭입니다',
  review: '회고 탭입니다',
  more: '더보기 탭입니다',
}

const getDateKey = (date: Date, day: number) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const dateOfMonth = String(day).padStart(2, '0')

  return `${year}-${month}-${dateOfMonth}`
}

export const getMockCalendarDayAmounts = (currentDate: Date) => [
  { date: getDateKey(currentDate, 3), expense: 12800 },
  { date: getDateKey(currentDate, 7), income: 54124 },
  { date: getDateKey(currentDate, 12), expense: 3200, income: 120000 },
  { date: getDateKey(currentDate, 18), expense: 456 },
  { date: getDateKey(currentDate, 25), income: 30000, expense: 6800 },
]
