import type { InputHTMLAttributes } from 'react'

type UnderInputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string
  label?: string
  suffix?: string
}

export default function UnderInput({ error, id, label, className = '', suffix = '원', ...props }: UnderInputProps) {
  const inputId = id ?? props.name

  return (
    <label className={`common-under-input-field ${className}`.trim()} htmlFor={inputId}>
      {label ? <span>{label}</span> : null}
      <div className="common-under-input-control">
        <input id={inputId} {...props} />
        <span>{suffix}</span>
      </div>
      {error ? <small role="alert">{error}</small> : null}
    </label>
  )
}
