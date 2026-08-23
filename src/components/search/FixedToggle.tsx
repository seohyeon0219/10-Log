import Toggle from '../common/Toggle'

type FixedToggleProps = {
  checked: boolean
  onChange: (checked: boolean) => void
}

export default function FixedToggle({ checked, onChange }: FixedToggleProps) {
  return (
    <Toggle checked={checked} onChange={onChange}>
      고정 수입/지출만 보기
    </Toggle>
  )
}
