# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server on 0.0.0.0:5173
npm run build     # Type-check (tsc -b) then build to /dist
npm run lint      # Run ESLint on all .ts/.tsx files
npm run preview   # Preview production build locally
```

No test runner is configured. TypeScript strict mode (`noUnusedLocals`, `noUnusedParameters`) acts as the primary correctness gate.

## Environment Variables

```
VITE_BASE_URL="http://localhost:3000/api"   # REST API base
VITE_SOCKET_URL="http://localhost:3000"     # Socket.io server
```

## Architecture Overview

**SyncRoom** is a real-time collaborative YouTube viewing app — one host controls playback, participants stay frame-synchronized. No accounts required.

**Stack:** React 19, TypeScript, Vite, Socket.io 4, Zustand 5, Tailwind CSS 4, React Router 7, react-youtube.

**Routes:**
- `/` → `HomePage` — landing with host/join forms
- `/room/:code` → `RoomPage` — collaborative viewing session

**App shell:** `main.tsx` wraps everything in `SocketProvider`, then `App.tsx` sets up the router and `Toaster`.

## Layer Conventions

| Layer | Path | Responsibility |
|---|---|---|
| Screens | `src/screens/` | Full-page layout components; orchestrate data fetching and layout |
| Components | `src/components/` | Feature-level components with business logic |
| UI | `src/ui/` | Dumb primitives (Button, Input, Badge); accept `className`, no business logic |
| Hooks | `src/hooks/` | All socket emit/listen logic and API calls live here |
| Store | `src/store/useRoomStore.ts` | Zustand store — pure state container, no fetching |
| Context | `src/context/SocketContext.tsx` | Socket.io lifecycle; exposes `socket`, `isConnected`, `error` |
| Types | `src/types/` | `index.ts` for app types, `socket.ts` for typed Socket.io event maps |
| Constants | `src/constants/index.ts` | Room config, player defaults, UI copy |

## State Management

**Zustand (`useRoomStore`)** holds all session state (room code, video URL, participants, host flag) and player state (playing, currentTime, volume, speed). Call `initRoom()` on join, `clearRoom()` on leave.

**Socket.io** is accessed via `useSocket()` hook (reads context) and `useSocketEvent<K>(event, callback)` for type-safe listeners — the generic `K` must be a key of `ServerToClientEvents` in `src/types/socket.ts`.

## Sync Mechanism

1. Host emits `play`, `pause`, `seek` — server broadcasts to participants.
2. Host sends `host_heartbeat` every 500ms while playing.
3. Server relays as `sync_tick`; participants drift-correct by seeking to broadcast position.

## Participant Identity

No auth. Identity is derived from:
- `getBrowserId()` → `localStorage` (persists across tabs)
- `getTabId()` → `sessionStorage` (unique per tab)
- `getClientId()` → `${browserId}-${tabId}` (unique per browser tab)

All helpers are in `src/lib/client-id.ts`.

## Key Conventions

- **Styling:** Tailwind CSS 4 with custom design tokens (`fg`, `fg-muted`, `surface`, `surface-raised`, `border`, `bg-page`, `teal`, `amber`, etc.). Use the `cn()` helper from `src/lib/cn.ts` for conditional classes.
- **Icons:** Import SVG React components from `src/ui/icons.tsx`.
- **API calls:** Use native `fetch()` against `VITE_BASE_URL`. No abstraction layer exists.
- **Socket join pattern:** Join room via socket emit with a callback, not REST.
- **Local dev simulation:** Open two browser tabs to simulate host + participant in the same room.
