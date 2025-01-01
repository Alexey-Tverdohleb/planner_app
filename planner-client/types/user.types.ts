import { IBase } from "@/types/base.types";

export interface IUser extends IBase {
  name?: string;
  email: string;
  password?: string;
  workInterval?: number;
  breakInterval?: number;
  intervalCount?: number;
}
