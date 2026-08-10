const API_URL = process.env.API_URL;

if (!API_URL) {
  throw new Error("La variable d'environnement API_URL n'est pas définie");
}

export function callApi(path: string, init?: RequestInit) {
  return fetch(`${API_URL}${path}`, init);
}
