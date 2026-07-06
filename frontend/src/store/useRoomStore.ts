import { create } from "zustand";
import { DEFAULT_SPEED, DEFAULT_VOLUME } from "../constants";
import type { Participant, Room } from "../types/socket";
import { devtools } from "zustand/middleware";

interface RoomStore {
  // Session
  code: string;
  roomName: string;
  videoUrl: string;
  userName: string;
  isHost: boolean;
  participants: Participant[];
  synced: boolean;

  // Player
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  speed: number;

  // Session actions
  initRoom: (
    session: Room & { userId: string; userName: string; isHost: boolean },
  ) => void;
  setRoomName: (roomName: string) => void;
  setHost: () => void;
  setParticipants: (participants: Participant[]) => void;
  setSynced: (synced: boolean) => void;
  clearRoom: () => void;

  // Player actions
  setPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setSpeed: (speed: number) => void;
}

const initialState = {
  code: "",
  roomName: "",
  videoUrl: "",
  userName: "",
  isHost: false,
  participants: [] as Participant[],
  synced: false,
  playing: false,
  currentTime: 0,
  duration: 0,
  volume: DEFAULT_VOLUME,
  muted: false,
  speed: DEFAULT_SPEED,
};

export const useRoomStore = create<RoomStore>()(
  devtools((set) => ({
    ...initialState,

    // Session actions
    initRoom: (session) =>
      set({
        code: session.roomCode,
        roomName: session.roomName,
        videoUrl: session.videoUrl ?? "",
        userName: session.userName,
        isHost: session.isHost,
        participants: session.participants ?? [],
        playing: session.state.playing,
        currentTime: session.state.currentTime,
        speed: session.state.playbackRate,
      }),
    setHost: () => set({ isHost: true }),
    setRoomName: (roomName) => set({ roomName }),
    setParticipants: (participants) => set({ participants }),
    setSynced: (synced) => set({ synced }),
    clearRoom: () => set(initialState),

    // Player actions
    setPlaying: (playing) => set({ playing }),
    setCurrentTime: (currentTime) => set({ currentTime }),
    setDuration: (duration) => set({ duration }),
    setVolume: (volume) => set({ volume }),
    setMuted: (muted) => set({ muted }),
    setSpeed: (speed) => set({ speed }),
  })),
);
