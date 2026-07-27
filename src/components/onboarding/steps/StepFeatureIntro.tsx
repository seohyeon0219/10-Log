import { useEffect, useState } from 'react'

type Props = {
  name: string
  onComplete: () => void
}

function getNameParticle(name: string): '이' | '가' {
  if (!name) return '이'
  const code = name.charCodeAt(name.length - 1)
  if (code < 0xac00 || code > 0xd7a3) return '이'
  return (code - 0xac00) % 28 !== 0 ? '이' : '가'
}

const BUDGET_THEMES = [
  { label: '여유', color: 'linear-gradient(150deg, #deeaff 0%, #c2d4f8 100%)' },
  { label: '보통', color: 'linear-gradient(150deg, #d8f4e4 0%, #b8e8cc 100%)' },
  { label: '주의', color: 'linear-gradient(150deg, #fdf1d8 0%, #f5e0a8 100%)' },
  { label: '위험', color: 'linear-gradient(150deg, #fde0dc 0%, #f5c0bc 100%)' },
]

const GLASS_CARD = [
  'overflow-hidden rounded-3xl border border-white/60',
  'bg-white/35 backdrop-blur-xl',
  'shadow-[0_8px_32px_rgba(0,0,0,0.07),inset_0_1px_0_rgba(255,255,255,0.6)]',
].join(' ')

export default function StepFeatureIntro({ name, onComplete }: Props) {
  const [barStarted, setBarStarted] = useState(false)
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setBarStarted(true)))
    const t1 = setTimeout(() => setVisibleCount(1), 700)
    const t2 = setTimeout(() => setVisibleCount(2), 2800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const particle = getNameParticle(name)

  return (
    <div className="relative flex h-full flex-col overflow-hidden px-6 pt-safe-top pb-[calc(36px+env(safe-area-inset-bottom))]">
      {/* 배경 블러 데코 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-50 blur-3xl"
        style={{ background: 'radial-gradient(circle, #d4e8ff 0%, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, #e8d4ff 0%, transparent 70%)' }}
      />

      {/* 진행 바 */}
      <div className="relative mt-10">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/6 shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">
          <div
            className="h-full rounded-full transition-[width] ease-linear"
            style={{
              width: barStarted ? '100%' : '0%',
              transitionDuration: '5000ms',
              background: 'linear-gradient(90deg, #555 0%, #111 100%)',
            }}
          />
        </div>
      </div>

      {/* 피처 카드 */}
      <div className="mt-7 flex flex-1 flex-col gap-4 overflow-y-auto">
        {visibleCount >= 1 && (
          <div className={['animate-fade-up p-6', GLASS_CARD].join(' ')}>
            <div className="mb-4 flex items-center gap-3">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-(--color-text-muted)">
                소비로그 리포트
              </p>
            </div>
            <p className="text-[15px] leading-[1.7] text-black">
              한 달에 한 번,{' '}
              <span className="font-extrabold">{name || '나'}</span>
              {particle} 작성한 소비내역을 바탕으로 맞춤 리포트를 보내드릴게요!
            </p>
          </div>
        )}

        {visibleCount >= 2 && (
          <div className={['animate-fade-up p-6', GLASS_CARD].join(' ')}>
            <div className="mb-4 flex items-center gap-3">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-(--color-text-muted)">
                예산에 따른 배경색
              </p>
            </div>
            <p className="text-[15px] leading-[1.7] text-black">
              남은 예산 비율에 따라 앱 배경색이 자동으로 바뀌어요
            </p>
            <div className="mt-5 flex gap-2.5">
              {BUDGET_THEMES.map(({ label, color }) => (
                <div key={label} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="h-12 w-full rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                    style={{ background: color }}
                  />
                  <span className="text-[11px] font-semibold text-(--color-text-muted)">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 시작하기 버튼 */}
      <button
        className="mt-5 h-13 w-full rounded-full border border-white/20 bg-black/80 text-sm font-bold text-white backdrop-blur-xl shadow-[0_6px_24px_rgba(0,0,0,0.22)] transition-all duration-200 active:scale-[0.98]"
        onClick={onComplete}
        type="button"
      >
        시작하기
      </button>
    </div>
  )
}
