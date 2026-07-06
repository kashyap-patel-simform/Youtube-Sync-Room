import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'

type Variant = 'primary' | 'teal' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg' | 'icon' | 'circle'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  iconRight?: ReactNode
  loading?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-amber text-canvas font-semibold hover:bg-amber-light shadow-[0_0_20px_rgba(240,160,32,0.25)] hover:shadow-[0_0_28px_rgba(240,160,32,0.38)] active:scale-[0.98]',
  teal:
    'bg-teal text-canvas font-semibold hover:bg-teal-light shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:shadow-[0_0_28px_rgba(45,212,191,0.32)] active:scale-[0.98]',
  outline:
    'border border-border-bright text-fg-muted hover:text-fg hover:bg-surface-hover active:scale-[0.98]',
  ghost:
    'text-fg-muted hover:text-fg hover:bg-surface-raised active:scale-[0.97]',
  danger:
    'bg-danger/10 text-danger border border-danger/20 hover:bg-danger/15 active:scale-[0.98]',
}

const sizes: Record<Size, string> = {
  sm:     'px-3 py-1.5 text-sm gap-1.5 rounded-lg',
  md:     'px-5 py-2.5 text-sm gap-2 rounded-xl',
  lg:     'px-7 py-3.5 text-base gap-2.5 rounded-xl',
  icon:   'p-2 rounded-lg gap-0',
  circle: 'w-9 h-9 rounded-full p-0 gap-0',
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading,
  children,
  className,
  disabled,
  ...props
}: Readonly<ButtonProps>) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none select-none',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  )
}
