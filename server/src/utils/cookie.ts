import { Response } from "express";
import { refreshTokenCookieOptions } from "../configs/cookie.config";

export const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie("refreshToken", token, refreshTokenCookieOptions);
};

export const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie("refreshToken", {
    ...refreshTokenCookieOptions,
    maxAge: undefined,
  });
};
