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
