import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SocketProvider } from "./context/SocketContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider gateWayUrl={import.meta.env.VITE_SOCKET_URL}>
      <App />
    </SocketProvider>
  </StrictMode>,
);
