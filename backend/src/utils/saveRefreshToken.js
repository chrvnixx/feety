import { redis } from "../config/upstash.js";

export async function saveRefreshToken(userId, refereshToken) {
  await redis.set(
    `refresh_token:${userId}`,
    refereshToken,
    "EX",
    7 * 24 * 60 * 60,
  );
}

export function setCookies(res, accessToken, refreshToken) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}


