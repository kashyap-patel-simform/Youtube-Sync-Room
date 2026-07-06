import { useRoomStore } from "../store/useRoomStore";
import { RoomCode } from "../ui/RoomCode";
import { Button } from "../ui/Button";
import { IconLogOut, IconSignal, IconUsers } from "../ui/icons";

function SyncedIndicator() {
  return (
    <div
      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal/10 border border-teal/20 text-teal text-xs font-medium animate-pulse"
      role="status"
      aria-live="polite"
    >
      <IconSignal aria-hidden="true" />
      <span>All synced</span>
    </div>
  );
}

interface RoomHeaderProps {
  onLeave: () => void;
  leaving?: boolean;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export function RoomHeader({
  onLeave,
  leaving = false,
  sidebarOpen = false,
  onToggleSidebar,
}: Readonly<RoomHeaderProps>) {
  const { code, roomName, synced } = useRoomStore();

  return (
    <header className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3 border-b border-border bg-canvas shrink-0">
      {/* Logo — hidden on mobile to free up space for room name */}
      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-amber flex items-center justify-center shadow-[0_0_10px_rgba(240,160,32,0.35)]">
          <svg
            className="w-3.5 h-3.5 text-canvas ml-0.5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span className="font-display font-bold text-fg text-sm tracking-tight">
          SyncRoom
        </span>
      </div>

      {/* Divider — desktop only */}
      <div className="hidden sm:block w-px h-5 bg-border shrink-0" aria-hidden="true" />

      {/* Room name — takes all spare space */}
      <div className="flex-1 min-w-0">
        <h1 className="font-display font-semibold text-fg text-sm truncate">
          {roomName}
        </h1>
      </div>

      {synced && <SyncedIndicator />}

      <RoomCode code={code} />

      {/* Participants toggle — below lg only */}
      {onToggleSidebar && (
        <button
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? "Close participants panel" : "Open participants panel"}
          aria-expanded={sidebarOpen}
          aria-controls="room-sidebar"
          className="lg:hidden p-1.5 sm:p-2 rounded-lg text-fg-subtle hover:text-fg hover:bg-surface-raised transition-colors shrink-0"
        >
          <IconUsers className="w-4 h-4" aria-hidden="true" />
        </button>
      )}

      <Button
        variant="ghost"
        size="sm"
        icon={<IconLogOut aria-hidden="true" />}
        onClick={onLeave}
        disabled={leaving}
        aria-label="Leave room"
        className="text-fg-subtle hover:text-danger shrink-0"
      >
        <span className="hidden sm:block">Leave</span>
      </Button>
    </header>
  );
}
