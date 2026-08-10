// Mécanique Dofus : un archimonstre réapparaît à heure fixe (respawnHours après
// le dernier kill) à ±15 minutes près.
const RESPAWN_JITTER_MINUTES = 15;

export interface RespawnWindow {
  start: Date;
  end: Date;
}

export type RespawnStatus = "available" | "soon" | "upcoming";

export function computeRespawnWindow(
  lastKilledAt: string | null,
  respawnHours: number | null
): RespawnWindow | null {
  if (!lastKilledAt || respawnHours === null) return null;

  const nominal = new Date(lastKilledAt).getTime() + respawnHours * 60 * 60 * 1000;
  const jitterMs = RESPAWN_JITTER_MINUTES * 60 * 1000;

  return { start: new Date(nominal - jitterMs), end: new Date(nominal + jitterMs) };
}

export function getRespawnStatus(window: RespawnWindow, now: Date = new Date()): RespawnStatus {
  if (now >= window.end) return "available";
  if (now >= window.start) return "soon";
  return "upcoming";
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function isToday(isoString: string): boolean {
  const date = new Date(isoString);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function toHHmm(isoString: string): string {
  const date = new Date(isoString);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

// Construit un ISO datetime pour AUJOURD'HUI à l'heure locale donnée (HH:mm).
export function todayAtTime(hhmm: string): string {
  const [hours, minutes] = hhmm.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}
