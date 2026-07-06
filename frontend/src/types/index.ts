import type { Participant } from "./socket";

export type Role = "host" | "participant";

export interface RoomSession {
  code: string;
  name: string;
  userName: string;
  videoUrl: string;
  role: Role;
  participants: Participant[];
}

export interface Feature {
  label: string;
}

export interface HowItWorksStep {
  step: string;
  title: string;
  desc: string;
}

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string;
  error?: string | null;
};
