export interface Server {
  id: string;
  name: string;
  slug: string;
}

export interface AuthUser {
  id: string;
  email: string;
  pseudo: string;
  isAdmin: boolean;
  servers: Server[];
}

export interface PendingUser {
  id: string;
  email: string;
  pseudo: string;
  createdAt: string;
  servers: Server[];
}

export interface AdminUser {
  id: string;
  email: string;
  pseudo: string;
  isApproved: boolean;
  isAdmin: boolean;
  createdAt: string;
  servers: Server[];
}

// Réponse de GET /servers/:serverId/archimonsters : la fiche de l'archimonstre
// fusionnée avec ses données propres au serveur courant (prix, heures, auteur).
export interface ArchimonsterListItem {
  id: string;
  dofusDbId: number | null;
  name: string;
  zones: string[];
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
  price: number | null;
  respawnHours: number | null;
  lastKilledAt: string | null;
  updatedBy: string | null;
  isFavorite: boolean;
}

export interface ArchimonsterServerData {
  id: string;
  archimonsterId: string;
  serverId: string;
  price: number | null;
  respawnHours: number | null;
  lastKilledAt: string | null;
  updatedById: string | null;
  updatedAt: string;
}

export interface KillEvent {
  id: string;
  killedAt: string;
}

export type KillRange = "24h" | "7d";

export interface PriceEvent {
  id: string;
  price: number;
  recordedAt: string;
}

export type PriceRange = "24h" | "7d" | "30d";

export interface AppSettings {
  id: string;
  maxKillsPerDay: number;
  updatedAt: string;
}

export interface KillFeedSale {
  amount: number;
  soldAt: string;
  sellerId: string;
  sellerPseudo: string;
}

export interface KillFeedItem {
  id: string;
  killedAt: string;
  archimonster: { id: string; name: string; imageUrl: string | null };
  sale: KillFeedSale | null;
}

export interface Sale {
  id: string;
  killEventId: string;
  userId: string;
  amount: number;
  soldAt: string;
}

export type ProfitRange = "7d" | "30d" | "90d";

export interface ProfitSummary {
  total: number;
  sales: { amount: number; soldAt: string }[];
}

export interface AdminKillEvent {
  id: string;
  killedAt: string;
  archimonsterName: string;
  createdByPseudo: string | null;
}

export interface AdminPriceEvent {
  id: string;
  price: number;
  recordedAt: string;
  archimonsterName: string;
  createdByPseudo: string | null;
}
