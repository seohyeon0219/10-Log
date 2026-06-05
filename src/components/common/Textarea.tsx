import type { TextareaHTMLAttributes } from 'react'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string
  label?: string
}

export default function Textarea({ error, id, label, className = '', ...props }: TextareaProps) {
  const textareaId = id ?? props.name

  return (
    <label className={`common-input-field ${className}`.trim()} htmlFor={textareaId}>
      {label ? <span>{label}</span> : null}
      <textarea id={textareaId} {...props} />
      {error ? <small role="alert">{error}</small> : null}
    </label>
  )
}
