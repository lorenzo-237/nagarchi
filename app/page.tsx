"use client";

import * as React from "react";

import { AppHeader } from "@/components/layout/app-header";
import { ArchimonsterDetailSheet } from "@/components/archimonsters/archimonster-detail-sheet";
import { ArchimonsterGrid } from "@/components/archimonsters/archimonster-grid";
import { ArchimonsterScopeToggle } from "@/components/archimonsters/archimonster-scope-toggle";
import { ArchimonsterSearch } from "@/components/archimonsters/archimonster-search";
import {
  ArchimonsterViewToggle,
  type ArchimonsterView,
} from "@/components/archimonsters/archimonster-view-toggle";
import { useServerContext } from "@/components/providers/server-context";
import { useArchimonsters } from "@/hooks/use-archimonsters";

const MIN_SEARCH_LENGTH = 3;

export default function Page() {
  const { currentServerId } = useServerContext();
  const [search, setSearch] = React.useState("");
  const [showAll, setShowAll] = React.useState(false);
  const [view, setView] = React.useState<ArchimonsterView>("grid");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const trimmedSearch = search.trim();
  const hasSearchQuery = trimmedSearch.length >= MIN_SEARCH_LENGTH;
  const favoritesOnly = !hasSearchQuery && !showAll;

  const { data: archimonsters, isLoading } = useArchimonsters(currentServerId, {
    search: hasSearchQuery ? trimmedSearch : "",
    favoritesOnly,
  });

  const selected = archimonsters?.find((item) => item.id === selectedId) ?? null;

  function handleScopeToggle() {
    if (favoritesOnly) {
      setShowAll(true);
    } else {
      setShowAll(false);
      setSearch("");
    }
  }

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <ArchimonsterSearch value={search} onChange={setSearch} />
          </div>
          <ArchimonsterScopeToggle showingAll={!favoritesOnly} onClick={handleScopeToggle} />
          <ArchimonsterViewToggle view={view} onChange={setView} />
        </div>

        <p className="text-sm text-muted-foreground">
          {favoritesOnly
            ? `Tes archimonstres favoris. Tape au moins ${MIN_SEARCH_LENGTH} caractères ou clique sur "Afficher tous" pour explorer tous les archimonstres.`
            : hasSearchQuery
              ? "Résultats de recherche parmi tous les archimonstres."
              : "Tous les archimonstres."}
        </p>

        <ArchimonsterGrid
          archimonsters={archimonsters}
          isLoading={isLoading || !currentServerId}
          view={view}
          serverId={currentServerId ?? ""}
          emptyMessage={
            favoritesOnly
              ? "Aucun favori pour l'instant. Cherche un archimonstre et clique sur l'étoile pour l'ajouter."
              : "Aucun archimonstre trouvé."
          }
          onSelect={(archimonster) => setSelectedId(archimonster.id)}
        />
      </main>

      {currentServerId && (
        <ArchimonsterDetailSheet
          archimonster={selected}
          serverId={currentServerId}
          onOpenChange={(open) => {
            if (!open) setSelectedId(null);
          }}
        />
      )}
    </div>
  );
}
