export const mockMonthlySummary = {
  expense: 3200,
  fixedExpense: 456,
  fixedIncome: 120000,
  income: 54124,
}

export const mockNavTabs = [
  { id: 'calendar', label: '캘린더' },
  { id: 'stats', label: '통계' },
  { id: 'review', label: '회고' },
  { id: 'more', label: '더보기' },
]

const getDateKey = (date: Date, day: number) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const dateOfMonth = String(day).padStart(2, '0')

  return `${year}-${month}-${dateOfMonth}`
}

export const mockTransactions = [
  {
    id: 'transaction-1',
    amount: 12800,
    categoryColor: '#f05650',
    categoryName: '식비',
    day: 3,
    memo: '점심 식사',
    type: 'expense',
  },
  {
    id: 'transaction-2',
    amount: 54124,
    categoryColor: '#1863dc',
    categoryName: '급여',
    day: 12,
    memo: '추가 정산',
    type: 'income',
  },
  {
    id: 'transaction-3',
    amount: 3200,
    categoryColor: '#007fff',
    categoryName: '교통',
    day: 12,
    memo: '지하철',
    type: 'expense',
  },
  {
    id: 'transaction-4',
    amount: 6800,
    categoryColor: '#ffb74d',
    categoryName: '카페',
    day: 25,
    memo: '오후 커피',
    type: 'expense',
  },
]

export const getMockTransactions = (currentDate: Date) =>
  mockTransactions.map((transaction) => ({
    ...transaction,
    date: getDateKey(currentDate, transaction.day),
  }))

export const getMockCalendarDayAmounts = (currentDate: Date) =>
  getMockTransactions(currentDate).reduce<
    Array<{ date: string; expense?: number; income?: number }>
  >((dayAmounts, transaction) => {
    const dayAmount = dayAmounts.find((amount) => amount.date === transaction.date)

    if (!dayAmount) {
      dayAmounts.push({
        date: transaction.date,
        [transaction.type]: transaction.amount,
      })

      return dayAmounts
    }

    if (transaction.type === 'income') {
      dayAmount.income = (dayAmount.income ?? 0) + transaction.amount
    }

    if (transaction.type === 'expense') {
      dayAmount.expense = (dayAmount.expense ?? 0) + transaction.amount
    }

    return dayAmounts
  }, [])

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
