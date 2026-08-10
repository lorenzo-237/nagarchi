"use client";

import { Badge } from "@/components/ui/badge";
import { computeRespawnWindow, formatTime, getRespawnStatus } from "@/lib/respawn";

interface ArchimonsterRespawnBadgeProps {
  lastKilledAt: string | null;
  respawnHours: number | null;
  className?: string;
}

export function ArchimonsterRespawnBadge({
  lastKilledAt,
  respawnHours,
  className,
}: ArchimonsterRespawnBadgeProps) {
  const window = computeRespawnWindow(lastKilledAt, respawnHours);

  if (!window) {
    return (
      <Badge variant="outline" className={className}>
        {respawnHours !== null ? `Toutes les ${respawnHours}h` : "Intervalle ?"}
      </Badge>
    );
  }

  const status = getRespawnStatus(window);

  if (status === "available") {
    return (
      <Badge
        className={`border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ${className ?? ""}`}
      >
        Disponible
      </Badge>
    );
  }

  if (status === "soon") {
    return (
      <Badge
        className={`border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400 ${className ?? ""}`}
      >
        Bientôt · {formatTime(window.start)}–{formatTime(window.end)}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={className}>
      {formatTime(window.start)}–{formatTime(window.end)}
    </Badge>
  );
}
