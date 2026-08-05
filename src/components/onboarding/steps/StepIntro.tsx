import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const TEXTS = [
  '안녕하세요! 👋',
  '더 나은 자산관리를\n위한 첫걸음,',
  '몇 가지 질문을\n준비했어요',
]

type Props = {
  onNext: () => void
}

export default function StepIntro({ onNext }: Props) {
  const [textIndex, setTextIndex] = useState(0)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    if (textIndex >= TEXTS.length - 1) return
    const timer = setTimeout(() => setTextIndex((i) => i + 1), 1500)
    return () => clearTimeout(timer)
  }, [textIndex])

  useEffect(() => {
    if (textIndex < TEXTS.length - 1) return
    const timer = setTimeout(() => setShowButton(true), 1500)
    return () => clearTimeout(timer)
  }, [textIndex])

  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
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

      {/* 텍스트 — 항상 화면 중앙 고정 */}
      <div className="relative z-10 flex h-full items-center px-10">
        <AnimatePresence mode="wait">
          <motion.p
            key={textIndex}
            animate={{ opacity: 1, y: 0 }}
            className="whitespace-pre-line text-[32px] font-extrabold leading-snug tracking-tight text-black"
            exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            {TEXTS[textIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* 버튼 — 하단 고정 (텍스트 위치에 영향 없음) */}
      <div className="absolute bottom-[calc(48px+env(safe-area-inset-bottom))] left-0 right-0 z-10 px-10">
        <AnimatePresence>
          {showButton && (
            <motion.button
              animate={{ opacity: 1, y: 0 }}
              className="w-full rounded-full bg-black py-4 text-[16px] font-bold text-white shadow-[0_4px_20px_rgba(0,0,0,0.18)]"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0, y: 16 }}
              onClick={onNext}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              whileTap={{ scale: 0.96 }}
              type="button"
            >
              답하러 가기
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
