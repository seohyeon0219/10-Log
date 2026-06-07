import DesktopReviewContainer from '../containers/desktop/ReviewContainer'
import MobileReviewContainer from '../containers/mobile/ReviewContainer'

export default function ReviewPage() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopReviewContainer />
      </div>
      <div className="block md:hidden">
        <MobileReviewContainer />
      </div>
    </>
  )
}
