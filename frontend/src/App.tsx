import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { HomePage } from "./screens/HomePage";
import { RoomPage } from "./screens/RoomPage";

function App() {
  return (
    <ErrorBoundary>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/room/:code" element={<RoomPage />} />
      </Routes>
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "#192535",
            border: "1px solid #1e2e40",
            color: "#dde7f0",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: "0.875rem",
          },
          classNames: {
            success: "toast-success",
            error: "toast-error",
            info: "toast-info",
          },
        }}
      />
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
