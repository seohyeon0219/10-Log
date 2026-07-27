import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOnboardingCompleted } from '../lib/onboardingApi'
import { supabase } from '../lib/supabase'

export default function LandingPage() {
  const navigate = useNavigate()
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

  const blobStyle: React.CSSProperties = {
    top: '28%',
    width: '160%',
    height: '55dvh',
    borderRadius: '50%',
    background: '#a9c9ff',
    filter: 'blur(72px)',
    opacity: 0.75,
  }

  const mainStyle: React.CSSProperties = {
    background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 38%, #1863dc 100%)',
  }

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden" style={mainStyle}>
      {/* 둥근 블루 블롭 */}
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={blobStyle}
      /> */}

      {/* 상단: 단어 피커 */}
      <section className="relative flex flex-3 flex-col items-start justify-center">
        {/* <div className="flex flex-col items-start gap-1 px-10">
          <p className="select-none text-[52px] font-black leading-tight tracking-tight text-(--color-text-sand) opacity-30">
            Log
          </p>

          <div className="flex items-center gap-4">
            <span
              className="h-5 w-5 flex-none rounded-full blur-sm"
              style={{ backgroundColor: '#a9c9ff' }}
            />
            <p className="select-none text-[64px] font-black leading-tight tracking-tight text-(--color-black)">
              AI
            </p>
          </div>

          <p className="select-none text-[52px] font-black leading-tight tracking-tight text-(--color-text-sand) opacity-30">
            Grow
          </p>
        </div> */}
      </section>

      {/* 하단: 브랜드 + 로그인 */}
      <section className="relative flex flex-2 flex-col justify-between px-7 pb-[calc(48px+env(safe-area-inset-bottom))] pt-9">
        <div>
          <h1 className="text-[38px] font-black leading-none tracking-tight text-white">10log</h1>
          <p className="mt-2.5 text-[15px] font-medium leading-relaxed text-white/70">
            기록할수록 똑똑해지는 나만의 소비관리
          </p>
        </div>

        <div>
          <button
            className="inline-flex h-14 w-full cursor-pointer items-center justify-center gap-4 rounded-2xl border-0 bg-white px-6 text-[15px] font-semibold text-gray-700 shadow-xl transition disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSigningIn}
            onClick={handleGoogleSignIn}
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
            <p className="mt-3 text-center text-sm font-bold text-white/80">{errorMessage}</p>
          ) : null}
        </div>
      </section>
    </main>
  )
}
