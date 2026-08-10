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

interface ArchimonsterCardProps {
  archimonster: ArchimonsterListItem;
  serverId: string;
  onSelect: (archimonster: ArchimonsterListItem) => void;
}

export function ArchimonsterCard({ archimonster, serverId, onSelect }: ArchimonsterCardProps) {
  return (
    <Card
      onClick={() => onSelect(archimonster)}
      className="cursor-pointer transition-shadow hover:shadow-md"
    >
      <CardContent className="flex items-center gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted">
          {archimonster.imageUrl ? (
            <Image
              src={archimonster.imageUrl}
              alt={archimonster.name}
              width={40}
              height={40}
              className="object-contain"
            />
          ) : (
            <SkullIcon className="size-6 text-muted-foreground" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="truncate font-medium">{archimonster.name}</span>
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
            <ArchimonsterFavoriteButton
              archimonsterId={archimonster.id}
              serverId={serverId}
              isFavorite={archimonster.isFavorite}
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {archimonster.zones.length > 0 ? (
              archimonster.zones.map((zone) => (
                <Badge key={zone} variant="secondary" className="text-xs">
                  {zone}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">Zone inconnue</span>
            )}
          </div>
          {archimonster.updatedBy && (
            <span className="text-xs text-muted-foreground">
              Maj par <ArchimonsterUpdatedBy pseudo={archimonster.updatedBy} />
            </span>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1 text-sm">
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
      </CardContent>
    </Card>
  );
}
