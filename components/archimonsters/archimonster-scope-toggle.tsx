"use client";

import { Button } from "@/components/ui/button";

interface ArchimonsterScopeToggleProps {
  showingAll: boolean;
  onClick: () => void;
}

export function ArchimonsterScopeToggle({ showingAll, onClick }: ArchimonsterScopeToggleProps) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick}>
      {showingAll ? "Afficher les favoris" : "Afficher tous"}
    </Button>
  );
}
