import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Calendar from '../components/Calendar'
import BottomSheet from '../components/BottomSheet'
import DatePanel from '../components/DatePanel'
import BottomTab from '../components/BottomTab'
import Sidebar from '../components/Sidebar'
import TransactionForm from '../components/TransactionForm'
import CategoryManager from '../components/CategoryManager'
import { useTransactions } from '../hooks/useTransactions'
import { useJournals } from '../hooks/useJournals'
import { useCategories } from '../hooks/useCategories'
import { signOut, supabase } from '../lib/supabase'
import { formatAmount } from '../utils/format'
import type { TransactionType } from '../types'

type MobileTab = 'home' | 'stats' | 'journal' | 'more'
type SidebarTab = 'stats' | 'journal' | 'more'
type PeriodType = 'monthly' | 'weekly'

function getWeeksOfMonth(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1).getDay()
  const lastDay = new Date(year, month, 0).getDate()
  const weeks: { label: string; start: string; end: string }[] = []
  let day = 1
  let index = 1

  while (day <= lastDay) {
    const startDay = day
    const remainingDaysInRow = 6 - ((firstDay + day - 1) % 7)
    const endDay = Math.min(day + remainingDaysInRow, lastDay)
    weeks.push({
      label: `${index}주차`,
      start: `${year}-${String(month).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`,
      end: `${year}-${String(month).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`,
    })
    day = endDay + 1
    index += 1
  }

  return weeks
}

function getWeekIndexForDate(date: string | null, weeks: { start: string; end: string }[]) {
  if (!date) return 0
  const index = weeks.findIndex(week => date >= week.start && date <= week.end)
  return index >= 0 ? index : 0
}

