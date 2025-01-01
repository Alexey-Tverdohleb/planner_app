import Cookies from "js-cookie";

export enum EnumTokens {
  ACCESS_TOKEN = "ACCESS_TOKEN",
  FETCH_TOKEN = "FETCH_TOKEN",
}

export const getAccessToken = () => {
  return Cookies.get(EnumTokens.ACCESS_TOKEN) || null;
};

export const saveAccessToken = (accessToken: string) => {
  return Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
    domain: "localhost",
    sameSite: "strict",
    expires: 1,
  });
};
