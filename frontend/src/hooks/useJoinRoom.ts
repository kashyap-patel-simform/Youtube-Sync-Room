import { useState } from "react";
import { toast } from "sonner";
import { ROOM_CODE_LENGTH } from "../constants";
import { getClientId } from "../lib/client-id";
import { useSocket } from "./useSocket";
import { useRoomStore } from "../store/useRoomStore";
import { useNavigate } from "react-router-dom";

export function useJoinRoom() {
  const { socket, isConnected } = useSocket();

  const navigate = useNavigate();

  const { initRoom } = useRoomStore();

  const [joinCode, setJoinCode] = useState("");
  const [userName, setUserName] = useState("");
  const [joining, setJoining] = useState(false);

  const canJoin =
    joinCode.trim().length === ROOM_CODE_LENGTH && userName.trim().length > 0;

  const handleJoin = () => {
    if (!canJoin) return;

    if (!isConnected || !socket.current) {
      toast.error("Not connected to server. Please refresh and try again.");
      return;
    }

    setJoining(true);

    // Guard against server callback never firing (network drop, server crash).
    const timeoutId = setTimeout(() => {
      setJoining(false);
      toast.error("Request timed out. Please try again.");
    }, 10_000);

    socket.current.emit(
      "join_room",
      {
        roomCode: joinCode,
        userId: getClientId(),
        userName: userName,
      },
      (res) => {
        clearTimeout(timeoutId);
        if (!res.success) {
          toast.error("Failed to join room. Check the room code.");
          setJoining(false);
          return;
        }
        localStorage.setItem("user_name", userName);
        initRoom({
          ...res.data,
          userId: getClientId(),
          userName: userName,
          isHost: res.data.hostId === getClientId(),
        });
        toast.success(`Joined room successfully!`);
        navigate(`/room/${joinCode}`);
      },
    );
  };

  return {
    joinCode,
    setJoinCode,
    userName,
    setUserName,
    joining,
    canJoin,
    handleJoin,
  };
}
