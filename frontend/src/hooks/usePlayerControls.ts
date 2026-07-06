import { useEffect, useState, type RefObject } from "react";
import type { YouTubePlayer } from "react-youtube";
import { DEFAULT_VOLUME, SYNC_FLASH_MS } from "../constants";
import { useRoomStore } from "../store/useRoomStore";
import { useSocket } from "./useSocket";
import { useSocketEvent } from "./useSocketEvent";

interface UsePlayerControlsOptions {
  onSync?: () => void;
  playerRef: RefObject<YouTubePlayer | null>;
}

export function usePlayerControls({
  onSync,
  playerRef,
}: UsePlayerControlsOptions) {
  const { socket, isConnected } = useSocket();

  const {
    code,
    isHost,
    playing,
    setPlaying,
    currentTime,
    setCurrentTime: storeSetCurrentTime,
    duration,
    setDuration,
    volume,
    setVolume,
    muted,
    setMuted,
    speed,
    setSpeed,
  } = useRoomStore();

  // Transient UI-only state — not worth sharing globally
  const [showSpeed, setShowSpeed] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const seekAndEmit = (t: number) => {
    // Only the host drives seek; guard defensively in case called out of context
    if (!isHost) return;
    storeSetCurrentTime(t);
    playerRef.current?.seekTo(t, true);
    if (isConnected) {
      socket.current?.emit("video_seek", { roomCode: code, timestamp: t });
    }
  };

  useSocketEvent("video_seeked", (payload) => {
    if (isHost) return;
    storeSetCurrentTime(payload.timestamp);
    playerRef.current?.seekTo(payload.timestamp, true);
  });

  useSocketEvent("video_played", (payload) => {
    if (isHost) return;
    setPlaying(true);
    playerRef.current?.seekTo(payload.timestamp, true);
    playerRef.current?.playVideo();
  });

  useSocketEvent("video_paused", (payload) => {
    if (isHost) return;
    setPlaying(false);
    playerRef.current?.pauseVideo();
    storeSetCurrentTime(payload.timestamp);
  });

  useSocketEvent("sync_tick", (payload) => {
    if (isHost) return;
    const player = playerRef.current;
    setPlaying(payload.playing);

    if (payload.playing) {
      player?.playVideo();
    } else {
      player?.pauseVideo();
    }

    // Only seek on significant drift to avoid seekTo() triggering a brief
    // state-1 (playing) flash in the YouTube player while the video is paused.
    storeSetCurrentTime(payload.currentTime);

    const drift = Math.abs(
      (player?.getCurrentTime() ?? 0) - payload.currentTime,
    );
    if (drift > 2) {
      player?.seekTo(payload.currentTime, true);
    }
  });

  // Poll current time every 500ms while playing
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      storeSetCurrentTime(playerRef.current?.getCurrentTime() ?? 0);
    }, 500);
    return () => clearInterval(id);
  }, [playing, storeSetCurrentTime]);

  // All deps read inside the interval are listed so stale closures are impossible.
  useEffect(() => {
    const id = setInterval(() => {
      if (isConnected && isHost)
        socket.current?.emit("host_heartbeat", {
          roomCode: code,
          currentTimestamp: playerRef.current?.getCurrentTime() ?? 0,
          playing: playing,
        });
    }, 2000);
    return () => clearInterval(id);
  }, [playing, code, isConnected, isHost, socket]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const effectiveVolume = muted ? 0 : volume;

  const handlePlayerReady = (player: YouTubePlayer) => {
    playerRef.current = player;

    const d = player.getDuration();
    if (d > 0) setDuration(d);
    player.setVolume(DEFAULT_VOLUME);
    player.setPlaybackRate(speed);

    // Always seek to sync late-joining viewers, including when currentTime === 0
    // (e.g. video rewound to start or paused at beginning).
    player.seekTo(currentTime, true);
    if (!playing) {
      player.pauseVideo();
    }
  };

  // YT states: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued
  const handleStateChange = (state: number) => {
    // Participants' playing state is driven by socket events only.
    // YouTube briefly fires state 1 during seeks/buffering even on paused videos,
    // so letting participants update setPlaying here causes false autoplay triggers.
    if (isHost) {
      setPlaying(state === 1);
    }
    if (state === 1 || state === 2) {
      storeSetCurrentTime(playerRef.current?.getCurrentTime() ?? 0);
    }
    if (state === 1 && duration === 0) {
      setDuration(playerRef.current?.getDuration() ?? 0);
    }
  };

  const togglePlay = () => {
    if (playing) {
      playerRef.current?.pauseVideo();
      if (isConnected) {
        socket.current?.emit("video_pause", {
          roomCode: code,
          timestamp: playerRef.current?.getCurrentTime() ?? 0,
        });
      }
    } else {
      playerRef.current?.playVideo();
      if (isConnected) {
        socket.current?.emit("video_play", {
          roomCode: code,
          timestamp: playerRef.current?.getCurrentTime() ?? 0,
        });
      }
    }
  };

  const toggleMute = () => {
    if (muted) {
      playerRef.current?.unMute();
      setMuted(false);
    } else {
      playerRef.current?.mute();
      setMuted(true);
    }
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    setMuted(false);
    playerRef.current?.unMute();
    playerRef.current?.setVolume(v);
  };

  const handleSpeedSelect = (s: number) => {
    setSpeed(s);
    setShowSpeed(false);
    playerRef.current?.setPlaybackRate(s);
  };

  // Emit an immediate heartbeat so all participants snap to the host's current
  // position without waiting for the next 2 s tick.
  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), SYNC_FLASH_MS);
    if (isConnected && isHost) {
      socket.current?.emit("host_heartbeat", {
        roomCode: code,
        currentTimestamp: playerRef.current?.getCurrentTime() ?? 0,
        playing,
      });
    }
    onSync?.();
  };

  return {
    // State
    playing,
    currentTime,
    duration,
    volume,
    muted,
    effectiveVolume,
    speed,
    showSpeed,
    setShowSpeed,
    syncing,
    progress,
    // Controls
    togglePlay,
    toggleMute,
    handleVolumeChange,
    handleSpeedSelect,
    handleSync,
    setCurrentTime: seekAndEmit,
    // YouTube event callbacks
    handlePlayerReady,
    handleStateChange,
  };
}
