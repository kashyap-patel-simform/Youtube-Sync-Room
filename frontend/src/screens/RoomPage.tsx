import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { RoomHeader } from "../components/RoomHeader";
import { RoomSidebar } from "../components/RoomSidebar";
import { usePlayerControls } from "../hooks/usePlayerControls";
import { useSocket } from "../hooks/useSocket";
import { useSocketEvent } from "../hooks/useSocketEvent";
import { getClientId } from "../lib/client-id";
import { extractYouTubeId } from "../lib/youtube";
import { useRoomStore } from "../store/useRoomStore";
import type { ApiResponse } from "../types";
import type { Room } from "../types/socket";
import { PlayerControls } from "../ui/PlayerControls";
import { VideoPlayer } from "../ui/VideoPlayer";

import type { YouTubePlayer } from "react-youtube";

export function RoomPage() {
  const { code = "" } = useParams<{ code: string }>();
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();

  const {
    initRoom,
    setParticipants,
    setSynced,
    setHost,
    videoUrl,
    isHost,
    roomName,
    clearRoom,
  } = useRoomStore();

  const [leaving, setLeaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const playerRef = useRef<YouTubePlayer | null>(null);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await videoContainerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Browser denied fullscreen (e.g. permissions policy) — fail silently
    }
  };

  // All hooks must run before any conditional return
  const handleSync = () => {
    setSynced(true);
    toast.info("Synced to host playback.", { duration: 2500 });
    setTimeout(() => setSynced(false), 3000);
  };

  const controls = usePlayerControls({ onSync: handleSync, playerRef });

  useSocketEvent("user_joined", (payload) => {
    setParticipants(payload.participants);
    toast.success(`${payload.userName ?? "Someone"} joined the room.`, {
      duration: 3000,
    });
  });

  useSocketEvent("user_left", (payload) => {
    setParticipants(payload.participants);
    if (payload.isHost) {
      toast.info(`${payload.userName ?? "Someone"} left the room.`, {
        duration: 3000,
      });
    } else {
      toast.info(`Host left the room.`, {
        duration: 3000,
      });
    }
  });

  useSocketEvent("host_changed", (payload) => {
    const currentUserId = getClientId();

    if (currentUserId === payload.hostId) {
      setHost();
      toast.success("You are the host now control the payback");
      return;
    }
    toast.info(`${payload.hostName} is new host`, {
      duration: 3000,
    });
  });

  // Fetch room state on direct navigation (e.g. page reload).
  // AbortController prevents setState on an unmounted component.
  useEffect(() => {
    const controller = new AbortController();

    const fetchRoomData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/room?roomCode=${code}`,
          { method: "GET", signal: controller.signal },
        );

        const data = (await res.json()) as ApiResponse<Room>;
        if (data.success && data.data) {
          initRoom({
            ...data.data,
            userId: getClientId(),
            userName: localStorage.getItem("user_name") ?? "Unknown",
            isHost: data.data.hostId === getClientId(),
          });
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        toast.error("Failed to load room data.");
      }
    };

    if (roomName === "") fetchRoomData();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-join the Socket.io room after a reconnect so broadcasts keep arriving.
  const hasJoinedRef = useRef(false);
  useEffect(() => {
    if (!isConnected) return;
    if (!hasJoinedRef.current) {
      hasJoinedRef.current = true;
      return;
    }
    if (!socket.current || !code) return;
    socket.current.emit(
      "join_room",
      {
        roomCode: code,
        userId: getClientId(),
        userName: localStorage.getItem("user_name") ?? "Unknown",
      },
      () => {},
    );
  }, [isConnected, code, socket]);

  const effectiveVideoUrl = videoUrl;
  const videoId = extractYouTubeId(effectiveVideoUrl) ?? undefined;

  const handleLeave = () => {
    if (leaving) return;

    // If already disconnected, clean up locally and navigate.
    if (!isConnected || !socket.current) {
      clearRoom();
      localStorage.removeItem("user_name");
      navigate("/", { replace: true });
      return;
    }

    setLeaving(true);
    socket.current.emit(
      "leave_room",
      { roomCode: code, userId: getClientId() },
      (res) => {
        setLeaving(false);
        if (res.success) {
          toast.success("You left the room.");
          clearRoom();
          localStorage.removeItem("user_name");
          navigate("/", { replace: true });
        } else {
          toast.error(res.error ?? "Failed to leave room.");
        }
      },
    );
  };

  return (
    <div className="h-screen bg-canvas flex flex-col overflow-hidden">
      <RoomHeader
        onLeave={handleLeave}
        leaving={leaving}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/*
         * Portrait mobile   – flex-col, video is natural aspect-video width-based height,
         *                      main scrolls vertically so controls stay reachable.
         * Landscape mobile  – flex-row: video left (fixed 56% width, aspect-video height),
         *                      controls right (scrollable column).
         * Desktop (sm+)     – flex-col, video flex-1 fills remaining height.
         */}
        <main
          className={[
            "flex-1 flex flex-col min-w-0",
            "gap-3 p-3 overflow-y-auto",
            "sm:flex-col sm:gap-4 sm:p-4 sm:overflow-hidden",
            "max-sm:landscape:flex-row max-sm:landscape:items-start max-sm:landscape:gap-2 max-sm:landscape:p-2 max-sm:landscape:overflow-hidden",
          ].join(" ")}
        >
          <VideoPlayer
            videoId={videoId}
            isHost={isHost}
            containerRef={videoContainerRef}
            onReady={controls.handlePlayerReady}
            onStateChange={controls.handleStateChange}
            className={[
              "w-full aspect-video shrink-0",
              // Mobile landscape: fixed width, let aspect-video set height, centre vertically
              "max-sm:landscape:w-[56%] max-sm:landscape:self-center",
              // Desktop: grow to fill remaining height (aspect-video overridden by flex-grow)
              "sm:w-auto sm:flex-1 sm:min-h-0",
            ].join(" ")}
          />
          <PlayerControls
            isHost={isHost}
            controls={controls}
            onFullscreen={handleFullscreen}
            isFullscreen={isFullscreen}
            className={[
              "shrink-0",
              "max-sm:landscape:flex-1 max-sm:landscape:self-stretch max-sm:landscape:overflow-y-auto",
            ].join(" ")}
          />
        </main>

        <RoomSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
    </div>
  );
}
