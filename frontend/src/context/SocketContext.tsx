import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../types/socket";
import { toast } from "sonner";

interface SocketContextProps {
  socket: React.RefObject<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>;
  isConnected: boolean;
  error: string | null;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

const SocketProvider: React.FC<{
  children: ReactNode;
  gateWayUrl: string;
}> = ({ children, gateWayUrl }) => {
  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socketInstance: Socket<ServerToClientEvents, ClientToServerEvents> =
      io(gateWayUrl, {
        autoConnect: false,
        transports: ["websocket", "polling"],
      });

    socketRef.current = socketInstance;

    // Track whether this is the very first connection so we don't spam the
    // user with a toast on every reconnect after a network blip.
    let connected = false;

    socketInstance.on("connect", () => {
      if (connected) {
        toast.info("Reconnected.", { duration: 2000 });
      }
      connected = true;
      setIsConnected(true);
      setError(null);
    });

    socketInstance.on("disconnect", (reason) => {
      setIsConnected(false);
      if (reason === "io server disconnect") {
        socketInstance.connect();
      }
    });
    socketInstance.on("connect_error", (err) => {
      toast.error("Socket Connection error");
      setError(err.message);
      setIsConnected(false);
    });

    socketInstance.connect();

    return () => {
      socketInstance.removeAllListeners();
      socketInstance.disconnect();
      socketRef.current = null;
    };
  }, [gateWayUrl]);

  const value = useMemo(
    () => ({
      socket: socketRef,
      isConnected,
      error,
    }),
    [isConnected, error],
  );
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext, type SocketContextProps };
