import { useParams } from 'react-router-dom'
import MobileLayout from '../components/layouts/MobileLayout'
import { mockNavTabs } from '../mocks/data'

export default function MobilePage() {
  const { tabId } = useParams()
  const activeTab = mockNavTabs.find((tab) => tab.id === tabId) ?? mockNavTabs[0]

  return (
    <MobileLayout>
      <p className="text-base font-bold text-black">{activeTab.label} 모바일 페이지입니다</p>
    </MobileLayout>
  )
}
