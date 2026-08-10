import { callApi } from "./api";
import { clearAuthCookies, getAccessToken, getRefreshToken, setAuthCookies } from "./cookies";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

async function tryRefresh(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  const res = await callApi("/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    await clearAuthCookies();
    return null;
  }

  const tokens = (await res.json()) as AuthTokens;
  await setAuthCookies(tokens);
  return tokens.accessToken;
}

// Relaie une requête vers l'API Express en injectant l'access token, avec une
// tentative de refresh transparente si le token est expiré (401).
export async function forwardToApi(
  path: string,
  method: string,
  body?: string,
  contentType?: string | null
): Promise<Response> {
  const accessToken = await getAccessToken();

  const doFetch = (token?: string) =>
    callApi(path, {
      method,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(contentType ? { "Content-Type": contentType } : {}),
      },
      body,
    });

  let res = await doFetch(accessToken);

  if (res.status === 401) {
    const newAccessToken = await tryRefresh();
    if (newAccessToken) {
      res = await doFetch(newAccessToken);
    }
  }

  return res;
}
