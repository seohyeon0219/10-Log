import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const TEXTS = [
  '안녕하세요! 👋',
  '더 나은 자산관리를\n위한 첫걸음,',
  '몇 가지 질문을\n준비했어요',
  '화면을 터치하면 시작해요',
]

type Props = {
  onNext: () => void
}

export default function StepIntro({ onNext }: Props) {
  const [textIndex, setTextIndex] = useState(0)

  useEffect(() => {
    if (textIndex >= TEXTS.length - 1) return
    const timer = setTimeout(() => setTextIndex((i) => i + 1), 1500)
    return () => clearTimeout(timer)
  }, [textIndex])

  return (
    <button
      className="relative h-full w-full overflow-hidden bg-white text-left"
      onClick={onNext}
      type="button"
    >
      {/* 컬러 블롭 배경 */}
      <div className="pointer-events-none absolute inset-0">
        {/* 노란 블롭 — 왼쪽 상단 */}
        {/* <div
          className="absolute rounded-full"
          style={{
            top: '5%',
            left: '-10%',
            width: '75vw',
            height: '75vw',
            background: '#faf3e2',
            filter: 'blur(72px)',
            opacity: 0.95,
          }}
        /> */}
        {/* 파란 블롭 — 오른쪽 상단 */}
        <div
          className="absolute rounded-full"
          style={{
            top: '10%',
            right: '-15%',
            width: '70vw',
            height: '70vw',
            background: 'var(--color-blob-blue)',
            filter: 'blur(72px)',
            opacity: 0.9,
          }}
        />
        {/* 회색 블롭 — 중하단 */}
        {/* <div
          className="absolute rounded-full"
          style={{
            top: '40%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80vw',
            height: '80vw',
            background: 'var(--color-gray)',
            filter: 'blur(80px)',
            opacity: 0.85,
          }}
        /> */}
      </div>

      {/* 텍스트 시퀀스 */}
      <div className="relative z-10 flex h-full flex-col justify-center px-10">
        <AnimatePresence mode="wait">
          <motion.p
            key={textIndex}
            animate={{ opacity: 1, y: 0 }}
            className={[
              'whitespace-pre-line leading-snug tracking-tight',
              textIndex === TEXTS.length - 1
                ? 'text-[18px] font-semibold text-(--color-text-muted)'
                : 'text-[32px] font-extrabold text-black',
            ].join(' ')}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            {TEXTS[textIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </button>
  )
}
