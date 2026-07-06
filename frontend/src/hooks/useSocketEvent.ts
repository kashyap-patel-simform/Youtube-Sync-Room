import { useEffect, useRef } from "react";
import { useSocket } from "./useSocket";
import type { ServerToClientEvents } from "../types/socket";

// Leverages Generics so your callbacks match event requirements flawlessly
export function useSocketEvent<K extends keyof ServerToClientEvents>(
  event: K,
  callback: ServerToClientEvents[K],
): void {
  const { socket, isConnected } = useSocket();
  const savedCallback = useRef<ServerToClientEvents[K]>(callback);

  // Maintain references to newest state variables inside components without re-binding listeners
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const instance = socket.current;
    if (!instance) return;

    const listener = ((...args: Parameters<ServerToClientEvents[K]>) => {
      // @ts-expect-error - dynamic argument tuple processing safe due to wrapper mapping
      savedCallback.current(...args);
    }) as any;

    instance.on(event, listener);

    return () => {
      instance.off(event, listener);
    };
  }, [event, socket, isConnected]);
}
