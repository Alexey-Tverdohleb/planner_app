import { IUser } from "@/types/user.types";

export interface ILoginForm {
  email: string;
  password: string;
}

export interface IRegisterForm {
  email: string;
  name?: string;
  password: string;
  passwordRepeat: string;
}

export interface IAuthResponse {
  accessToken: string;
  user: IUser;
}
