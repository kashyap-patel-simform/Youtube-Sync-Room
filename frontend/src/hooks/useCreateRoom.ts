import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getClientId } from "../lib/client-id";
import { extractYouTubeId } from "../lib/youtube";
import { useRoomStore } from "../store/useRoomStore";
import type { ApiResponse } from "../types";
import type { Room } from "../types/socket";
import { useSocket } from "./useSocket";

export function useCreateRoom() {
  const { socket, isConnected } = useSocket();

  const navigate = useNavigate();
  const { initRoom } = useRoomStore();

  const [videoUrl, setVideoUrl] = useState("");
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");
  const [urlError, setUrlError] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [creating, setCreating] = useState(false);

  const handleVideoUrlChange = (url: string) => {
    setVideoUrl(url);
    if (urlError) setUrlError("");
  };

  const handleUserNameChange = (name: string) => {
    setUserName(name);
    if (userNameError) setUserNameError("");
  };

  const handleCreate = async () => {
    let hasError = false;

    if (!userName.trim()) {
      setUserNameError("Enter your name to continue.");
      hasError = true;
    }

    if (!videoUrl.trim()) {
      setUrlError("Paste a YouTube link to continue.");
      hasError = true;
    } else if (!extractYouTubeId(videoUrl)) {
      setUrlError("That doesn't look like a valid YouTube URL.");
      hasError = true;
    }

    if (hasError) return;

    if (!isConnected || !socket.current) {
      toast.error("Not connected to server. Please refresh and try again.");
      return;
    }

    setCreating(true);
    try {
      const browserId = getClientId();
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hostname: userName,
          hostId: browserId,
          roomName: roomName,
          videoUrl,
          socketId: socket.current.id,
        }),
      });

      const data = (await response.json()) as ApiResponse<Room>;

      if (!data.data) {
        toast.error(data.message ?? "Failed to create room. Please try again.");
        setCreating(false);
        return;
      }

      initRoom({
        ...data.data,
        userName,
        userId: getClientId(),
        isHost: true,
      });

      localStorage.setItem("user_name", userName);

      // Host was created via HTTP, so their socket is not yet in the
      // Socket.io room. Emit join_room so socket.join(roomCode) runs
      // on the server — required to receive USER_JOINED broadcasts.
      const joinTimeoutId = setTimeout(() => {
        setCreating(false);
        toast.error("Request timed out. Please try again.");
      }, 10_000);

      socket.current?.emit(
        "join_room",
        {
          roomCode: data.data.roomCode,
          userId: browserId,
          userName,
        },
        () => {
          clearTimeout(joinTimeoutId);
          toast.success(`Room created! Code: ${data.data!.roomCode}`);
          setCreating(false);
          navigate(`/room/${data.data!.roomCode}`);
        },
      );
    } catch {
      toast.error("Something went wrong. Please check your connection.");
      setCreating(false);
    }
  };

  return {
    videoUrl,
    roomName,
    userName,
    urlError,
    userNameError,
    creating,
    handleVideoUrlChange,
    handleUserNameChange,
    setRoomName,
    handleCreate,
  };
}
