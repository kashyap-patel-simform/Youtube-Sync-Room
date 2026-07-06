import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

type BadgeVariant = 'host' | 'participant' | 'online' | 'offline' | 'teal' | 'amber'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  host:        'bg-amber/10 text-amber border border-amber/20',
  participant: 'bg-surface-raised text-fg-muted border border-border',
  online:      'bg-online/10 text-online border border-online/20',
  offline:     'bg-surface text-fg-subtle border border-border',
  teal:        'bg-teal/10 text-teal border border-teal/20',
  amber:       'bg-amber/10 text-amber border border-amber/20',
}

export function Badge({ variant = 'participant', children, className }: Readonly<BadgeProps>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
