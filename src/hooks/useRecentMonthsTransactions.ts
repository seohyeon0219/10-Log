import { useEffect, useState } from 'react'
import { getMonthlyTransactions } from '../lib/financeApi'
import { getMonthDate } from '../utils/dateUtils'
import type { Transaction } from '../types/finance'

export function useRecentMonthsTransactions(currentDate: Date, monthCount = 6) {
  const [monthsData, setMonthsData] = useState<Transaction[][]>(
    Array.from({ length: monthCount }, () => []),
  )
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    Promise.all(
      Array.from({ length: monthCount }, (_, index) =>
        getMonthlyTransactions(getMonthDate(currentDate, index - (monthCount - 1))),
      ),
    )
      .then((data) => { if (isMounted) setMonthsData(data) })
      .finally(() => { if (isMounted) setIsLoading(false) })

    return () => { isMounted = false }
  }, [currentDate, monthCount])

  return {
    isLoading,
    monthsData,
    previousMonthData: monthsData[monthsData.length - 2] ?? [],
  }
}
