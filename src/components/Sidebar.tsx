import { useEffect, useState } from 'react'
import type { Transaction, JournalEntry } from '../types'
import { formatAmount } from '../utils/format'

type SidebarTab = 'stats' | 'journal' | 'more'
type PeriodType = 'monthly' | 'weekly'
type TxType = 'expense' | 'income'

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

interface Props {
  transactions: Transaction[]
  journals: JournalEntry[]
  year: number
  month: number
  activeTab: SidebarTab
  selectedWeekIndex: number
  onTabChange: (tab: SidebarTab) => void
  onSaveJournal: (date: string, content: string) => void
  onDeleteJournal: (id: string) => void
  onManageCategories: () => void
  onSignOut: () => void
}

function DonutChart({ segments, onSelect }: { segments: { id: string; color: string; pct: number }[]; onSelect: (id: string) => void }) {
  const r = 35
  const cx = 50
  const cy = 50
  const circ = 2 * Math.PI * r

  let offset = 0
  const paths = segments.map(s => {
    const dash = (s.pct / 100) * circ
    const el = (
      <circle
        key={s.id}
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={s.color}
        strokeWidth="18"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={-offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        onClick={() => onSelect(s.id)}
        className="cursor-pointer"
      />
    )
    offset += dash
    return el
  })

  return (
    <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth="18" />
      {paths}
      <circle cx={cx} cy={cy} r="24" fill="white" />
    </svg>
  )
}

export default function Sidebar({ transactions, journals, year, month, activeTab, selectedWeekIndex, onTabChange, onSaveJournal, onDeleteJournal, onManageCategories, onSignOut }: Props) {
  const [period, setPeriod] = useState<PeriodType>('monthly')
  const [txType, setTxType] = useState<TxType>('expense')
  const [journalText, setJournalText] = useState('')
  const [journalMenuOpen, setJournalMenuOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [journalDate, setJournalDate] = useState('')

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const selectedJournalDate = journalDate || todayStr
  const monthStart = `${year}-${String(month).padStart(2, '0')}-01`
  const monthEnd = `${year}-${String(month).padStart(2, '0')}-${String(new Date(year, month, 0).getDate()).padStart(2, '0')}`
  const weeks = getWeeksOfMonth(year, month)
  const selectedWeek = weeks[selectedWeekIndex] ?? weeks[0]
  const selectedWeekRange = selectedWeek
    ? `${Number(selectedWeek.start.slice(-2))}일-${Number(selectedWeek.end.slice(-2))}일`
    : ''

  useEffect(() => {
    setSelectedCategoryId(null)
  }, [selectedWeekIndex])

  // Category breakdown for stats
  const filtered = transactions.filter(t => {
    if (t.type !== txType) return false
    if (period === 'monthly') return true
    if (!selectedWeek) return true
    return t.date >= selectedWeek.start && t.date <= selectedWeek.end
  })
  const byCategory = filtered.reduce<Record<string, { id: string; name: string; color: string; total: number }>>((acc, tx) => {
    const key = tx.category_id
    if (!acc[key]) acc[key] = { id: key, name: tx.category?.name ?? '미분류', color: tx.category?.color ?? '#999', total: 0 }
    acc[key].total += tx.amount
    return acc
  }, {})

  const total = Object.values(byCategory).reduce((s, c) => s + c.total, 0)
  const categoryList = Object.values(byCategory)
    .sort((a, b) => b.total - a.total)
    .map(c => ({ ...c, pct: total > 0 ? Math.round((c.total / total) * 100) : 0 }))
  const selectedCategory = categoryList.find(category => category.id === selectedCategoryId) ?? null
  const selectedTransactions = selectedCategory
    ? filtered.filter(tx => tx.category_id === selectedCategory.id)
    : []

  const donutSegments = categoryList.map(c => ({ id: c.id, color: c.color, pct: c.pct }))
  const selectedJournal = journals.find(j => j.date === selectedJournalDate)
  const selectedJournalTransactions = transactions.filter(tx => tx.date === selectedJournalDate)

  function handleSaveJournal() {
    if (!journalText.trim()) return
    onSaveJournal(selectedJournalDate, journalText)
    setJournalText('')
  }

  function handleEditJournal() {
    if (!selectedJournal) return
    setJournalText(selectedJournal.content)
    setJournalMenuOpen(false)
  }

  function handleDeleteJournal() {
    if (!selectedJournal) return
    onDeleteJournal(selectedJournal.id)
    setJournalText('')
    setJournalMenuOpen(false)
  }

  function handleJournalDateChange(date: string) {
    setJournalDate(date)
    setJournalText('')
    setJournalMenuOpen(false)
  }

  const question = '오늘의 소비 중 가장 가치 있었던 소비는 무엇이었나요?\n반대로 후회되는 소비가 있다면 적어주세요.'
  const navItems: { key: SidebarTab; label: string; description: string }[] = [
    { key: 'stats', label: '통계', description: '이번 달 소비 흐름' },
    { key: 'journal', label: '회고', description: '하루 1분 일기' },
    { key: 'more', label: '더보기', description: '설정과 관리' },
  ]

  return (
    <div className="w-[380px] flex flex-col border-l border-gray-100 bg-white h-full">
      <div className="border-b border-gray-100 p-3">
        <div className="text-xs font-bold text-gray-400 mb-2">메뉴</div>
        <div className="space-y-1">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors ${
                activeTab === item.key
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>
                <span className="block text-sm font-bold">{item.label}</span>
                <span className={`block text-xs ${activeTab === item.key ? 'text-gray-300' : 'text-gray-400'}`}>
                  {item.description}
                </span>
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Stats tab */}
        {activeTab === 'stats' && (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">통계</h2>
              <p className="text-xs text-gray-400 mt-1">{year}년 {month}월</p>
            </div>

            {/* Period toggle */}
            <div className="flex bg-gray-100 rounded-lg p-0.5 mb-2">
              {(['monthly', 'weekly'] as PeriodType[]).map(p => (
                <button
                  key={p}
                  onClick={() => {
                    setPeriod(p)
                    setSelectedCategoryId(null)
                  }}
                  className={`flex-1 py-1.5 text-xs rounded-md font-medium transition-all ${
                    period === p ? 'bg-black text-white shadow-sm' : 'text-gray-500'
                  }`}
                >
                  {p === 'monthly' ? '월별' : '주별'}
                </button>
              ))}
            </div>

            {period === 'weekly' && (
              <div className="mb-4 flex items-center justify-between border-b border-gray-100 px-1 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-900" />
                  <span className="text-xs font-semibold text-gray-800">
                    {selectedWeek?.label ?? '선택된 주차'}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{selectedWeekRange}</span>
              </div>
            )}

            {/* Type toggle */}
            <div className="flex bg-gray-100 rounded-lg p-0.5 mb-4">
              {(['expense', 'income'] as TxType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTxType(t)}
                  className={`flex-1 py-1.5 text-xs rounded-md font-medium transition-all ${
                    txType === t
                      ? t === 'expense' ? 'bg-red-500 text-white shadow-sm' : 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-500'
                  }`}
                >
                  {t === 'expense' ? '지출' : '수입'}
                </button>
              ))}
            </div>

            {categoryList.length === 0 ? (
              <p className="text-center text-gray-300 text-xs py-8">내역이 없어요</p>
            ) : (
              <>
                <DonutChart
                  segments={donutSegments}
                  onSelect={id => setSelectedCategoryId(prev => prev === id ? null : id)}
                />

                {/* Legend */}
                <ul className="mt-3 space-y-1.5 mb-4">
                  {categoryList.map(c => (
                    <li key={c.id}>
                      <button
                        onClick={() => setSelectedCategoryId(prev => prev === c.id ? null : c.id)}
                        className="w-full flex items-center justify-between text-xs text-left"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                          <span className="text-gray-700">{c.name}</span>
                        </div>
                        <span className="text-gray-500">{c.pct}%</span>
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Bar chart */}
                <div className="space-y-2">
                  {categoryList.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategoryId(prev => prev === c.id ? null : c.id)}
                      className="w-full text-left"
                    >
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-gray-600 truncate">{c.name}</span>
                        <span className="text-gray-400 ml-1">{c.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${c.pct}%`, backgroundColor: c.color }}
                        />
                      </div>
                    </button>
                  ))}
                </div>

                {selectedCategory && (
                  <div className="border-t border-gray-100 mt-4 pt-4">
                    <h3 className="text-sm font-bold text-gray-800 mb-2">{selectedCategory.name} 내역</h3>
                    <ul className="divide-y divide-gray-50">
                      {selectedTransactions.map(tx => (
                        <li key={tx.id} className="flex items-center justify-between py-2.5">
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-800 truncate">
                              {tx.memo || tx.category?.name || '미분류'}
                            </div>
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
              </>
            )}
          </div>
        )}

        {/* Journal tab */}
        {activeTab === 'journal' && (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">소비 회고</h2>
            </div>

            <label className="text-xs text-gray-400 mb-1 block">날짜</label>
            <input
              type="date"
              value={selectedJournalDate}
              min={monthStart}
              max={monthEnd}
              onChange={e => handleJournalDateChange(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 mb-3"
            />

            <div className="mb-3">
              <p className="text-xs font-bold text-gray-500 mb-1">이 날의 내역</p>
              {selectedJournalTransactions.length === 0 ? (
                <p className="text-xs text-gray-300 py-2">내역이 없어요</p>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {selectedJournalTransactions.map(tx => (
                    <li key={tx.id} className="flex items-center justify-between py-2">
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-gray-700 truncate">{tx.memo || tx.category?.name || '미분류'}</div>
                        <div className="text-[10px] text-gray-400">{tx.category?.name ?? '미분류'}</div>
                      </div>
                      <span className={`text-xs font-bold ${tx.type === 'income' ? 'text-blue-600' : 'text-red-600'}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatAmount(tx.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p className="text-sm font-medium text-gray-700 mb-3 whitespace-pre-line">{question}</p>

            {selectedJournal ? (
              <div className="relative bg-gray-50 rounded-xl p-3 text-sm text-gray-700 mb-3">
                <div className="pr-8">{selectedJournal.content}</div>
                <button
                  onClick={() => setJournalMenuOpen(prev => !prev)}
                  className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-700"
                  aria-label="회고 메뉴"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="5" cy="12" r="1.7" />
                    <circle cx="12" cy="12" r="1.7" />
                    <circle cx="19" cy="12" r="1.7" />
                  </svg>
                </button>
                {journalMenuOpen && (
                  <div className="absolute top-10 right-2 z-10 min-w-24 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
                    <button
                      onClick={handleEditJournal}
                      className="block w-full px-3 py-2 text-left text-xs font-bold text-gray-600 hover:bg-gray-50"
                    >
                      수정
                    </button>
                    <button
                      onClick={handleDeleteJournal}
                      className="block w-full px-3 py-2 text-left text-xs font-bold text-gray-600 hover:bg-gray-50"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            ) : null}

            <textarea
              rows={4}
              placeholder={selectedJournal ? '수정할 내용을 입력하세요' : '오늘의 소비에서 발견한 것을 적어보세요'}
              value={journalText}
              onChange={e => setJournalText(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none outline-none focus:border-gray-400"
            />

            <div className="flex justify-end mt-2">
              <button
                onClick={handleSaveJournal}
                disabled={!journalText.trim()}
                className="bg-black text-white text-xs font-bold px-4 py-2 rounded-lg disabled:opacity-30"
              >
                저장
              </button>
            </div>
          </div>
        )}

        {/* More tab */}
        {activeTab === 'more' && (
          <div className="space-y-1">
            <button
              onClick={onManageCategories}
              className="w-full flex items-center justify-between py-3 px-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <span>카테고리 관리</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
            <button className="w-full flex items-center justify-between py-3 px-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
              <span>알림 설정</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
            <button className="w-full flex items-center justify-between py-3 px-2 text-sm text-gray-400 hover:bg-gray-50 rounded-lg">
              <span>개인정보처리방침</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
            <div className="pt-4 border-t border-gray-100 mt-4">
              <button
                onClick={onSignOut}
                className="w-full py-2 text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
