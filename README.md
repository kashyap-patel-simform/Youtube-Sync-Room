# YouTube Sync Room

Real-time collaborative YouTube viewing — one person hosts, everyone else stays perfectly in sync over WebSockets. No accounts required.

🔗 **Live app:** https://sync-room-frontend.vercel.app/

## Features

- **Create & join rooms** — host creates a room, others join with a short room code.
- **Real-time playback sync** — host's play, pause, and seek actions are broadcast to everyone instantly over WebSockets.
- **Drift correction** — periodic heartbeats keep late joiners and drifted clients aligned; "Sync All" forces an immediate correction.
- **Automatic host handoff** — if the host leaves, the oldest remaining participant is promoted automatically.
- **No accounts** — identity is derived from a browser-stable ID, no login required.
- **Any YouTube video** — paste a standard YouTube URL; the video ID is extracted server-side.

## System design concepts

Concepts actually used in this project and how they're achieved:

| Concept | How it's achieved here |
| --- | --- |
| **Real-time pub/sub** | Socket.IO rooms — the host emits an event, the server broadcasts it to every socket joined to that room code. |
| **Single source of truth** | One `RoomState` (`currentTime`, `playing`, `playbackRate`) per room drives every client; participants render from broadcasts, never their own guesses. |
| **Host-authoritative model** | Only the host's play/pause/seek/heartbeat mutate state; everyone else is a follower. Simplifies conflict handling to one writer. |
| **Leader election / failover** | On host disconnect, the oldest remaining participant is auto-promoted and a `host_changed` event is broadcast — no manual reassignment. |
| **Write coalescing (debounce)** | Rapid seek/play/pause updates hit an in-memory cache first and persist to MongoDB on a 400ms debounce, so bursts don't hammer the DB. |
| **Cache-aside reads** | Playback state is read from the in-memory `Map` for speed and only falls back to / syncs with the database as needed. |
| **Drift correction** | The host sends periodic heartbeats; the server relays `sync_tick` with the current position so late joiners and drifted clients re-seek to the correct spot. |
| **Collision-safe IDs** | Short room codes are generated with `nanoid` and retried (up to 5x) on a unique-constraint collision. |
| **TTL / expiry** | Rooms carry a 24h expiry and empty rooms are deleted from cache + DB, keeping state bounded. |

## Packages

| Package | Description | README |
| --- | --- | --- |
| [`frontend/`](./frontend) | React 19 + Vite client | [frontend/README.md](./frontend/README.md) |
| [`backend/`](./backend) | Node + Express + Socket.IO server | [backend/README.md](./backend/README.md) |

See each package's README for setup, environment variables, and API details.
