import { useContext } from "react";
import {
  SocketContext,
  type SocketContextProps,
} from "../context/SocketContext";

// Custom layout hook to safely fetch our global socket state context instance
export const useSocket = (): SocketContextProps => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error(
      "useSocketInstance must be wrapped inside a <SocketProvider />",
    );
  }
  return context;
};
