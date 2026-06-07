import type { TextareaHTMLAttributes } from 'react'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string
  label?: string
}

export default function Textarea({ error, id, label, className = '', ...props }: TextareaProps) {
  const textareaId = id ?? props.name

  return (
    <label className={['grid w-full gap-2', className].join(' ').trim()} htmlFor={textareaId}>
      {label ? <span className="text-sm font-semibold text-gray-500">{label}</span> : null}
      <textarea
        className="min-h-32 w-full resize-y rounded-xl border border-transparent bg-gray-50 p-4 text-base leading-relaxed font-semibold text-black outline-none transition placeholder:text-gray-300 focus:border-gray-200 focus:bg-white"
        id={textareaId}
        {...props}
      />
      {error ? (
        <small className="text-sm font-semibold text-(--color-expense-red)" role="alert">
          {error}
        </small>
      ) : null}
    </label>
  )
}
