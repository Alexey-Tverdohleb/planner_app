import { IBase } from "@/types/base.types";

export enum TaskPriority {
  low = "low",
  medium = "medium",
  high = "high",
}

export interface ITask extends IBase {
  name: string;
  priority: TaskPriority;
  isCompleted: boolean;
}

export type TTaskFormState = Partial<Omit<ITask, "id" | "updatedAt">>;
