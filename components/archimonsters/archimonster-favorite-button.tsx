"use client";

import { StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToggleFavorite } from "@/hooks/use-archimonsters";
import { cn } from "@/lib/utils";

interface ArchimonsterFavoriteButtonProps {
  archimonsterId: string;
  serverId: string;
  isFavorite: boolean;
  className?: string;
}

export function ArchimonsterFavoriteButton({
  archimonsterId,
  serverId,
  isFavorite,
  className,
}: ArchimonsterFavoriteButtonProps) {
  const toggleFavorite = useToggleFavorite(serverId);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={className}
      disabled={toggleFavorite.isPending}
      aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-pressed={isFavorite}
      onClick={(event) => {
        event.stopPropagation();
        toggleFavorite.mutate({ archimonsterId, isFavorite });
      }}
    >
      <StarIcon
        className={cn(isFavorite ? "fill-amber-400 text-amber-400" : "text-muted-foreground")}
      />
    </Button>
  );
}
