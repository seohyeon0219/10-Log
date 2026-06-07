export const mockMonthlySummary = {
  expense: 3200,
  fixedExpense: 456,
  fixedIncome: 120000,
  income: 54124,
}

export const mockMonthlyPromise = {
  budgetAmount: 200000,
  monthLabel: '이번 달',
  promise: '예산 안에서 필요한 만큼만 쓰기',
}

export const mockMonthlyMoneySummary = {
  budgetAmount: 200000,
  remainingDays: 10,
  spentAmount: 120000,
}

export const mockPreviousMonthComparison = [
  { id: 'income', label: '수입', rate: 5 },
  { id: 'expense', label: '지출', rate: -12 },
  { id: 'balance', label: '잔액', rate: 18 },
]

export const mockCategoryChangeRanking = {
  expense: [
    { id: 'food', label: '식비', rate: -20 },
    { id: 'transport', label: '교통', rate: -15 },
    { id: 'shopping', label: '쇼핑', rate: 35 },
  ],
  income: [
    { id: 'salary', label: '급여', rate: 5 },
    { id: 'side-job', label: '부수입', rate: 28 },
    { id: 'allowance', label: '용돈', rate: -10 },
  ],
}

export const mockCategoryTransactionRatio = {
  expense: [
    {
      id: 'food',
      label: '식비',
      amount: 48000,
      color: '#f05650',
      transactions: [
        { id: 'food-1', date: '6/3', memo: '점심', amount: 12000 },
        { id: 'food-2', date: '6/5', memo: '카페', amount: 5500 },
        { id: 'food-3', date: '6/8', memo: '저녁', amount: 18000 },
      ],
    },
    {
      id: 'shopping',
      label: '쇼핑',
      amount: 30000,
      color: '#ab47bc',
      transactions: [
        { id: 'shopping-1', date: '6/7', memo: '생활용품', amount: 16000 },
        { id: 'shopping-2', date: '6/14', memo: '티셔츠', amount: 14000 },
      ],
    },
    {
      id: 'transport',
      label: '교통',
      amount: 18000,
      color: '#007fff',
      transactions: [
        { id: 'transport-1', date: '6/2', memo: '지하철', amount: 3200 },
        { id: 'transport-2', date: '6/9', memo: '택시', amount: 14800 },
      ],
    },
    {
      id: 'culture',
      label: '문화',
      amount: 12000,
      color: '#00a878',
      transactions: [{ id: 'culture-1', date: '6/11', memo: '영화', amount: 12000 }],
    },
    {
      id: 'etc',
      label: '기타',
      amount: 12000,
      color: '#898989',
      transactions: [{ id: 'etc-1', date: '6/16', memo: '소모품', amount: 12000 }],
    },
  ],
  income: [
    {
      id: 'salary',
      label: '급여',
      amount: 2400000,
      color: '#1863dc',
      transactions: [{ id: 'salary-1', date: '6/25', memo: '월급', amount: 2400000 }],
    },
    {
      id: 'side-job',
      label: '부수입',
      amount: 300000,
      color: '#4c8df6',
      transactions: [{ id: 'side-job-1', date: '6/12', memo: '외주 정산', amount: 300000 }],
    },
    {
      id: 'allowance',
      label: '용돈',
      amount: 100000,
      color: '#69a7ff',
      transactions: [{ id: 'allowance-1', date: '6/1', memo: '용돈', amount: 100000 }],
    },
  ],
}

export const mockSpendingTransactionLineChart = {
  expense: [
    { month: '1월', amount: 180000 },
    { month: '2월', amount: 210000 },
    { month: '3월', amount: 160000 },
    { month: '4월', amount: 240000 },
    { month: '5월', amount: 190000 },
    { month: '6월', amount: 120000 },
  ],
  income: [
    { month: '1월', amount: 2500000 },
    { month: '2월', amount: 2500000 },
    { month: '3월', amount: 2600000 },
    { month: '4월', amount: 2550000 },
    { month: '5월', amount: 2650000 },
    { month: '6월', amount: 2800000 },
  ],
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
