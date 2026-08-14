import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

export default function TransparentButton({ children, className = '', type = 'button', ...props }: Props) {
  return (
    <button
      className={[
        'flex items-center justify-center gap-1.5 rounded-xl border border-black/8 bg-white/60 px-4 py-2.5 text-sm font-bold transition hover:bg-white/80 active:opacity-70 disabled:opacity-40',
        className,
      ].join(' ').trim()}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
