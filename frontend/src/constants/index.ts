import type { Feature, HowItWorksStep } from "../types";

// Room
export const ROOM_CODE_LENGTH = 6;
export const DEFAULT_ROOM_NAME = "Study Session";
export const ROOM_TRANSITION_MS = 600;

// Player
export const DEMO_DURATION = 1383; // 23:03
export const SYNC_FLASH_MS = 800;
export const DEFAULT_VOLUME = 80;
export const DEFAULT_SPEED = 1;
export const PLAYBACK_SPEEDS: number[] = [0.5, 0.75, 1, 1.25, 1.5, 2];

// Avatar gradient pairs [from, to]
export const AVATAR_GRADIENTS: [string, string][] = [
  ["#6366f1", "#8b5cf6"],
  ["#ec4899", "#f43f5e"],
  ["#14b8a6", "#06b6d4"],
  ["#f0a020", "#ef4444"],
  ["#22c55e", "#10b981"],
  ["#8b5cf6", "#6366f1"],
  ["#f59e0b", "#ea580c"],
  ["#2dd4bf", "#22c55e"],
];

// Home page copy
export const FEATURES: Feature[] = [
  { label: "YouTube, synced to the frame" },
  { label: "Host controls — participants follow" },
  { label: "Up to 50 in one room" },
  { label: "No account required" },
];

export const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    step: "01",
    title: "Host pastes a link",
    desc: "Drop any YouTube URL — the room opens instantly.",
  },
  {
    step: "02",
    title: "Share the room code",
    desc: "Send the 6-character code to whoever you want in the room.",
  },
  {
    step: "03",
    title: "Play — everyone follows",
    desc: "Hit play and every participant jumps to the same frame.",
  },
];
