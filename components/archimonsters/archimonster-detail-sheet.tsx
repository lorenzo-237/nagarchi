"use client";

import Image from "next/image";
import { SkullIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ArchimonsterFavoriteButton } from "@/components/archimonsters/archimonster-favorite-button";
import { ArchimonsterHistoryButton } from "@/components/archimonsters/archimonster-history-button";
import { ArchimonsterKillTimeForm } from "@/components/archimonsters/archimonster-kill-time-form";
import { ArchimonsterPriceForm } from "@/components/archimonsters/archimonster-price-form";
import { ArchimonsterQuickKillButton } from "@/components/archimonsters/archimonster-quick-kill-button";
import { ArchimonsterRespawnForm } from "@/components/archimonsters/archimonster-respawn-form";
import { ArchimonsterRespawnBadge } from "@/components/archimonsters/archimonster-respawn-badge";
import { ArchimonsterUpdatedBy } from "@/components/archimonsters/archimonster-updated-by";
import type { ArchimonsterListItem } from "@/lib/api/types";
import { formatTime, isToday } from "@/lib/respawn";

interface ArchimonsterDetailSheetProps {
  archimonster: ArchimonsterListItem | null;
  serverId: string;
  onOpenChange: (open: boolean) => void;
}

export function ArchimonsterDetailSheet({
  archimonster,
  serverId,
  onOpenChange,
}: ArchimonsterDetailSheetProps) {
  return (
    <Sheet open={Boolean(archimonster)} onOpenChange={onOpenChange}>
      <SheetContent>
        {archimonster && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted">
                  {archimonster.imageUrl ? (
                    <Image
                      src={archimonster.imageUrl}
                      alt={archimonster.name}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  ) : (
                    <SkullIcon className="size-7 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <SheetTitle>{archimonster.name}</SheetTitle>
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
                  <SheetDescription>
                    {archimonster.zones.length > 0 ? archimonster.zones.join(", ") : "Zone inconnue"}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="flex flex-col gap-4 px-6 pb-6">
              {archimonster.zones.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {archimonster.zones.map((zone) => (
                    <Badge key={zone} variant="secondary">
                      {zone}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {archimonster.lastKilledAt && isToday(archimonster.lastKilledAt)
                    ? `Dernier kill à ${formatTime(new Date(archimonster.lastKilledAt))}`
                    : "Dernier kill inconnu"}
                </span>
                <ArchimonsterRespawnBadge
                  lastKilledAt={archimonster.lastKilledAt}
                  respawnHours={archimonster.respawnHours}
                />
              </div>

              <Separator />

              <ArchimonsterPriceForm archimonster={archimonster} serverId={serverId} />
              <ArchimonsterRespawnForm archimonster={archimonster} serverId={serverId} />
              <ArchimonsterKillTimeForm archimonster={archimonster} serverId={serverId} />

              {archimonster.updatedBy && (
                <p className="text-xs text-muted-foreground">
                  Dernière mise à jour par <ArchimonsterUpdatedBy pseudo={archimonster.updatedBy} />
                  {archimonster.updatedAt &&
                    ` le ${new Date(archimonster.updatedAt).toLocaleString("fr-FR")}`}
                </p>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
