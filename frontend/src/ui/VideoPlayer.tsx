import type { RefObject } from "react";
import YouTube, { type YouTubePlayer } from "react-youtube";
import { cn } from "../lib/cn";
import { IconPlay } from "./icons";

interface VideoPlayerProps {
  videoId?: string;
  isHost?: boolean;
  className?: string;
  containerRef?: RefObject<HTMLDivElement | null>;
  onReady?: (player: YouTubePlayer) => void;
  onStateChange?: (state: number) => void;
}

function EmptyState() {
  return (
    <div className="relative z-10 text-center space-y-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-surface-raised border border-border flex items-center justify-center">
        <IconPlay className="w-7 h-7 text-fg-subtle" />
      </div>
      <p className="text-fg-subtle text-sm">Waiting for host to load a video</p>
    </div>
  );
}

function RoleBadge({ isHost }: { isHost: boolean }) {
  return isHost ? (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber/20 border border-amber/30 text-amber text-xs font-semibold backdrop-blur-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
      <span>HOST</span>
    </span>
  ) : (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal/15 border border-teal/25 text-teal text-xs font-semibold backdrop-blur-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
      <span>SYNCED</span>
    </span>
  );
}

// Defined at module scope so react-youtube receives a stable object reference
// and doesn't re-initialise the player on every parent render.
const YOUTUBE_OPTS = {
  height: "100%",
  width: "100%",
  playerVars: {
    controls: 0 as const,       // hide YouTube's native control bar
    modestbranding: 1 as const, // minimal branding
    rel: 0 as const,            // no related videos from other channels
    showinfo: 0 as const,       // hide title/uploader in older embeds
    iv_load_policy: 3 as const, // hide annotations
    disablekb: 1 as const,      // disable YouTube keyboard shortcuts
    fs: 0 as const,             // hide fullscreen button
  },
};

export function VideoPlayer({
  videoId,
  isHost = false,
  className,
  containerRef,
  onReady,
  onStateChange,
}: Readonly<VideoPlayerProps>) {
  if (!videoId) {
    return (
      <div
        ref={containerRef}
        className={cn(
          "relative aspect-video bg-surface rounded-2xl overflow-hidden flex items-center justify-center border border-border scanlines",
          className,
        )}
      >
        <EmptyState />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-video bg-black rounded-2xl overflow-hidden",
        className,
      )}
    >
      <YouTube
        videoId={videoId}
        opts={YOUTUBE_OPTS}
        onReady={(e) => onReady?.(e.target)}
        onStateChange={(e) => onStateChange?.(e.data)}
        className="absolute inset-0 w-full h-full"
        iframeClassName="w-full h-full"
        title="Collaborative video player"
      />

      {/*
       * Cover the entire iframe for all users.
       * This hides YouTube's built-in pause/end overlays (share, watch-later,
       * "More videos", branding) which we cannot remove via player params.
       * Playback is controlled exclusively through the YouTube IFrame API
       * (player.playVideo / pauseVideo / seekTo), so blocking pointer events
       * on the iframe itself has no effect on our custom controls.
       */}
      <div
        className={cn("absolute inset-0", !isHost && "cursor-not-allowed")}
        aria-hidden="true"
        title={!isHost ? "Host controls playback for everyone" : undefined}
      />

      <div className="absolute top-3 right-3">
        <RoleBadge isHost={isHost} />
      </div>
    </div>
  );
}
