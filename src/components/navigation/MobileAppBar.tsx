import logo from '../../assets/logo.png'

export default function MobileAppBar() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex h-14 items-center justify-between border-b border-gray-100/60 bg-white/95 px-4 backdrop-blur-md md:hidden">
      <img alt="일공로그" className="h-10 w-auto" src={logo} />
    </header>
  )
}