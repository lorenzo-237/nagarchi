import { NextRequest, NextResponse } from "next/server";
import { callApi } from "@/lib/server/api";

// L'inscription ne connecte plus automatiquement : le compte est créé en
// attente de validation par un administrateur, donc pas de tokens à recevoir
// ni de cookies à poser ici (contrairement à /api/auth/login).
export async function POST(request: NextRequest) {
  const body = await request.text();

  const res = await callApi("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  const responseBody = await res.text();

  return new NextResponse(responseBody, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
  });
}
