import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '../lib/cn'
import { IconCopy, IconCheck } from './icons'

interface RoomCodeProps {
  code: string
  className?: string
}

export function RoomCode({ code, className }: Readonly<RoomCodeProps>) {
  const [copied, setCopied] = useState(false)

  // Clean up the reset timer if the component unmounts before it fires.
  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(id)
  }, [copied])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
    } catch {
      toast.error('Failed to copy room code.')
    }
  }

  return (
    <button
      onClick={handleCopy}
      title="Click to copy room code"
      aria-label={`Room code ${code}. Click to copy.`}
      className={cn(
        'group flex items-center gap-2 px-2.5 py-1.5 sm:gap-2.5 sm:px-3 sm:py-2 rounded-xl border transition-all duration-150 cursor-pointer',
        'bg-surface border-border hover:border-border-bright hover:bg-surface-raised',
        className,
      )}
    >
      {/* "Room" label — desktop only */}
      <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-widest text-fg-subtle">Room</span>
      <span className="font-mono font-bold text-xs sm:text-sm text-fg tracking-[0.15em] sm:tracking-[0.18em]">{code}</span>
      <span className={cn('transition-colors', copied ? 'text-teal' : 'text-fg-subtle group-hover:text-fg-muted')} aria-hidden="true">
        {copied ? <IconCheck /> : <IconCopy />}
      </span>
    </button>
  )
}
