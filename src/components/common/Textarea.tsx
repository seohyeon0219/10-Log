import type { TextareaHTMLAttributes } from 'react'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string
  label?: string
}

export default function Textarea({ error, id, label, className = '', ...props }: TextareaProps) {
  const textareaId = id ?? props.name

  return (
    <label className={['grid w-full gap-2', className].join(' ').trim()} htmlFor={textareaId}>
      {label ? <span className="font-bold text-black">{label}</span> : null}
      <textarea
        className="min-h-32 w-full resize-y rounded-lg border border-(--color-gray) p-3 leading-relaxed text-black outline-none focus:border-(--color-gray)"
        id={textareaId}
        {...props}
      />
      {error ? <small className="text-(--color-expense-red)" role="alert">{error}</small> : null}
    </label>
  )
}
