export interface Room {
  id: string;
  roomCode: string;
  roomName: string;
  videoId: string;
  videoUrl?: string | null;
  hostId: string;
  hostName: string;
  createdAt: Date;
  expiresAt: Date;
  state: RoomState;
  participants: Participant[];
}
export interface RoomState {
  id: string;
  roomId: string;
  currentTime: number;
  playing: boolean;
  playbackRate: number;
  hostId: string;
  updatedAt: Date;
}
export interface Participant {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  socketId: string;
  joinedAt: Date;
  isHost: boolean;
  expiresAt: Date;
}

export interface ServerToClientEvents {
  user_joined: (payload: {
    userId: string;
    userName: string;
    participants: Participant[];
  }) => void;

  user_left: (payload: {
    userId: string;
    userName: string;
    participants: Participant[];
    isHost?: boolean;
  }) => void;

  video_played: (data: { roomCode: string; timestamp: number }) => void;
  video_paused: (data: { roomCode: string; timestamp: number }) => void;
  video_seeked: (data: { roomCode: string; timestamp: number }) => void;

  sync_tick: (payload: { currentTime: number; playing: boolean }) => void;

  host_changed: (payload: { hostId: string; hostName: string }) => void;
}

export interface ClientToServerEvents {
  join_room: (
    data: {
      roomCode: string;
      userId: string;
      userName: string;
    },
    callback: (res: { success: boolean; data: Room }) => void,
  ) => void;

  leave_room: (
    data: { roomCode: string; userId: string },
    callback: (res: {
      success: boolean;
      error?: string;
      message?: string;
    }) => void,
  ) => void;

  video_play: (data: { roomCode: string; timestamp: number }) => void;
  video_pause: (data: { roomCode: string; timestamp: number }) => void;
  video_seek: (data: { roomCode: string; timestamp: number }) => void;

  host_heartbeat: (data: {
    roomCode: string;
    currentTimestamp: number;
    playing: boolean;
  }) => void;
}