function DonutChart({ segments, onSelect }: { segments: { id: string; color: string; pct: number }[]; onSelect: (id: string) => void }) {
  const r = 35
  const cx = 50
  const cy = 50
  const circ = 2 * Math.PI * r

  let offset = 0
  const paths = segments.map(segment => {
    const dash = (segment.pct / 100) * circ
    const el = (
      <circle
        key={segment.id}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={segment.color}
        strokeWidth="18"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={-offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        onClick={() => onSelect(segment.id)}
        className="cursor-pointer"
      />
    )
    offset += dash
    return el
  })

  return (
    <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth="18" />
      {paths}
      <circle cx={cx} cy={cy} r="24" fill="white" />
    </svg>
  )
}

export default function HomePage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const prevStatsMonth = month === 1 ? 12 : month - 1
  const prevStatsYear = month === 1 ? year - 1 : year
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [mobileTab, setMobileTab] = useState<MobileTab>('home')
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('stats')
  const [showForm, setShowForm] = useState<'income' | 'expense' | null>(null)
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [categoryManagerType, setCategoryManagerType] = useState<TransactionType>('expense')
  const [mobileJournalText, setMobileJournalText] = useState('')
  const [mobileJournalMenuOpen, setMobileJournalMenuOpen] = useState(false)
  const [selectedMobileCategoryId, setSelectedMobileCategoryId] = useState<string | null>(null)
  const [mobileJournalDate, setMobileJournalDate] = useState('')
  const [mobilePeriod, setMobilePeriod] = useState<PeriodType>('monthly')
  const [mobileTxType, setMobileTxType] = useState<TransactionType>('expense')
  const [mobileWeekIndex, setMobileWeekIndex] = useState(0)
  const [profile, setProfile] = useState({ name: '사용자', email: '' })

  const { transactions, addTransaction, deleteTransaction } = useTransactions(year, month)
  const { transactions: previousTransactions } = useTransactions(prevStatsYear, prevStatsMonth)
  const { journals, saveJournal, deleteJournal } = useJournals(year, month)
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '사용자'
      setProfile({ name, email: user.email ?? '' })
    })
  }, [])

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
    setSelectedDate(null)
  }

  function nextMonth() {
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
    setSelectedDate(null)
  }

  function handleSelectDate(date: string) {
    setSelectedDate(prev => prev === date ? null : date)
    setMobileTab('home')
  }

  const selectedTx = selectedDate
    ? transactions.filter(t => t.date === selectedDate)
    : []

  const formDate = selectedDate ?? `${year}-${String(month).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const monthStart = `${year}-${String(month).padStart(2, '0')}-01`
  const monthEnd = `${year}-${String(month).padStart(2, '0')}-${String(new Date(year, month, 0).getDate()).padStart(2, '0')}`
  const selectedMobileJournalDate = mobileJournalDate || todayStr
  const selectedMobileJournal = journals.find(j => j.date === selectedMobileJournalDate)
  const selectedMobileJournalTransactions = transactions.filter(tx => tx.date === selectedMobileJournalDate)
  const todayQuestion = '오늘의 소비 중 가장 가치 있었던 소비는 무엇이었나요?\n반대로 후회되는 소비가 있다면 적어주세요.'
  const weeks = getWeeksOfMonth(year, month)
  const selectedDesktopWeekIndex = getWeekIndexForDate(selectedDate, weeks)
  const selectedMobileWeek = weeks[mobileWeekIndex] ?? weeks[0]
  const mobileStatsTransactions = transactions.filter(tx => {
    if (tx.type !== mobileTxType) return false
    if (mobilePeriod === 'monthly') return true
    if (!selectedMobileWeek) return true
    return tx.date >= selectedMobileWeek.start && tx.date <= selectedMobileWeek.end
  })
  const mobileStatsTotal = mobileStatsTransactions.reduce((sum, tx) => sum + tx.amount, 0)
  const mobileCategoryList = Object.values(mobileStatsTransactions.reduce<Record<string, { id: string; name: string; color: string; total: number }>>((acc, tx) => {
    const key = tx.category_id
    if (!acc[key]) acc[key] = { id: key, name: tx.category?.name ?? '미분류', color: tx.category?.color ?? '#999', total: 0 }
    acc[key].total += tx.amount
    return acc
  }, {})).sort((a, b) => b.total - a.total)
  const mobileDonutSegments = mobileCategoryList.map(category => ({
    id: category.id,
    color: category.color,
    pct: mobileStatsTotal > 0 ? Math.round((category.total / mobileStatsTotal) * 100) : 0,
  }))
  const selectedMobileCategory = mobileCategoryList.find(category => category.id === selectedMobileCategoryId) ?? null
  const selectedMobileTransactions = selectedMobileCategory
    ? mobileStatsTransactions.filter(tx => tx.category_id === selectedMobileCategory.id)
    : []
  const mobileTrendData = weeks.map(week => {
    const total = transactions
      .filter(tx => tx.type === mobileTxType && tx.date >= week.start && tx.date <= week.end)
      .reduce((sum, tx) => sum + tx.amount, 0)
    return { ...week, total }
  })
  const mobileTrendMax = Math.max(...mobileTrendData.map(item => item.total), 1)
  const currentExpenseTotal = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0)
  const previousExpenseTotal = previousTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0)
  const currentIncomeTotal = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0)
  const previousIncomeTotal = previousTransactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0)
  const monthlyBudget = 1200000
  const budgetLeft = monthlyBudget - currentExpenseTotal
  const budgetUsedPct = Math.min(100, Math.round((currentExpenseTotal / monthlyBudget) * 100))
  const previousExpenseByCategory = previousTransactions
    .filter(tx => tx.type === 'expense')
    .reduce<Record<string, number>>((acc, tx) => {
      acc[tx.category_id] = (acc[tx.category_id] ?? 0) + tx.amount
      return acc
    }, {})
  const categoryCompareList = Object.values(transactions.filter(tx => tx.type === 'expense').reduce<Record<string, { id: string; name: string; color: string; total: number }>>((acc, tx) => {
    const key = tx.category_id
    if (!acc[key]) acc[key] = { id: key, name: tx.category?.name ?? '미분류', color: tx.category?.color ?? '#999', total: 0 }
    acc[key].total += tx.amount
    return acc
  }, {}))
    .map(category => ({
      ...category,
      diff: category.total - (previousExpenseByCategory[category.id] ?? 0),
    }))
    .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
    .slice(0, 2)

  function openCategoryManager(type: TransactionType) {
    setCategoryManagerType(type)
    setShowCategoryManager(true)
  }

  function saveMobileJournal() {
    if (!mobileJournalText.trim()) return
    saveJournal(selectedMobileJournalDate, mobileJournalText)
    setMobileJournalText('')
  }

  function editMobileJournal() {
    if (!selectedMobileJournal) return
    setMobileJournalText(selectedMobileJournal.content)
    setMobileJournalMenuOpen(false)
  }

  function deleteMobileJournal() {
    if (!selectedMobileJournal) return
    deleteJournal(selectedMobileJournal.id)
    setMobileJournalText('')
    setMobileJournalMenuOpen(false)
  }

  function changeMobileJournalDate(date: string) {
    setMobileJournalDate(date)
    setMobileJournalText('')
    setMobileJournalMenuOpen(false)
  }

  return (
    <div className="flex flex-col h-dvh bg-white overflow-hidden">
      <div className={`${mobileTab === 'home' ? 'block' : 'hidden'} md:block`}>
        <Header
          year={year}
          month={month}
          transactions={transactions}
          showMobileSummary={mobileTab === 'home'}
          onPrev={prevMonth}
          onNext={nextMonth}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Calendar + date panel */}
        <div className="flex-1 flex flex-col overflow-y-auto pb-14 md:pb-0">
          {/* Mobile: show home tab content */}
          <div className={`flex-1 flex flex-col md:flex ${mobileTab === 'home' ? 'flex' : 'hidden md:flex'}`}>
            <Calendar
              year={year}
              month={month}
              transactions={transactions}
              journals={journals}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
            />

            {/* Desktop: date panel below calendar */}
            {selectedDate && (
              <div className="hidden md:block">
                <DatePanel
                  date={selectedDate}
                  transactions={selectedTx}
                  onAddIncome={() => setShowForm('income')}
                  onAddExpense={() => setShowForm('expense')}
                  onDelete={deleteTransaction}
                />
              </div>
            )}
          </div>

          {/* Mobile only: stats/journal/more views */}
          {mobileTab === 'stats' && (
            <div className="relative flex-1 p-4 md:hidden space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">통계</h2>
                <div className="flex items-center gap-3 text-gray-500">
                  <button onClick={prevMonth} className="p-1 text-gray-400 hover:text-black">
                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                      <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <span className="text-base font-bold">{month}월</span>
                  <button onClick={nextMonth} className="p-1 text-gray-400 hover:text-black">
                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                      <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex justify-center gap-5">
                {(['weekly', 'monthly'] as PeriodType[]).map(period => (
                  <button
                    key={period}
                    onClick={() => {
                      setMobilePeriod(period)
                      setSelectedMobileCategoryId(null)
                    }}
                    className={`w-14 h-10 rounded-xl border text-sm font-bold transition-all ${
                      mobilePeriod === period
                        ? 'bg-red-700 border-red-700 text-white'
                        : 'bg-white border-gray-300 text-gray-500'
                    }`}
                  >
                    {period === 'monthly' ? '월' : '주'}
                  </button>
                ))}
                <button
                  type="button"
                  disabled
                  className="w-14 h-10 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-300"
                >
                  연
                </button>
              </div>

              {mobilePeriod === 'weekly' && (
                <select
                  value={mobileWeekIndex}
                  onChange={e => {
                    setMobileWeekIndex(Number(e.target.value))
                    setSelectedMobileCategoryId(null)
                  }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                >
                  {weeks.map((week, index) => (
                    <option key={week.start} value={index}>
                      {week.label} ({Number(week.start.slice(-2))}일-{Number(week.end.slice(-2))}일)
                    </option>
                  ))}
                </select>
              )}

              <div className="flex bg-gray-100 rounded-lg p-0.5">
                {(['expense', 'income'] as TransactionType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setMobileTxType(type)
                      setSelectedMobileCategoryId(null)
                    }}
                    className={`flex-1 py-1.5 text-xs rounded-md font-medium transition-all ${
                      mobileTxType === type
                        ? type === 'expense' ? 'bg-red-500 text-white shadow-sm' : 'bg-blue-500 text-white shadow-sm'
                        : 'text-gray-500'
                    }`}
                  >
                    {type === 'expense' ? '지출' : '수입'}
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border-2 border-gray-200 px-5 py-5">
                <div className="text-center">
                  <p className="text-xs tracking-[0.24em] text-gray-400">
                    총 {mobileTxType === 'expense' ? '지출' : '수입'}
                  </p>
                  <p className={`mt-2 text-2xl font-black ${mobileTxType === 'expense' ? 'text-red-600' : 'text-blue-600'}`}>
                    ₩ {formatAmount(mobileStatsTotal)}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-[140px_1fr] items-center gap-4">
                  {mobileCategoryList.length > 0 ? (
                    <DonutChart
                      segments={mobileDonutSegments}
                      onSelect={id => setSelectedMobileCategoryId(prev => prev === id ? null : id)}
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-100" />
                  )}

                  <div className="space-y-3">
                    {mobileCategoryList.slice(0, 4).map(category => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedMobileCategoryId(prev => prev === category.id ? null : category.id)}
                        className="w-full flex items-center gap-2 text-left"
                      >
                        <span className="w-3 h-3 rounded" style={{ backgroundColor: category.color }} />
                        <span className="min-w-0 flex-1 truncate text-sm text-gray-600">{category.name}</span>
                        <span className="text-sm text-gray-500">{formatAmount(category.total)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-gray-200 px-5 py-5">
                <h3 className="text-base font-bold text-gray-600 mb-4">카테고리 순위</h3>
                <div className="space-y-5">
                  {mobileCategoryList.map((category, index) => {
                    const pct = mobileStatsTotal > 0 ? Math.round((category.total / mobileStatsTotal) * 100) : 0
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedMobileCategoryId(prev => prev === category.id ? null : category.id)}
                        className="w-full text-left"
                      >
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="flex items-center gap-2 text-gray-700">
                            <span className="text-xs text-gray-400">{index + 1}</span>
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: category.color }} />
                            <span className="font-medium">{category.name}</span>
                          </span>
                          <span className={`font-bold ${mobileTxType === 'expense' ? 'text-red-600' : 'text-blue-600'}`}>
                            {formatAmount(category.total)}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: category.color }} />
                        </div>
                      </button>
                    )
                  })}
                  {mobileCategoryList.length === 0 && (
                    <p className="text-sm text-gray-300 py-4">내역이 없어요</p>
                  )}
                </div>
              </div>

              {selectedMobileCategory && (
                <div className="rounded-2xl border-2 border-gray-200 px-5 py-5">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">{selectedMobileCategory.name} 내역</h3>
                  <ul className="divide-y divide-gray-50">
                    {selectedMobileTransactions.map(tx => (
                      <li key={tx.id} className="flex items-center justify-between py-2.5">
                        <div>
                          <div className="text-sm font-medium text-gray-800">{tx.memo || selectedMobileCategory.name}</div>
                          <div className="text-xs text-gray-400">{tx.date}</div>
                        </div>
                        <span className={`text-sm font-bold ${tx.type === 'income' ? 'text-blue-600' : 'text-red-600'}`}>
                          {tx.type === 'income' ? '+' : '-'}{formatAmount(tx.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-2xl border-2 border-gray-200 px-5 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-600">주차별 추이</h3>
                  <span className="text-xs text-gray-400">{weeks.length}주</span>
                </div>
                <div className="flex items-end gap-3 h-24">
                  {mobileTrendData.map(item => (
                    <div key={item.start} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-lg bg-gray-200"
                        style={{ height: `${Math.max(12, (item.total / mobileTrendMax) * 84)}px` }}
                      />
                      <span className="text-[10px] text-gray-400">{item.label.replace('주차', '주')}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
          {mobileTab === 'journal' && (
            <div className="flex-1 p-4 md:hidden space-y-4">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-gray-900">소비 회고</h2>
              </div>

              <div className="rounded-2xl border-2 border-gray-200 px-5 py-5">
                <p className="text-xs text-gray-400 mb-3">이번 달 한 줄 평</p>
                <p className="text-xl font-bold text-gray-900">
                  {budgetLeft >= 0 ? '예산 안에서 잘 지켰어요 👍' : '예산을 조금 넘겼어요'}
                </p>
                <p className="mt-3 text-sm text-gray-500">
                  예산 {formatAmount(monthlyBudget)} 중 <span className="text-red-500 font-bold">{formatAmount(currentExpenseTotal)}</span> 지출 · <span className="text-blue-600 font-bold">{formatAmount(Math.max(0, budgetLeft))}</span> 남김
                </p>
                <div className="mt-4 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: `${budgetUsedPct}%` }} />
                </div>
              </div>

              <label className="text-xs text-gray-400 mb-1 block">날짜</label>
              <input
                type="date"
                value={selectedMobileJournalDate}
                min={monthStart}
                max={monthEnd}
                onChange={e => changeMobileJournalDate(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 mb-3"
              />

              <div className="mb-3">
                <p className="text-xs font-bold text-gray-500 mb-1">이 날의 내역</p>
                {selectedMobileJournalTransactions.length === 0 ? (
                  <p className="text-xs text-gray-300 py-2">내역이 없어요</p>
                ) : (
                  <ul className="divide-y divide-gray-50">
                    {selectedMobileJournalTransactions.map(tx => (
                      <li key={tx.id} className="flex items-center justify-between py-2">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-700 truncate">{tx.memo || tx.category?.name || '미분류'}</div>
                          <div className="text-xs text-gray-400">{tx.category?.name ?? '미분류'}</div>
                        </div>
                        <span className={`text-sm font-bold ${tx.type === 'income' ? 'text-blue-600' : 'text-red-600'}`}>
                          {tx.type === 'income' ? '+' : '-'}{formatAmount(tx.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-2xl border-2 border-gray-200 px-5 py-5">
                <h3 className="text-base font-bold text-gray-600 mb-4">지난달과 비교</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="text-sm text-gray-700">지출</span>
                    <span className="text-sm font-bold text-gray-900">
                      {formatAmount(currentExpenseTotal)}
                      <span className={`ml-2 ${currentExpenseTotal - previousExpenseTotal >= 0 ? 'text-red-500' : 'text-blue-600'}`}>
                        {currentExpenseTotal - previousExpenseTotal >= 0 ? '▲' : '▼'} {formatAmount(Math.abs(currentExpenseTotal - previousExpenseTotal))}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="text-sm text-gray-700">수입</span>
                    <span className="text-sm font-bold text-gray-900">
                      {formatAmount(currentIncomeTotal)}
                      <span className={`ml-2 ${currentIncomeTotal - previousIncomeTotal >= 0 ? 'text-blue-600' : 'text-red-500'}`}>
                        {currentIncomeTotal - previousIncomeTotal >= 0 ? '▲' : '▼'} {formatAmount(Math.abs(currentIncomeTotal - previousIncomeTotal))}
                      </span>
                    </span>
                  </div>
                  {categoryCompareList.map(category => (
                    <div key={category.id} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-700">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: category.color }} />
                        {category.name}
                      </span>
                      <span className={category.diff >= 0 ? 'text-red-500 font-bold' : 'text-blue-600 font-bold'}>
                        {category.diff >= 0 ? '▲' : '▼'} {Math.round(Math.abs(category.diff) / Math.max(category.total, 1) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700 mb-3 whitespace-pre-line">{todayQuestion}</p>

              {selectedMobileJournal ? (
                <div className="relative bg-gray-50 rounded-xl p-3 text-sm text-gray-700 mb-3">
                  <div className="pr-8">{selectedMobileJournal.content}</div>
                  <button
                    onClick={() => setMobileJournalMenuOpen(prev => !prev)}
                    className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-700"
                    aria-label="회고 메뉴"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="5" cy="12" r="1.7" />
                      <circle cx="12" cy="12" r="1.7" />
                      <circle cx="19" cy="12" r="1.7" />
                    </svg>
                  </button>
                  {mobileJournalMenuOpen && (
                    <div className="absolute top-10 right-2 z-10 min-w-24 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
                    <button
                      onClick={editMobileJournal}
                        className="block w-full px-3 py-2 text-left text-xs font-bold text-gray-600 hover:bg-gray-50"
                    >
                      수정
                    </button>
                    <button
                      onClick={deleteMobileJournal}
                        className="block w-full px-3 py-2 text-left text-xs font-bold text-gray-600 hover:bg-gray-50"
                    >
                      삭제
                    </button>
                    </div>
                  )}
                </div>
              ) : null}

              <textarea
                rows={7}
                placeholder={selectedMobileJournal ? '수정할 내용을 입력하세요' : '오늘의 소비에서 발견한 것을 적어보세요'}
                value={mobileJournalText}
                onChange={e => setMobileJournalText(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none outline-none focus:border-gray-400"
              />

              <button
                onClick={saveMobileJournal}
                disabled={!mobileJournalText.trim()}
                className="mt-3 w-full bg-black text-white text-sm font-bold py-3 rounded-xl disabled:opacity-30"
              >
                저장
              </button>
            </div>
          )}
          {mobileTab === 'more' && (
            <div className="flex-1 p-4 md:hidden space-y-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">더보기</h2>
              </div>

              <button className="w-full flex items-center justify-between rounded-2xl border-2 border-gray-200 px-5 py-4 text-left">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-500 text-xl font-bold text-gray-700">
                    {profile.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg font-bold text-gray-900 truncate">{profile.name}</div>
                    <div className="text-xs tracking-[0.12em] text-gray-400 truncate">{profile.email || 'EMAIL'}</div>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-400">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>

              <div className="space-y-1">
                <button
                  onClick={() => openCategoryManager('expense')}
                  className="w-full flex items-center justify-between py-3 px-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <span>카테고리 관리</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
                <button className="w-full flex items-center justify-between py-3 px-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                  <span>알림 설정</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
                <div className="pt-4 border-t border-gray-100 mt-4">
                  <button onClick={signOut} className="w-full py-2 text-sm text-gray-400 hover:text-red-500">
                    로그아웃
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Desktop sidebar */}
        <div className="hidden md:flex">
          <Sidebar
            transactions={transactions}
            journals={journals}
            year={year}
            month={month}
            activeTab={sidebarTab}
            selectedWeekIndex={selectedDesktopWeekIndex}
            onTabChange={setSidebarTab}
            onSaveJournal={saveJournal}
            onDeleteJournal={deleteJournal}
            onManageCategories={() => openCategoryManager('expense')}
            onSignOut={signOut}
          />
        </div>
      </div>

      {/* Mobile: bottom sheet (when date selected) */}
      {selectedDate && mobileTab === 'home' && (
        <div className="md:hidden">
          <BottomSheet
            date={selectedDate}
            transactions={selectedTx}
            onAddIncome={() => setShowForm('income')}
            onAddExpense={() => setShowForm('expense')}
            onDelete={deleteTransaction}
            onClose={() => setSelectedDate(null)}
          />
        </div>
      )}

      {/* Mobile: bottom tab */}
      <div className="md:hidden">
        <BottomTab active={mobileTab} onChange={setMobileTab} />
      </div>

      {/* Transaction form modal */}
      {showForm && (
        <TransactionForm
          type={showForm}
          defaultDate={formDate}
          categories={categories}
          onManageCategories={openCategoryManager}
          onSubmit={addTransaction}
          onClose={() => setShowForm(null)}
        />
      )}

      {showCategoryManager && (
        <CategoryManager
          categories={categories}
          initialType={categoryManagerType}
          onAdd={addCategory}
          onUpdate={updateCategory}
          onDelete={deleteCategory}
          onClose={() => setShowCategoryManager(false)}
        />
      )}
    </div>
  )
}
