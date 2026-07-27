export const toDateKey = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const getMonthDate = (baseDate: Date, offset: number): Date =>
  new Date(baseDate.getFullYear(), baseDate.getMonth() + offset, 1)
