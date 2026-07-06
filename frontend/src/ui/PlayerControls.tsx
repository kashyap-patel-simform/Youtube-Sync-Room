import { cn } from "../lib/cn";
import { formatTime } from "../lib/time";
import { PLAYBACK_SPEEDS } from "../constants";
import type { usePlayerControls } from "../hooks/usePlayerControls";
import { Button } from "./Button";
import {
  IconPlay,
  IconPause,
  IconVolume,
  IconMute,
  IconSync,
  IconFullscreen,
  IconExitFullscreen,
} from "./icons";

type Controls = ReturnType<typeof usePlayerControls>;

interface PlayerControlsProps {
  isHost: boolean;
  controls: Controls;
  className?: string;
  onFullscreen?: () => void;
  isFullscreen?: boolean;
}

function SyncedBanner() {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-teal/10 border border-teal/20 text-teal text-xs sm:text-sm font-medium w-full"
      role="status"
      aria-live="polite"
    >
      <IconSync aria-hidden="true" />
      <span className="sm:hidden">In sync</span>
      <span className="hidden sm:inline">
        Host is controlling playback — you&apos;re in sync
      </span>
    </div>
  );
}

function SpeedMenu({
  speed,
  showSpeed,
  onToggle,
  onSelect,
}: Readonly<{
  speed: number;
  showSpeed: boolean;
  onToggle: () => void;
  onSelect: (s: number) => void;
}>) {
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="font-mono text-xs px-2.5"
      >
        {speed}×
      </Button>
      {showSpeed && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-surface-raised border border-border rounded-xl overflow-hidden shadow-2xl z-20 min-w-16">
          {PLAYBACK_SPEEDS.map((s) => (
            <Button
              key={s}
              variant="ghost"
              size="sm"
              onClick={() => onSelect(s)}
              className={cn(
                "w-full justify-center font-mono rounded-none",
                s === speed ? "text-amber" : "text-fg-muted",
              )}
            >
              {s}×
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

function Timeline({
  currentTime,
  duration,
  progress,
  onChange,
  isHost,
}: Readonly<{
  currentTime: number;
  duration: number;
  progress: number;
  onChange: (t: number) => void;
  isHost: boolean;
}>) {
  return (
    <div className="space-y-1.5">
      <div className="relative h-2 sm:h-1.5 bg-surface-raised rounded-full cursor-pointer">
        <div
          className="absolute inset-y-0 left-0 bg-amber rounded-full"
          style={{ width: `${progress}%` }}
          aria-hidden="true"
        />
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 opacity-0 cursor-pointer focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-amber/50 focus-visible:rounded-full"
          disabled={!isHost}
          aria-label="Seek video position"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
        />
      </div>
      <div className="flex justify-between text-xs font-mono text-fg-subtle">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}

function VolumeControl({
  muted,
  effectiveVolume,
  onToggleMute,
  onVolumeChange,
}: Readonly<{
  muted: boolean;
  effectiveVolume: number;
  onToggleMute: () => void;
  onVolumeChange: (v: number) => void;
}>) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleMute}
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? (
          <IconMute aria-hidden="true" />
        ) : (
          <IconVolume aria-hidden="true" />
        )}
      </Button>
      <div className="relative w-14 sm:w-20 h-2 sm:h-1.5 bg-surface-raised rounded-full">
        <div
          className="absolute inset-y-0 left-0 bg-fg-muted rounded-full"
          style={{ width: `${effectiveVolume}%` }}
          aria-hidden="true"
        />
        <input
          type="range"
          min={0}
          max={100}
          value={effectiveVolume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label="Volume"
          aria-valuenow={effectiveVolume}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

export function PlayerControls({
  isHost,
  controls,
  className,
  onFullscreen,
  isFullscreen = false,
}: Readonly<PlayerControlsProps>) {
  return (
    <div
      className={cn(
        "space-y-2.5 sm:space-y-3 px-3 sm:px-5 py-3 sm:py-4 bg-surface rounded-2xl border border-border",
        "max-sm:landscape:space-y-2 max-sm:landscape:py-2",
        className,
      )}
    >
      <Timeline
        currentTime={controls.currentTime}
        duration={controls.duration}
        progress={controls.progress}
        onChange={controls.setCurrentTime}
        isHost={isHost}
      />

      <div className="flex items-center gap-2 sm:gap-3">
        {!isHost && <SyncedBanner />}

        {isHost && (
          <Button
            variant="primary"
            size="circle"
            onClick={controls.togglePlay}
            aria-label={controls.playing ? "Pause" : "Play"}
            className="shadow-[0_0_16px_rgba(240,160,32,0.35)] shrink-0"
          >
            {controls.playing ? (
              <IconPause aria-hidden="true" />
            ) : (
              <IconPlay aria-hidden="true" />
            )}
          </Button>
        )}

        <VolumeControl
          muted={controls.muted}
          effectiveVolume={controls.effectiveVolume}
          onToggleMute={controls.toggleMute}
          onVolumeChange={controls.handleVolumeChange}
        />

        {isHost && (
          <>
            <div className="flex-1" />

            <SpeedMenu
              speed={controls.speed}
              showSpeed={controls.showSpeed}
              onToggle={() => controls.setShowSpeed((s) => !s)}
              onSelect={controls.handleSpeedSelect}
            />

            <Button
              variant="teal"
              size="sm"
              icon={<IconSync aria-hidden="true" />}
              onClick={controls.handleSync}
              className={cn(
                "shrink-0 whitespace-nowrap",
                controls.syncing && "scale-95",
              )}
            >
              {controls.syncing ? "Syncing…" : "Sync All"}
            </Button>
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          onClick={onFullscreen}
        >
          {isFullscreen ? (
            <IconExitFullscreen aria-hidden="true" />
          ) : (
            <IconFullscreen aria-hidden="true" />
          )}
        </Button>
      </div>
    </div>
  );
}
