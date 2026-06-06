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

export const mockTransactions = [
  {
    id: 'transaction-1',
    amount: 12800,
    categoryColor: '#f05650',
    categoryName: '식비',
    memo: '점심 식사',
    type: 'expense',
  },
  {
    id: 'transaction-2',
    amount: 54124,
    categoryColor: '#1863dc',
    categoryName: '급여',
    memo: '추가 정산',
    type: 'income',
  },
  {
    id: 'transaction-3',
    amount: 6800,
    categoryColor: '#ffb74d',
    categoryName: '카페',
    memo: '오후 커피',
    type: 'expense',
  },
]

export const mockIncomeCategories = [
  { id: 'salary', name: '급여', color: '#1863dc' },
  { id: 'side-job', name: '부수입', color: '#4c8df6' },
  { id: 'allowance', name: '용돈', color: '#69a7ff' },
]

export const mockExpenseCategories = [
  { id: 'food', name: '식비', color: '#f05650' },
  { id: 'coffee', name: '카페', color: '#ffb74d' },
  { id: 'transport', name: '교통', color: '#007fff' },
  { id: 'shopping', name: '쇼핑', color: '#ab47bc' },
]
