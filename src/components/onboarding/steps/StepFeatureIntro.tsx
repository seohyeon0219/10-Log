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

const GLASS_CARD = [
  'overflow-hidden rounded-3xl border border-white/60',
  'bg-white/35 backdrop-blur-xl',
  'shadow-[0_8px_32px_rgba(0,0,0,0.07),inset_0_1px_0_rgba(255,255,255,0.6)]',
].join(' ')

const REPORT_ITEMS = ['소비 패턴 분석', '절약 인사이트 제공', '다음 달 예산 제안']

export default function StepFeatureIntro({ name, onComplete }: Props) {
  const [barStarted, setBarStarted] = useState(false)
  const [showCard, setShowCard] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setBarStarted(true)))
    const t = setTimeout(() => setShowCard(true), 400)
    return () => clearTimeout(t)
  }, [])

  const particle = getNameParticle(name || '나')

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
              transitionDuration: '2500ms',
              background: 'linear-gradient(90deg, #555 0%, #111 100%)',
            }}
          />
        </div>
      </div>

      {/* 피처 카드 */}
      <div className="mt-7 flex flex-1 flex-col">
        {showCard && (
          <div className={['animate-fade-up p-6', GLASS_CARD].join(' ')}>
            <span className="text-3xl">📊</span>

            <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.14em] text-(--color-text-muted)">
              소비로그 리포트
            </p>

            <p className="mt-1.5 text-[20px] font-extrabold leading-snug text-black">
              {name ? `${name}님만을 위한` : '나만을 위한'}<br />맞춤 AI 리포트
            </p>

            <p className="mt-3 text-[14px] leading-[1.75] text-(--color-text-dim)">
              한 달에 한 번,{' '}
              <span className="font-semibold text-black">{name ? `${name}님${particle}` : `내${particle}`}</span>{' '}
              작성한 소비내역을 바탕으로 맞춤 리포트를 보내드려요.
            </p>

            <ul className="mt-5 space-y-2.5">
              {REPORT_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[13px] text-(--color-text-dim)">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-black/25" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 설정 안내 */}
      <p className="mt-5 text-center text-xs font-medium leading-relaxed text-(--color-text-muted)">
        입력한 정보는 더보기 탭 &gt; 나의 온보딩 정보에서 언제든 수정할 수 있어요.
      </p>

      {/* 시작하기 버튼 */}
      <button
        className="mt-3 h-13 w-full rounded-full border border-white/20 bg-black/80 text-sm font-bold text-white backdrop-blur-xl shadow-[0_6px_24px_rgba(0,0,0,0.22)] transition-all duration-150 active:scale-[0.96]"
        onClick={onComplete}
        type="button"
      >
        시작하기
      </button>
    </div>
  )
}
