"use client";

import { SwordsIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useUpdateArchimonster } from "@/hooks/use-archimonsters";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";

interface ArchimonsterQuickKillButtonProps {
  archimonsterId: string;
  serverId: string;
  className?: string;
}

export function ArchimonsterQuickKillButton({
  archimonsterId,
  serverId,
  className,
}: ArchimonsterQuickKillButtonProps) {
  const updateArchimonster = useUpdateArchimonster(serverId);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={cn(className)}
      disabled={updateArchimonster.isPending}
      aria-label="Je viens de le tuer"
      onClick={(event) => {
        event.stopPropagation();
        updateArchimonster.mutate(
          { archimonsterId, lastKilledAt: new Date().toISOString() },
          {
            onSuccess: () => toast.success("Kill enregistré"),
            onError: (error) =>
              toast.error(
                error instanceof ApiError ? error.message : "Impossible d'enregistrer le kill"
              ),
          }
        );
      }}
    >
      <SwordsIcon className="text-muted-foreground" />
    </Button>
  );
}
