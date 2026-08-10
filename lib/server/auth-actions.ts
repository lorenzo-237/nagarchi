import { NextResponse } from "next/server";
import { setAuthCookies } from "./cookies";

// Relaie la réponse de login/register d'Express : pose les cookies httpOnly en
// cas de succès, ne renvoie jamais les tokens bruts au client.
export async function handleAuthResponse(res: Response): Promise<NextResponse> {
  if (!res.ok) {
    const error = await res.text();
    return new NextResponse(error, {
      status: res.status,
      headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
    });
  }

  const tokens = await res.json();
  await setAuthCookies(tokens);

  return NextResponse.json({ ok: true });
}
