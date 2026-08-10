import { NextRequest, NextResponse } from "next/server";
import { forwardToApi } from "@/lib/server/proxy-fetch";

type RouteParams = { params: Promise<{ path: string[] }> };

async function handle(request: NextRequest, method: string, params: RouteParams["params"]) {
  const { path } = await params;
  const targetPath = `/api/${path.join("/")}${request.nextUrl.search}`;

  const hasBody = method !== "GET" && method !== "DELETE";
  const body = hasBody ? await request.text() : undefined;

  const res = await forwardToApi(targetPath, method, body, request.headers.get("content-type"));

  // Un 204 (ex: favoris) ne peut pas avoir de corps, même vide, sinon le
  // constructeur Response lève une erreur.
  if (res.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const responseBody = await res.text();

  return new NextResponse(responseBody, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
  });
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  return handle(request, "GET", params);
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  return handle(request, "POST", params);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  return handle(request, "PATCH", params);
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  return handle(request, "DELETE", params);
}
