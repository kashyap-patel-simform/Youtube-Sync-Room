import { extractYouTubeId } from "../lib/youtube";
import { useRoomStore } from "../store/useRoomStore";
import { cn } from "../lib/cn";
import { ParticipantList } from "../ui/ParticipantList";

interface RoomSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function RoomSidebar({ open = false, onClose }: Readonly<RoomSidebarProps>) {
  const { roomName, videoUrl, isHost } = useRoomStore();

  const videoId = extractYouTubeId(videoUrl) ?? undefined;

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-40 w-72 border-l border-border bg-page flex flex-col overflow-hidden",
          "transition-transform duration-300 ease-in-out",
          "lg:relative lg:inset-auto lg:z-auto lg:w-64 lg:translate-x-0 lg:transition-none lg:shrink-0",
          open ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Room participants and info"
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-border lg:hidden">
          <span className="text-xs font-semibold uppercase tracking-widest text-fg-subtle">
            Room Info
          </span>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="p-1.5 rounded-lg text-fg-subtle hover:text-fg hover:bg-surface-raised transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-4 pt-4 pb-3 border-b border-border">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-fg-subtle mb-2">
            Now watching
          </p>
          {videoId ? (
            <div className="flex items-start gap-2">
              <div className="w-10 h-7 rounded-md bg-surface-raised overflow-hidden shrink-0">
                <img
                  src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-fg-muted line-clamp-2 leading-relaxed">
                {roomName}
              </p>
            </div>
          ) : (
            <p className="text-xs text-fg-subtle italic">No video loaded</p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <ParticipantList />
        </div>

        <div className="px-4 py-3 border-t border-border">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${
              isHost
                ? "bg-amber/10 border border-amber/20 text-amber"
                : "bg-teal/10 border border-teal/20 text-teal"
            }`}
            role="status"
            aria-live="polite"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${isHost ? "bg-amber" : "bg-teal"}`}
              aria-hidden="true"
            />
            <span>
              {isHost
                ? "You are the host — you control playback"
                : "Following host's playback"}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
