import BackButton from './BackButton'

type BackHeaderProps = {
  to?: string
}

export default function BackHeader({ to }: BackHeaderProps) {
  return (
    <header className="mb-4 flex items-center">
      <BackButton to={to} />
    </header>
  )
}
