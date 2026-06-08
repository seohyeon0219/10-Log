type ReviewCommentTextareaProps = {
  label?: string
  maxLength?: number
  onChange: (value: string) => void
  placeholder: string
  value: string
}

export default function ReviewCommentTextarea({
  label = '한 줄 코멘트',
  maxLength = 80,
  onChange,
  placeholder,
  value,
}: ReviewCommentTextareaProps) {
  return (
    <label className="grid gap-2">
      <span className="flex items-center justify-between gap-3 text-sm font-semibold text-stone-500">
        {label}
        <span className="shrink-0 text-xs font-bold text-stone-300">
          {value.length}/{maxLength}
        </span>
      </span>
      <textarea
        className="min-h-20 w-full resize-none rounded-xl border border-stone-200 bg-white/75 p-3 text-sm leading-6 font-semibold text-stone-900 outline-none transition placeholder:text-stone-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(253,230,138,0.28)]"
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  )
}
