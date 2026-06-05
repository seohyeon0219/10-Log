import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string
  label?: string
}

export default function Input({ error, id, label, className = '', ...props }: InputProps) {
  const inputId = id ?? props.name

  return (
    <label className={`common-input-field ${className}`.trim()} htmlFor={inputId}>
      {label ? <span>{label}</span> : null}
      <input id={inputId} {...props} />
      {error ? <small role="alert">{error}</small> : null}
    </label>
  )
}
