import { IBase } from "@/types/base.types";

export interface ITimeBlock extends IBase {
  name: string;
  color?: string;
  duration: number;
  order: number;
}

export type TTimeBlockFormState = Partial<
  Omit<ITimeBlock, "createdAt" | "updatedAt">
>;
