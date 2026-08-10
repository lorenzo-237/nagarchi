import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/server/cookies";

const PUBLIC_PATHS = ["/login", "/register"];

// Garde-fou UX : redirige selon la présence des cookies de session. La vraie
// vérification du JWT reste faite par l'API Express sur chaque requête.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = Boolean(
    request.cookies.get(ACCESS_TOKEN_COOKIE) || request.cookies.get(REFRESH_TOKEN_COOKIE)
  );
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
