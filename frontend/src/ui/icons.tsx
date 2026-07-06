import { cn } from '../lib/cn'

interface IconProps {
  className?: string
}

export function IconPlay({ className }: IconProps) {
  return (
    <svg className={cn('w-5 h-5 ml-0.5', className)} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

export function IconPause({ className }: IconProps) {
  return (
    <svg className={cn('w-5 h-5', className)} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  )
}

export function IconVolume({ className }: IconProps) {
  return (
    <svg className={cn('w-4 h-4', className)} fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  )
}

export function IconMute({ className }: IconProps) {
  return (
    <svg className={cn('w-4 h-4', className)} fill="currentColor" viewBox="0 0 24 24">
      <path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A7.93 7.93 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    </svg>
  )
}

export function IconSync({ className }: IconProps) {
  return (
    <svg className={cn('w-3.5 h-3.5', className)} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
    </svg>
  )
}

export function IconFullscreen({ className }: IconProps) {
  return (
    <svg className={cn('w-4 h-4', className)} fill="currentColor" viewBox="0 0 24 24">
      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
    </svg>
  )
}

export function IconExitFullscreen({ className }: IconProps) {
  return (
    <svg className={cn('w-4 h-4', className)} fill="currentColor" viewBox="0 0 24 24">
      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
    </svg>
  )
}

export function IconLink({ className }: IconProps) {
  return (
    <svg className={cn('w-4 h-4', className)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  )
}

export function IconUsers({ className }: IconProps) {
  return (
    <svg className={cn('w-4 h-4', className)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  )
}

export function IconLogOut({ className }: IconProps) {
  return (
    <svg className={cn('w-4 h-4', className)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

export function IconSignal({ className }: IconProps) {
  return (
    <svg className={cn('w-3.5 h-3.5', className)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M1.5 8.5a13 13 0 0121 0M5 12a10 10 0 0114 0M8.5 15.5a6 6 0 017 0M12 19h.01" />
    </svg>
  )
}

export function IconUser({ className }: IconProps) {
  return (
    <svg className={cn('w-4 h-4', className)} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  )
}

export function IconArrowRight({ className }: IconProps) {
  return (
    <svg className={cn('w-4 h-4', className)} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export function IconCopy({ className }: IconProps) {
  return (
    <svg className={cn('w-3.5 h-3.5', className)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  )
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg className={cn('w-3.5 h-3.5', className)} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="20 6 9 12 4 9" />
    </svg>
  )
}
