# SyncRoom — Frontend

Real-time collaborative YouTube viewing. One person hosts, everyone else stays in sync.

## Tech stack

- **React 19** + **TypeScript 6** — UI and type safety
- **Vite 8** — dev server and bundler
- **Socket.io 4** — real-time bidirectional events
- **Zustand 5** — global state (room session + player)
- **Tailwind CSS 4** — utility-first styling with custom design tokens
- **React Router 7** — client-side routing
- **react-youtube** — YouTube iFrame API wrapper

## Getting started

```bash
npm install
npm run dev
```

## Environment variables

Create a `.env` file in the project root:

```env
VITE_BASE_URL=""
VITE_SOCKET_URL=""
```

## Scripts

| Command           | Description                               |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start Vite dev server with HMR            |
| `npm run build`   | Type-check + production bundle to `/dist` |
| `npm run preview` | Preview the production build locally      |
| `npm run lint`    | Run ESLint across all `.ts`/`.tsx` files  |

## Project structure

```
src/
├── screens/          # Full-page components (HomePage, RoomPage)
├── components/       # Feature-level components (forms, header, sidebar)
├── ui/               # Reusable primitives (Button, Input, PlayerControls…)
├── store/            # Zustand store — room session + player state
├── context/          # SocketContext — connection lifecycle
├── hooks/            # Custom hooks (usePlayerControls, useSocketEvent…)
├── lib/              # Pure utilities (cn, youtube, time, browserId, room)
└── types/            # TypeScript types and typed socket event maps
```

## How sync works

The **host** controls playback. Every action (play, pause, seek) emits a socket event to the server, which broadcasts it to all participants. Participants' player state is driven entirely by these broadcasts.

A `host_heartbeat` fires every 500 ms while playing. The server relays this as a `sync_tick` — participants use it to drift-correct their position. The "Sync All" button in the room UI forces an immediate correction.

Participant identity is based on a browser-stable ID (localStorage) + tab ID (sessionStorage) — no accounts required.

## Routes

| Route         | Screen                                |
| ------------- | ------------------------------------- |
| `/`           | Home — create or join a room          |
| `/room/:code` | Room — collaborative playback session |

## Local development tip

Open the app in two browser tabs to simulate host + participant. Tab 1 creates the room (host), tab 2 joins with the room code (participant). Each tab gets a unique `tabId`, so the identity system treats them as separate users.
