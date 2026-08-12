// Mécanique Dofus : un archimonstre réapparaît à heure fixe (respawnHours après
// le dernier kill) à ±15 minutes près.
const RESPAWN_JITTER_MINUTES = 15;

export interface RespawnWindow {
  start: Date;
  end: Date;
}

// "expired" : le créneau est passé depuis un jour précédent — on considère
// l'info trop périmée pour continuer à afficher "Disponible". On compare la
// fin du créneau (pas son début) au jour courant : un créneau à cheval sur
// minuit (23h30–1h00) reste donc valide tant qu'on est encore le jour où il
// se termine, et n'expire qu'au jour suivant.
export type RespawnStatus = "available" | "soon" | "upcoming" | "expired";

export function computeRespawnWindow(
  lastKilledAt: string | null,
  respawnHours: number | null
): RespawnWindow | null {
  if (!lastKilledAt || respawnHours === null) return null;

  const nominal = new Date(lastKilledAt).getTime() + respawnHours * 60 * 60 * 1000;
  const jitterMs = RESPAWN_JITTER_MINUTES * 60 * 1000;

  return { start: new Date(nominal - jitterMs), end: new Date(nominal + jitterMs) };
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getRespawnStatus(window: RespawnWindow, now: Date = new Date()): RespawnStatus {
  if (now >= window.end) return isSameCalendarDay(window.end, now) ? "available" : "expired";
  if (now >= window.start) return "soon";
  return "upcoming";
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function isToday(isoString: string): boolean {
  return isSameCalendarDay(new Date(isoString), new Date());
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

// disponible > bientôt > à venir > inconnu/expiré (pas d'info exploitable
// pour dire s'il est dispo — soit jamais renseigné, soit un créneau périmé).
function availabilityRank(item: { lastKilledAt: string | null; respawnHours: number | null }): number {
  const window = computeRespawnWindow(item.lastKilledAt, item.respawnHours);
  if (!window) return 3;

  const status = getRespawnStatus(window);
  if (status === "available") return 0;
  if (status === "soon") return 1;
  if (status === "upcoming") return 2;
  return 3;
}

export function compareByAvailability<
  T extends { lastKilledAt: string | null; respawnHours: number | null; name: string },
>(a: T, b: T): number {
  const rankDiff = availabilityRank(a) - availabilityRank(b);
  if (rankDiff !== 0) return rankDiff;
  return a.name.localeCompare(b.name, "fr");
}
