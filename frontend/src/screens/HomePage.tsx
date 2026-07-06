import { BroadcastHero } from "../components/BroadcastHero";
import { HowItWorksStrip } from "../components/HowItWorksStrip";
import { RoomEntryCard } from "../components/RoomEntryCard";
import { FEATURES } from "../constants";

export function HomePage() {
  return (
    <div className="min-h-screen bg-page flex flex-col">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 55%, rgba(240,160,32,0.04) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 75% 40%, rgba(45,212,191,0.03) 0%, transparent 60%)",
        }}
      />

      <header className="relative z-10 flex items-center px-4 sm:px-8 py-4 sm:py-5 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber flex items-center justify-center shadow-[0_0_12px_rgba(240,160,32,0.4)]">
            <svg
              className="w-4 h-4 text-canvas ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="font-display font-bold text-fg text-lg tracking-tight">
            SyncRoom
          </span>
        </div>
        <div className="ml-auto">
          <a
            href="#how"
            className="text-sm text-fg-subtle hover:text-fg-muted transition-colors"
          >
            How it works
          </a>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center px-4 sm:px-8 py-8 sm:py-12 gap-8 lg:gap-16 max-w-6xl mx-auto w-full">
        {/* Hero copy — desktop only */}
        <div className="flex-1 hidden lg:flex flex-col gap-10">
          <BroadcastHero />
          <div className="space-y-4">
            <h1 className="font-display text-[3.25rem] font-bold text-fg leading-[1.08] tracking-tight">
              Shared screen.
              <br />
              <span className="text-fg-muted">Shared moment.</span>
            </h1>
            <p className="text-fg-muted text-lg leading-relaxed max-w-sm">
              Watch YouTube together, frame-for-frame. One host runs the
              controls — everyone else follows in sync.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {FEATURES.map((f) => (
              <span
                key={f.label}
                className="px-3 py-1.5 rounded-full bg-surface border border-border text-fg-subtle text-sm"
              >
                {f.label}
              </span>
            ))}
          </div>
        </div>

        {/* Entry card — full width on mobile, fixed width on desktop */}
        <div className="w-full lg:w-100 flex flex-col gap-6">
          {/* Mobile-only headline above the card */}
          <div className="lg:hidden text-center space-y-2">
            <h1 className="font-display text-3xl font-bold text-fg leading-tight tracking-tight">
              Shared screen.{" "}
              <span className="text-fg-muted">Shared moment.</span>
            </h1>
            <p className="text-fg-muted text-sm leading-relaxed">
              Watch YouTube together, in sync.
            </p>
          </div>
          <RoomEntryCard />
        </div>
      </main>

      <HowItWorksStrip />
    </div>
  );
}
