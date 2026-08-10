import { NextResponse } from "next/server";
import { callApi } from "@/lib/server/api";
import { clearAuthCookies, getRefreshToken } from "@/lib/server/cookies";

export async function POST() {
  const refreshToken = await getRefreshToken();

  if (refreshToken) {
    await callApi("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => undefined);
  }

  await clearAuthCookies();

  return NextResponse.json({ ok: true });
}
