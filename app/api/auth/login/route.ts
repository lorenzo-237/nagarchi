import { NextRequest } from "next/server";
import { callApi } from "@/lib/server/api";
import { handleAuthResponse } from "@/lib/server/auth-actions";

export async function POST(request: NextRequest) {
  const body = await request.text();

  const res = await callApi("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  return handleAuthResponse(res);
}
