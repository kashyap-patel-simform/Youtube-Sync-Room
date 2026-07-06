export function BroadcastHero() {
  return (
    <div className="relative w-24 h-24">
      <div className="absolute inset-0 rounded-full border border-amber/20 pulse-ring" />
      <div className="absolute inset-0 rounded-full border border-amber/15 pulse-ring-2" />
      <div className="absolute inset-0 rounded-full border border-amber/10 pulse-ring-3" />
      <div className="relative z-10 w-24 h-24 rounded-full bg-amber/10 border border-amber/25 flex items-center justify-center">
        <svg className="w-10 h-10 text-amber ml-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  )
}
