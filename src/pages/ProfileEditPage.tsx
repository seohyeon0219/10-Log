import { useNavigate } from 'react-router-dom'
import OnboardingEditContent from '../components/settings/OnboardingEditContent'

export default function ProfileEditPage() {
  const navigate = useNavigate()
  const goBack = () => navigate('/app/more')

  return (
    <section className="w-full self-start animate-fade-up md:mt-6">
      <div className="mb-6 flex items-center gap-2">
        <button
          aria-label="뒤로 가기"
          className="flex h-9 w-9 items-center justify-center rounded-full transition interactive-icon md:hidden"
          onClick={goBack}
          type="button"
        >
          <svg fill="none" height="18" viewBox="0 0 18 18" width="18">
            <path d="M11 3L5 9l6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-black">나의 정보</h1>
      </div>

      <OnboardingEditContent onClose={goBack} />
    </section>
  )
}
