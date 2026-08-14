import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'soft'
type ButtonShape = 'default' | 'pill'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
  shape?: ButtonShape
}

const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: 'border-transparent bg-black text-white hover:bg-gray-800 active:bg-black',
  secondary: 'glass-button text-black hover:brightness-105 active:brightness-110',
  ghost: 'border-transparent bg-transparent text-(--color-text-muted) hover:bg-gray-50 active:bg-gray-100',
  soft: 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200 active:bg-gray-200',
}

const buttonShapeClasses: Record<ButtonShape, string> = {
  default: 'rounded-xl',
  pill: 'rounded-full',
}

export default function Button({
  children,
  variant = 'primary',
  shape = 'default',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'min-h-12 w-full max-w-full cursor-pointer border px-4 text-base font-bold transition disabled:cursor-not-allowed disabled:opacity-50',
        buttonVariantClasses[variant],
        buttonShapeClasses[shape],
        className,
      ].join(' ').trim()}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
