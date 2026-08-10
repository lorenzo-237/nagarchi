"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ArchimonsterCard } from "@/components/archimonsters/archimonster-card";
import { ArchimonsterGridCard } from "@/components/archimonsters/archimonster-grid-card";
import type { ArchimonsterView } from "@/components/archimonsters/archimonster-view-toggle";
import type { ArchimonsterListItem } from "@/lib/api/types";

const GRID_CLASSNAME = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6";

interface ArchimonsterGridProps {
  archimonsters: ArchimonsterListItem[] | undefined;
  isLoading: boolean;
  view: ArchimonsterView;
  serverId: string;
  emptyMessage?: string;
  onSelect: (archimonster: ArchimonsterListItem) => void;
}

export function ArchimonsterGrid({
  archimonsters,
  isLoading,
  view,
  serverId,
  emptyMessage = "Aucun archimonstre trouvé.",
  onSelect,
}: ArchimonsterGridProps) {
  if (isLoading) {
    if (view === "grid") {
      return (
        <div className={GRID_CLASSNAME}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-44 w-full" />
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-18 w-full" />
        ))}
      </div>
    );
  }

  if (!archimonsters || archimonsters.length === 0) {
    return <p className="py-12 text-center text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  if (view === "grid") {
    return (
      <div className={GRID_CLASSNAME}>
        {archimonsters.map((archimonster) => (
          <ArchimonsterGridCard
            key={archimonster.id}
            archimonster={archimonster}
            serverId={serverId}
            onSelect={onSelect}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {archimonsters.map((archimonster) => (
        <ArchimonsterCard
          key={archimonster.id}
          archimonster={archimonster}
          serverId={serverId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
