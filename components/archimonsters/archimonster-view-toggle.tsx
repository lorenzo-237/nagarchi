"use client";

import { LayoutGridIcon, ListIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ArchimonsterView = "grid" | "list";

interface ArchimonsterViewToggleProps {
  view: ArchimonsterView;
  onChange: (view: ArchimonsterView) => void;
}

export function ArchimonsterViewToggle({ view, onChange }: ArchimonsterViewToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-2xl bg-muted p-1">
      <Button
        type="button"
        size="icon-sm"
        variant={view === "grid" ? "default" : "ghost"}
        onClick={() => onChange("grid")}
        aria-label="Affichage en grille"
        aria-pressed={view === "grid"}
      >
        <LayoutGridIcon />
      </Button>
      <Button
        type="button"
        size="icon-sm"
        variant={view === "list" ? "default" : "ghost"}
        onClick={() => onChange("list")}
        aria-label="Affichage en liste"
        aria-pressed={view === "list"}
      >
        <ListIcon />
      </Button>
    </div>
  );
}
