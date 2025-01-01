import { IBase } from "@/types/base.types";

export interface IPomodoroRound extends IBase {
  isCompleted?: boolean;
  totalSeconds: number;
}

export interface IPomodoroSession extends IBase {
  isCompleted?: boolean;
  rounds: IPomodoroRound[];
}

export type TPomodoroRoundState = Partial<
  Omit<IPomodoroRound, "id" | "createdAt" | "updatedAt">
>;

export type TPomodoroSessionState = Partial<
  Omit<IPomodoroSession, "id" | "createdAt" | "updatedAt">
>;
