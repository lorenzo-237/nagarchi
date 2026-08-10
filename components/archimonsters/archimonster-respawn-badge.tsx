"use client";

import { Badge } from "@/components/ui/badge";
import { computeRespawnWindow, formatTime, getRespawnStatus } from "@/lib/respawn";
import { cn } from "@/lib/utils";

interface ArchimonsterRespawnBadgeProps {
  lastKilledAt: string | null;
  respawnHours: number | null;
  className?: string;
}

interface StatusBadgeProps {
  dotClassName: string;
  label: string;
  className?: string;
}

// Badge discret et uniforme pour tous les états : une pastille de couleur
// porte le statut, le texte porte toujours le créneau (ou l'intervalle brut
// quand on ne connaît pas encore de dernier kill).
function StatusBadge({ dotClassName, label, className }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn("gap-1.5", className)}>
      <span className={cn("size-2 shrink-0 rounded-full", dotClassName)} />
      {label}
    </Badge>
  );
}

export function ArchimonsterRespawnBadge({
  lastKilledAt,
  respawnHours,
  className,
}: ArchimonsterRespawnBadgeProps) {
  const window = computeRespawnWindow(lastKilledAt, respawnHours);

  if (!window) {
    return (
      <StatusBadge
        dotClassName="bg-muted-foreground/40"
        label={respawnHours !== null ? `Toutes les ${respawnHours}h` : "Intervalle ?"}
        className={className}
      />
    );
  }

  const status = getRespawnStatus(window);
  const label = `${formatTime(window.start)}–${formatTime(window.end)}`;

  if (status === "available") {
    return <StatusBadge dotClassName="bg-emerald-500" label={label} className={className} />;
  }

  if (status === "soon") {
    return <StatusBadge dotClassName="bg-amber-500" label={label} className={className} />;
  }

  return <StatusBadge dotClassName="bg-muted-foreground/40" label={label} className={className} />;
}
