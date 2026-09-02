import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SatisfactionIcon from '../components/common/SatisfactionIcon'
import { MOOD_LABELS } from '../components/log/EmotionRateCard'
import { getMonthlyTransactions } from '../lib/financeApi'
import { useCalendarStore } from '../stores/calendarStore'
import { THEME_GRADIENTS, useThemeStore } from '../stores/themeStore'
import type { Satisfaction, Transaction } from '../types/finance'
import { formatMonthDay } from '../utils/formatters'

function CompleteRing({ size = 76, animated }: { animated: boolean; size?: number }) {
  const sw = 4.2
  const r = (size - sw) / 2
  const cx = size / 2
  const c = 2 * Math.PI * r
  return (
    <svg display="block" height={size} viewBox={`0 0 ${size} ${size}`} width={size} style={{ display: 'block' }}>
      <circle cx={cx} cy={cx} fill="none" r={r} stroke="rgba(21,26,34,0.1)" strokeWidth={sw} />
      <circle
        cx={cx} cy={cx} fill="none" r={r}
        stroke="rgba(27,33,48,0.85)" strokeWidth={sw}
        strokeDasharray={c} strokeDashoffset={animated ? 0 : c}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cx})`}
        style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.2,.9,.25,1)' }}
      />
      <path
        d={`M${size * 0.34} ${size * 0.51} L${size * 0.45} ${size * 0.62} L${size * 0.67} ${size * 0.39}`}
        fill="none" stroke="rgba(27,33,48,0.85)" strokeWidth={sw * 0.9}
        strokeLinecap="round" strokeLinejoin="round"
        style={{
          opacity: animated ? 1 : 0,
          transform: animated ? 'scale(1)' : 'scale(0.85)',
          transformOrigin: `${cx}px ${cx}px`,
          transition: 'opacity .3s ease .35s, transform .3s cubic-bezier(.2,.9,.25,1) .35s',
        }}
      />
    </svg>
  )
}

function CompleteScreen({ count, month, onTap }: { count: number; month: number; onTap: () => void }) {
  const theme = useThemeStore((s) => s.theme)
  const [animated, setAnimated] = useState(false)
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reducedMotion) { setAnimated(true); return }
    let id1: number, id2: number
    id1 = requestAnimationFrame(() => { id2 = requestAnimationFrame(() => setAnimated(true)) })
    return () => { cancelAnimationFrame(id1); cancelAnimationFrame(id2) }
  }, [reducedMotion])

  const textStyle = reducedMotion ? {} : {
    opacity: animated ? 1 : 0,
    transform: animated ? 'translateY(0)' : 'translateY(6px)',
    transition: 'opacity .35s ease .5s, transform .35s ease .5s',
  }

  return (
    <button
      onClick={onTap}
      type="button"
      style={{
        appearance: 'none', border: 0, padding: 0, cursor: 'pointer',
        display: 'block', position: 'fixed', inset: 0, textAlign: 'left',
        background: THEME_GRADIENTS[theme],
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 44px 34px',
      }}>
        <CompleteRing animated={reducedMotion || animated} size={76} />

        <div style={{
          marginTop: 24, textAlign: 'center',
          font: '600 21px/1.4 Pretendard',
          color: 'var(--ink-1)', letterSpacing: '-0.02em',
          ...textStyle,
        }}>
          {month}월 기록을 마쳤어요
        </div>

        <div style={{
          marginTop: 10, textAlign: 'center',
          font: '400 13px/1.6 Pretendard',
          color: 'var(--ink-2)',
          textWrap: 'pretty' as never,
          whiteSpace: 'pre-line',
          ...textStyle,
        }}>
          {`이번 달 ${count}건에 감정을 모두 남겼어요.\n통계에서 ${month}월 리포트를 볼 수 있어요.`}
        </div>

        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 34,
          textAlign: 'center',
          font: '500 12px/1 Pretendard', color: 'var(--ink-3)',
        }}>
          화면을 탭하면 로그로 이동해요
        </div>
      </div>
    </button>
  )
}

const SATISFACTION_OPTIONS: Satisfaction[] = ['satisfied', 'neutral', 'regret']

type HistoryEntry = { txId: string; satisfaction: Satisfaction | null }

function getFooterText(remaining: number, total: number): string {
  const ratio = remaining / total
  if (ratio > 0.7) return '하나씩 남기다 보면 소비 패턴이 보여요'
  if (ratio > 0.3) return '절반 이상 왔어요, 계속해봐요'
  if (remaining > 1) return '거의 다 왔어요!'
  return '마지막 하나예요'
}

export default function TaggingContainer() {
  const navigate = useNavigate()
  const currentDate = useCalendarStore((s) => s.currentDate)
  const loadMonth = useCalendarStore((s) => s.loadMonth)
  const transactions = useCalendarStore((s) => s.transactions)
  const updateTransaction = useCalendarStore((s) => s.updateTransaction)

  // 처음 로드된 미태깅 목록을 스냅샷으로 고정
  const [snapshot, setSnapshot] = useState<Transaction[] | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [prevSatisfactionMap, setPrevSatisfactionMap] = useState<Map<string, Satisfaction>>(new Map())

  useEffect(() => { void loadMonth() }, [loadMonth])

  // 트랜잭션이 로드되면 한 번만 스냅샷 설정
  useEffect(() => {
    if (snapshot !== null) return
    if (transactions.length === 0) return
    const untagged = transactions.filter((tx) => tx.type === 'expense' && !tx.satisfaction)
    setSnapshot(untagged)
  }, [transactions, snapshot])

  // 지난달 데이터 조회
  useEffect(() => {
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    getMonthlyTransactions(prevMonth)
      .then((txs) => {
        const map = new Map<string, Satisfaction>()
        for (const tx of txs) {
          if (tx.type === 'expense' && tx.satisfaction && tx.categoryId) {
            map.set(tx.categoryId, tx.satisfaction)
          }
        }
        setPrevSatisfactionMap(map)
      })
      .catch(() => {})
  }, [currentDate])

  const total = snapshot?.length ?? 0
  const tx = snapshot?.[currentIndex] ?? null
  const isDone = snapshot !== null && currentIndex >= total

  const handleTag = async (satisfaction: Satisfaction) => {
    if (!tx) return
    await updateTransaction(tx.id, {
      amount: tx.amount,
      categoryId: tx.categoryId,
      date: tx.date,
      isFixed: tx.isFixed,
      memo: tx.memo,
      satisfaction,
    })
    setHistory((h) => [...h, { txId: tx.id, satisfaction }])
    setCurrentIndex((i) => i + 1)
  }

  const handleSkip = () => {
    if (!tx) return
    setHistory((h) => [...h, { txId: tx.id, satisfaction: null }])
    setCurrentIndex((i) => i + 1)
  }

  const handleBack = async () => {
    if (currentIndex === 0 || history.length === 0) return
    const prev = history[history.length - 1]
    if (prev.satisfaction && snapshot) {
      const prevTx = snapshot.find((t) => t.id === prev.txId)
      if (prevTx) {
        await updateTransaction(prevTx.id, {
          amount: prevTx.amount,
          categoryId: prevTx.categoryId,
          date: prevTx.date,
          isFixed: prevTx.isFixed,
          memo: prevTx.memo,
          satisfaction: null,
        })
      }
    }
    setHistory((h) => h.slice(0, -1))
    setCurrentIndex((i) => i - 1)
  }

  const progressPercent = total > 0 ? (currentIndex / total) * 100 : 0
  const canGoBack = currentIndex > 0

  // 완료 화면
  if (isDone) {
    const month = currentDate.getMonth() + 1
    const count = transactions.filter((tx) => tx.type === 'expense' && tx.satisfaction !== null).length
    return (
      <CompleteScreen
        count={count}
        month={month}
        onTap={() => navigate('/app/log', { replace: true })}
      />
    )
  }

  if (!tx) return null

  const hintParts: string[] = []
  if (tx.isFixed) {
    const day = new Date(`${tx.date}T00:00:00`).getDate()
    hintParts.push(`매달 ${day}일 반복`)
  }
  const prevSatisfaction = tx.categoryId ? prevSatisfactionMap.get(tx.categoryId) : undefined
  if (prevSatisfaction) {
    hintParts.push(`지난달에도 ${MOOD_LABELS[prevSatisfaction]}으로 남겼어요`)
  }
  const hintText = hintParts.join(' · ')

  return (
    <div
      style={{
        position: 'fixed', inset: 0, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        padding: '48px 20px 26px',
      }}
    >
      {/* 1. 헤더 */}
      <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* ✕ 닫기 */}
        <button
          onClick={() => navigate(-1)}
          style={{
            flex: 'none', width: 32, height: 32, borderRadius: 11,
            backgroundColor: 'rgba(21,26,34,0.08)', border: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          type="button"
        >
          <span style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1 }}>✕</span>
        </button>

        {/* ‹ 되돌리기 */}
        <button
          onClick={handleBack}
          disabled={!canGoBack}
          style={{
            flex: 'none', width: 32, height: 32, borderRadius: 11,
            backgroundColor: canGoBack ? 'rgba(21,26,34,0.08)' : 'transparent',
            border: 'none', cursor: canGoBack ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: canGoBack ? 1 : 0,
            transition: 'opacity 0.2s',
          }}
          type="button"
        >
          <span style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1 }}>‹</span>
        </button>

        {/* 진행바 */}
        <div
          style={{
            flex: 1, height: 5, borderRadius: 3,
            backgroundColor: 'rgba(21,26,34,0.1)', overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%', borderRadius: 3,
              background: 'linear-gradient(90deg, #818cf8 0%, #a855f7 100%)',
              width: `${progressPercent}%`,
              transition: 'width 0.35s cubic-bezier(.2,.9,.25,1)',
            }}
          />
        </div>

        {/* 카운트 */}
        <span style={{ flex: 'none', fontSize: 12, fontWeight: 600, color: 'var(--ink-2)' }}>
          {currentIndex}/{total}
        </span>
      </div>

      {/* 2. 본문 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

        {/* 2-1. 카드 스택 */}
        <div style={{ position: 'relative' }}>
          {/* 뒤 층1 (가장 아래) */}
          <div style={{
            position: 'absolute', left: 14, right: 14, top: -14, height: 60,
            borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.34)',
            backdropFilter: 'blur(12px)',
          }} />
          {/* 뒤 층2 */}
          <div style={{
            position: 'absolute', left: 7, right: 7, top: -7, height: 60,
            borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.46)',
            backdropFilter: 'blur(16px)',
          }} />

          {/* 앞 카드 */}
          <div style={{
            position: 'relative',
            padding: '30px 24px 26px', borderRadius: 26,
            backgroundColor: 'rgba(255,255,255,0.72)',
            backdropFilter: 'blur(20px) saturate(160%)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }}>
            {/* 첫 줄: 카테고리 ↔ 날짜 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{
                padding: '4px 12px', borderRadius: 99,
                fontSize: 12, fontWeight: 600,
                backgroundColor: `${tx.categoryColor}22`, color: tx.categoryColor,
              }}>
                {tx.categoryName}
              </span>
              <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--ink-2)' }}>
                {formatMonthDay(tx.date)}
              </span>
            </div>

            {/* 내역명 */}
            <p style={{
              marginTop: 20, fontSize: 23, fontWeight: 600,
              letterSpacing: '-0.02em', color: 'var(--ink-1)',
              textWrap: 'pretty' as never,
            }}>
              {tx.memo || <span style={{ color: 'var(--ink-3)' }}>메모 없음</span>}
            </p>

            {/* 금액 */}
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 32, fontWeight: 600, color: 'var(--ink-1)', letterSpacing: '-0.02em' }}>
                {tx.amount.toLocaleString('ko-KR')}
              </span>
              <span style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink-1)' }}>원</span>
            </div>

            {/* 구분선 + 문맥 */}
            {hintText && (
              <p style={{
                marginTop: 16, paddingTop: 15,
                borderTop: '1px solid rgba(21,26,34,0.09)',
                fontSize: 12, fontWeight: 400, color: 'var(--ink-2)',
              }}>
                {hintText}
              </p>
            )}
          </div>
        </div>

        {/* 2-3. 질문 */}
        <p style={{ marginTop: 30, fontSize: 12, fontWeight: 500, textAlign: 'center', color: 'var(--ink-2)' }}>
          이 지출, 지금 돌아보면 어때요?
        </p>

        {/* 2-4. 버튼 3개 — grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 9, marginTop: 12 }}>
          {SATISFACTION_OPTIONS.map((v) => (
            <button
              key={v}
              onClick={() => handleTag(v)}
              style={{
                padding: '20px 0 17px', borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.72)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.6)',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 11,
                boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.06)'
              }}
              type="button"
            >
              <SatisfactionIcon className="text-black" size={30} value={v} />
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)' }}>{MOOD_LABELS[v]}</span>
            </button>
          ))}
        </div>

        {/* 2-5. 건너뛰기 */}
        <button
          onClick={handleSkip}
          style={{
            marginTop: 14, background: 'none', border: 'none',
            cursor: 'pointer', fontSize: 12, fontWeight: 500,
            color: 'var(--ink-3)', textAlign: 'center', padding: '4px 0',
          }}
          type="button"
        >
          기억 안 나요 — 건너뛰기
        </button>
      </div>

      {/* 3. 푸터 */}
      <div style={{ flex: 'none', textAlign: 'center', fontSize: 11, fontWeight: 400, color: 'var(--ink-3)' }}>
        {getFooterText(total - currentIndex, total)}
      </div>
    </div>
  )
}
