import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import logoImage from '../../../assets/logo.png'

type Phase = 'intro' | 'expanding' | 'revealed'

type Props = {
  onNext: () => void
}

export default function StepIntro({ onNext }: Props) {
  const [phase, setPhase] = useState<Phase>('intro')

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* 흰 배경 — revealed 시 페이드인 */}
      <AnimatePresence>
        {phase === 'revealed' && (
          <motion.div
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-10 bg-white"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />
        )}
      </AnimatePresence>

      {/* 블루 블롭 */}
      <motion.div
        animate={
          phase === 'intro'
            ? { scale: 1, opacity: 1 }
            : phase === 'expanding'
              ? { scale: 22, opacity: 1 }
              : { scale: 22, opacity: 0 }
        }
        className="absolute -bottom-24 left-1/2 z-20 h-48 w-48 -translate-x-1/2 rounded-full"
        onAnimationComplete={() => {
          if (phase === 'expanding') setPhase('revealed')
        }}
        style={{ background: 'linear-gradient(150deg, #a9c9ff 0%, #1863dc 100%)' }}
        transition={
          phase === 'expanding'
            ? { duration: 0.85, ease: [0.4, 0, 0.2, 1] }
            : { duration: 0.5, ease: 'easeOut' }
        }
      />

      {/* Intro 텍스트 */}
      <AnimatePresence>
        {phase === 'intro' && (
          <motion.button
            className="absolute inset-0 z-30 flex flex-col items-start justify-center px-8 pb-[env(safe-area-inset-bottom)] text-left"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            onClick={() => setPhase('expanding')}
            type="button"
          >
            <p className="text-[15px] font-semibold text-(--color-text-muted)">안녕하세요! 👋</p>
            <h1 className="mt-4 text-[30px] font-extrabold leading-snug text-black">
              더 나은 자산관리를<br />위한 첫걸음,
            </h1>
            <p className="mt-6 text-[16px] font-medium leading-relaxed text-(--color-text-dim)">
              몇 가지 질문을 준비했어요.<br />
              답변을 바탕으로 당신에게<br />
              맞는 서비스를 제공해드릴게요.
            </p>
            <p className="mt-10 text-[13px] text-(--color-text-muted)">화면을 터치하면 시작해요</p>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Revealed 콘텐츠 */}
      <AnimatePresence>
        {phase === 'revealed' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-8 pb-[calc(48px+env(safe-area-inset-bottom))]">
            {/* 로고 원형 */}
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="h-24 w-24 overflow-hidden rounded-full border-4 border-gray-100 bg-white shadow-xl"
              initial={{ opacity: 0, scale: 0.6, y: 48 }}
              transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <img
                alt="일공로그 로고"
                className="h-full w-full object-contain"
                src={logoImage}
              />
            </motion.div>

            {/* 서비스 설명 */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 32 }}
              transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            >
              <p className="text-[26px] font-black text-black">10log</p>
              <p className="mt-2 text-[15px] font-medium leading-relaxed text-(--color-text-dim)">
                기록할수록 똑똑해지는<br />나만의 소비관리
              </p>
            </motion.div>

            {/* 시작하기 버튼 */}
            <motion.button
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 h-13 w-full max-w-xs rounded-full bg-black text-[15px] font-bold text-white shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
              initial={{ opacity: 0, y: 24 }}
              onClick={onNext}
              transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
              type="button"
            >
              시작하기
            </motion.button>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
