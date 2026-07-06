import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              gap: "1rem",
              fontFamily: "system-ui, sans-serif",
              color: "#dde7f0",
              background: "#0c1018",
            }}
          >
            <p style={{ fontSize: "1rem", color: "#6b7a99" }}>
              Something went wrong.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: ".5rem 1.25rem",
                borderRadius: "8px",
                background: "#1c2333",
                border: "1px solid #252f45",
                color: "#dde7f0",
                cursor: "pointer",
                fontSize: ".875rem",
              }}
            >
              Reload
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
