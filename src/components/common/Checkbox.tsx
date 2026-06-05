import type { InputHTMLAttributes, ReactNode } from 'react'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  children: ReactNode
}

export default function Checkbox({ children, className = '', id, ...props }: CheckboxProps) {
  const checkboxId = id ?? props.name

  return (
    <label className={`common-checkbox ${className}`.trim()} htmlFor={checkboxId}>
      <input id={checkboxId} type="checkbox" {...props} />
      <span aria-hidden="true" />
      <strong>{children}</strong>
    </label>
  )
}
