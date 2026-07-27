import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import logoImage from '../assets/logo.png'
import { getOnboardingCompleted } from '../lib/onboardingApi'
import { supabase } from '../lib/supabase'

type Phase = 'intro' | 'revealed'

const blobStyle = {
  background: 'linear-gradient(160deg, rgba(250,243,226,0.65) 0%, rgba(169,201,255,0.7) 45%, rgba(24,99,220,0.88) 100%)',
  backdropFilter: 'blur(28px) saturate(180%)',
  WebkitBackdropFilter: 'blur(28px) saturate(180%)',
  boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.75), 0 8px 40px rgba(24,99,220,0.35)',
  border: '0px solid rgba(255,255,255,0.6)',
} as const

export default function LandingPage() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('intro')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSigningIn, setIsSigningIn] = useState(false)
  const isPreview = new URLSearchParams(window.location.search).has('preview')

  useEffect(() => {
    if (isPreview) return

    let isMounted = true

    const moveAfterLogin = async () => {
      try {
        const completed = await getOnboardingCompleted()
        if (isMounted) {
          navigate(completed ? '/app/home' : '/onboarding', { replace: true })
        }
      } catch {
        if (isMounted) navigate('/app/home', { replace: true })
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      if (isMounted && data.session) {
        void moveAfterLogin()
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        void moveAfterLogin()
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [navigate, isPreview])

  const handleGoogleSignIn = async () => {
    setErrorMessage('')
    setIsSigningIn(true)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })

    if (error) {
      setErrorMessage('구글 로그인 연결 중 문제가 발생했어요.')
      setIsSigningIn(false)
    }
  }

  return (
    <main
      className="relative flex min-h-dvh flex-col"
      style={{ background: 'linear-gradient(160deg, #faf3e2 0%, #fdf9ef 35%, #e4eeff 68%, #c8dcff 100%)' }}
    >

      {/* 인트로 블롭: 납작한 타원형 */}
      <AnimatePresence>
        {phase === 'intro' && (
          <motion.div
            layoutId="morphing-blob"
            className="absolute left-1/2 z-20 -translate-x-1/2 rounded-[50%]"
            style={{
              ...blobStyle,
              bottom: '-75px',
              width: '150vw',
              height: '300px',
            }}
          />
        )}
      </AnimatePresence>

      {/* 인트로 텍스트 + 탭 핸들러 */}
      <AnimatePresence>
        {phase === 'intro' && (
          <motion.button
            className="absolute inset-0 z-30 flex flex-col items-center justify-center px-10 text-center"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            onClick={() => setPhase('revealed')}
            type="button"
          >
            <p className="text-[26px] font-semibold leading-snug tracking-tight text-black">
              기록할수록<br />똑똑해지는<br />나만의 소비관리
            </p>
            <p className="absolute bottom-[calc(28px+env(safe-area-inset-bottom))] text-[13px] text-(--color-text-sand)">
              화면을 터치하면 시작해요
            </p>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 로그인 화면: 블롭이 로고 원으로 모핑 후 컨텐츠 등장 */}
      <AnimatePresence>
        {phase === 'revealed' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-7 pb-[calc(48px+env(safe-area-inset-bottom))]">
            {/* 로고 원 — layoutId로 타원 블롭에서 모핑 */}
            <motion.div
              layoutId="morphing-blob"
              animate={{ filter: 'blur(0px)' }}
              className="relative h-24 w-24 overflow-hidden rounded-full"
              initial={{ filter: 'blur(10px)' }}
              style={blobStyle}
              transition={{
                layout: { duration: 1.5, ease: [0.34, 1.56, 0.64, 1] },
                filter: { duration: 0.8, delay: 0.25, ease: 'easeOut' },
              }}
            >
              {/* 흰 원 오버레이 — 모핑 완료 후 페이드인 */}
              {/* <motion.div
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              /> */}
              {/* 로고 이미지 */}
              {/* <motion.img
                alt="일공로그 로고"
                animate={{ opacity: 1 }}
                className="absolute inset-0 h-full w-full object-contain object-center"
                initial={{ opacity: 0 }}
                src={logoImage}
                transition={{ duration: 0.4, delay: 0.95 }}
              /> */}
            </motion.div>

            {/* 10log — 아래서 위로 슬라이드 */}
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-[26px] font-black text-black"
              initial={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.65, delay: 1, ease: [0.34, 1.56, 0.64, 1] }}
            >
              10log
            </motion.p>

            {/* 서비스 설명 — blur → 선명 페이드인 (10log 완료 후 0.5s 대기) */}
            <motion.p
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              className="mt-2 text-center text-[15px] font-medium leading-relaxed text-(--color-text-muted)"
              initial={{ opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: 0.7, delay: 2.1, ease: 'easeOut' }}
            >
              기록할수록 똑똑해지는<br />나만의 소비관리
            </motion.p>

            {/* 구글 로그인 버튼 — blur → 선명 페이드인 */}
            <motion.div
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              className="mt-10 w-full max-w-sm"
              initial={{ opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: 0.65, delay: 2.25, ease: 'easeOut' }}
            >
              <button
                className="inline-flex h-14 w-full cursor-pointer items-center justify-center gap-4 rounded-2xl px-6 text-[15px] font-semibold text-gray-800 transition disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSigningIn}
                onClick={handleGoogleSignIn}
                style={{
                  background: 'rgba(255,255,255,0.55)',
                  backdropFilter: 'blur(20px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                  border: '1px solid rgba(255,255,255,0.75)',
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.85), 0 4px 20px rgba(0,0,0,0.08)',
                }}
                type="button"
              >
                <svg aria-hidden="true" className="h-6 w-6 flex-none" viewBox="0 0 48 48">
                  <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.52h11.84c-.52 2.74-2.08 5.06-4.42 6.62v5.5h7.16c4.18-3.86 6.54-9.54 6.54-16.14z" />
                  <path fill="#34A853" d="M24 46c5.98 0 11-1.98 14.58-5.36l-7.16-5.5c-1.98 1.32-4.5 2.1-7.42 2.1-5.76 0-10.64-3.88-12.38-9.1H4.24v5.68C7.84 40.98 15.24 46 24 46z" />
                  <path fill="#FBBC05" d="M11.62 28.14c-.44-1.32-.7-2.72-.7-4.14s.26-2.82.7-4.14v-5.68H4.24C2.74 17.18 1.88 20.48 1.88 24s.86 6.82 2.36 9.82l7.38-5.68z" />
                  <path fill="#EA4335" d="M24 10.76c3.26 0 6.18 1.12 8.48 3.32l6.34-6.34C34.98 4.16 29.98 2 24 2 15.24 2 7.84 7.02 4.24 14.18l7.38 5.68c1.74-5.22 6.62-9.1 12.38-9.1z" />
                </svg>
                <span>{isSigningIn ? '로그인 연결 중...' : 'Google로 시작하기'}</span>
              </button>
              {errorMessage ? (
                <p className="mt-3 text-center text-sm font-bold text-(--color-expense-red)">{errorMessage}</p>
              ) : null}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}
