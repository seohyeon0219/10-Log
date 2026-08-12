import BackHeader from '../components/common/BackHeader'
import OnboardingEditContent from '../components/settings/OnboardingEditContent'
import { useNavigate } from 'react-router-dom'

export default function ProfileEditPage() {
  const navigate = useNavigate()
  const goBack = () => navigate('/app/more')

  return (
    <section className="w-full self-start animate-fade-up md:mt-6">
      <BackHeader title="나의 정보" to="/app/more" />
      <OnboardingEditContent onClose={goBack} />
    </section>
  )
}
