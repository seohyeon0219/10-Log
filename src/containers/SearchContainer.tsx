import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BackHeader from '../components/common/BackHeader'
import SearchBar, { type SearchFilters } from '../components/search/SearchBar'
import { useCalendarStore } from '../stores/calendarStore'

export default function SearchContainer() {
  const expenseCategories = useCalendarStore((state) => state.expenseCategories)
  const incomeCategories = useCalendarStore((state) => state.incomeCategories)
  const loadMonth = useCalendarStore((state) => state.loadMonth)
  const navigate = useNavigate()

  useEffect(() => {
    void loadMonth()
  }, [loadMonth])

  const handleSearch = (filters: SearchFilters) => {
    const params = new URLSearchParams()
    if (filters.memo) params.set('memo', filters.memo)
    if (filters.startDate) params.set('startDate', filters.startDate)
    if (filters.endDate) params.set('endDate', filters.endDate)
    if (filters.categoryIds.length > 0) params.set('categoryIds', filters.categoryIds.join(','))
    if (filters.isFixed) params.set('isFixed', '1')
    void navigate(`/app/search/results?${params.toString()}`)
  }

  return (
    <section className="w-full self-start animate-fade-up">
      <BackHeader title="검색" />
      <SearchBar
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
        onSearch={handleSearch}
      />
    </section>
  )
}
