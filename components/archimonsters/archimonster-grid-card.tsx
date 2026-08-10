"use client";

import Image from "next/image";
import { SkullIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArchimonsterFavoriteButton } from "@/components/archimonsters/archimonster-favorite-button";
import { ArchimonsterHistoryButton } from "@/components/archimonsters/archimonster-history-button";
import { ArchimonsterQuickKillButton } from "@/components/archimonsters/archimonster-quick-kill-button";
import { ArchimonsterRespawnBadge } from "@/components/archimonsters/archimonster-respawn-badge";
import { ArchimonsterUpdatedBy } from "@/components/archimonsters/archimonster-updated-by";
import type { ArchimonsterListItem } from "@/lib/api/types";

interface ArchimonsterGridCardProps {
  archimonster: ArchimonsterListItem;
  serverId: string;
  onSelect: (archimonster: ArchimonsterListItem) => void;
}

export function ArchimonsterGridCard({
  archimonster,
  serverId,
  onSelect,
}: ArchimonsterGridCardProps) {
  const visibleZones = archimonster.zones.slice(0, 2);
  const hiddenZoneCount = archimonster.zones.length - visibleZones.length;

  return (
    <Card
      onClick={() => onSelect(archimonster)}
      className="relative cursor-pointer transition-shadow hover:shadow-md"
    >
      <div className="absolute top-2 left-2 flex items-center gap-0.5">
        <ArchimonsterQuickKillButton
          archimonsterId={archimonster.id}
          archimonsterName={archimonster.name}
          serverId={serverId}
        />
        <ArchimonsterHistoryButton
          archimonsterId={archimonster.id}
          archimonsterName={archimonster.name}
          serverId={serverId}
        />
      </div>
      <ArchimonsterFavoriteButton
        archimonsterId={archimonster.id}
        serverId={serverId}
        isFavorite={archimonster.isFavorite}
        className="absolute top-2 right-2"
      />

      <CardContent className="flex flex-col items-center gap-2 text-center">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-muted">
          {archimonster.imageUrl ? (
            <Image
              src={archimonster.imageUrl}
              alt={archimonster.name}
              width={56}
              height={56}
              className="object-contain"
            />
          ) : (
            <SkullIcon className="size-8 text-muted-foreground" />
          )}
        </div>

        <span className="line-clamp-2 text-sm font-medium">{archimonster.name}</span>

        <div className="flex flex-wrap justify-center gap-1">
          {visibleZones.length > 0 ? (
            <>
              {visibleZones.map((zone) => (
                <Badge key={zone} variant="secondary" className="text-xs">
                  {zone}
                </Badge>
              ))}
              {hiddenZoneCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  +{hiddenZoneCount}
                </Badge>
              )}
            </>
          ) : (
            <span className="text-xs text-muted-foreground">Zone inconnue</span>
          )}
        </div>

        <div className="flex flex-col items-center gap-0.5 text-sm">
          <span className="font-medium">
            {archimonster.price !== null
              ? `${archimonster.price.toLocaleString("fr-FR")} K`
              : "Prix ?"}
          </span>
          <ArchimonsterRespawnBadge
            lastKilledAt={archimonster.lastKilledAt}
            respawnHours={archimonster.respawnHours}
          />
        </div>

        {archimonster.updatedBy && (
          <span className="text-xs text-muted-foreground">
            Maj par <ArchimonsterUpdatedBy pseudo={archimonster.updatedBy} />
          </span>
        )}
      </CardContent>
    </Card>
  );
}
