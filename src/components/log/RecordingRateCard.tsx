import { useNavigate } from 'react-router-dom'

const ProgressRing = ({ pct }: { pct: number }) => {
  const S = 38, sw = 3, r = (S - sw) / 2, cx = S / 2, c = 2 * Math.PI * r
  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={{ display: 'block' }}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(21,26,34,0.11)" strokeWidth={sw} />
      <circle
        cx={cx} cy={cx} r={r} fill="none"
        stroke="rgba(27,33,48,0.8)" strokeWidth={sw}
        strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cx})`}
      />
    </svg>
  )
}

function shortWon(amount: number) {
  if (amount >= 10_000) return `${+(amount / 10_000).toFixed(1)}만`
  return amount.toLocaleString('ko-KR')
}

type Props = {
  emptyCount: number
  emptySum: number
  month: number
  pct: number
}

export default function RecordingRateCard({ emptyCount, emptySum, month, pct }: Props) {
  const navigate = useNavigate()
  const isDeck = emptyCount >= 3
  const done = emptyCount === 0

  const title = done ? '이번 달 전부 기록했어요' : `${emptyCount}건 돌아보기`
  const hint = done
    ? `통계에서 ${month}월 리포트를 볼 수 있어요`
    : emptyCount <= 3
      ? `${emptyCount}건만 더 하면 ${month}월 리포트가 열려요`
      : `한 건씩 넘기며 ${shortWon(emptySum)}원어치를 돌아봐요`

  return (
    <div style={{ position: 'relative', marginTop: isDeck ? 14 : 0 }}>
      <button
        onClick={() => navigate('/app/log/tag')}
        style={{ position: 'relative', width: '100%', padding: 0, background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left' }}
        type="button"
      >
        {isDeck && (
          <>
            <span style={{ position: 'absolute', left: 12, right: 12, top: -8, height: 38, borderRadius: 17, background: 'rgba(255,255,255,0.38)', border: '1px solid rgba(255,255,255,0.7)' }} />
            <span style={{ position: 'absolute', left: 6, right: 6, top: -4, height: 38, borderRadius: 18, background: 'rgba(255,255,255,0.52)', border: '1px solid rgba(255,255,255,0.85)' }} />
          </>
        )}

        <span style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderRadius: 19, background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(255,255,255,0.97)', backdropFilter: 'blur(26px) saturate(150%)', WebkitBackdropFilter: 'blur(26px) saturate(150%)', boxShadow: '0 14px 32px rgba(90,75,40,0.11), inset 0 1px 0 rgba(255,255,255,0.95)' }}>
          <span style={{ position: 'relative', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ProgressRing pct={pct} />
            <span style={{ position: 'absolute', font: '600 10px/1 Pretendard', color: '#151a22' }}>{pct}%</span>
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', font: '600 14px/1.3 Pretendard', color: '#151a22' }}>{title}</span>
            <span style={{ display: 'block', font: '400 11px/1.4 Pretendard', color: 'rgba(21,26,34,0.5)', marginTop: 3 }}>{hint}</span>
          </span>
          <span style={{ font: '500 15px/1 Pretendard', color: 'rgba(21,26,34,0.32)' }}>›</span>
        </span>
      </button>
    </div>
  )
}
