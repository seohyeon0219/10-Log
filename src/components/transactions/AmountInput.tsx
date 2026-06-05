import type { ChangeEvent, InputHTMLAttributes } from 'react'
import Input from '../common/Input'

type AmountInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'inputMode' | 'type'> & {
  error?: string
  label?: string
}

export default function AmountInput({ label, onChange, ...props }: AmountInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.currentTarget.value = event.currentTarget.value.replace(/\D/g, '')
    onChange?.(event)
  }

  return (
    <Input
      autoComplete="off"
      inputMode="numeric"
      label={label}
      onChange={handleChange}
      pattern="[0-9]*"
      type="text"
      {...props}
    />
  )
}
