"use client";

import Image from "next/image";
import { SkullIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MarkSoldDialog } from "@/components/sales/mark-sold-dialog";
import { useCurrentUser } from "@/hooks/use-auth";
import { useDeleteSale, useKillFeed } from "@/hooks/use-sales";
import { ApiError } from "@/lib/api/client";

interface KillFeedListProps {
  serverId: string;
}

export function KillFeedList({ serverId }: KillFeedListProps) {
  const { data: feed, isLoading } = useKillFeed(serverId);
  const { data: user } = useCurrentUser();
  const deleteSale = useDeleteSale(serverId);

  async function handleUndo(killEventId: string) {
    try {
      await deleteSale.mutateAsync(killEventId);
      toast.success("Vente supprimée");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Impossible de supprimer la vente");
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (!feed || feed.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucun kill enregistré pour l&apos;instant.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {feed.map((item) => (
        <div key={item.id} className="flex items-center gap-3 rounded-2xl border p-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
            {item.archimonster.imageUrl ? (
              <Image
                src={item.archimonster.imageUrl}
                alt={item.archimonster.name}
                width={32}
                height={32}
                className="object-contain"
              />
            ) : (
              <SkullIcon className="size-5 text-muted-foreground" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{item.archimonster.name}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(item.killedAt).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {item.sale ? (
            <div className="flex shrink-0 items-center gap-2">
              <Badge variant="secondary">
                {item.sale.amount.toLocaleString("fr-FR")} K · {item.sale.sellerPseudo}
              </Badge>
              {item.sale.sellerId === user?.id && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Annuler la vente"
                  disabled={deleteSale.isPending}
                  onClick={() => handleUndo(item.id)}
                >
                  <Trash2Icon />
                </Button>
              )}
            </div>
          ) : (
            <div className="shrink-0">
              <MarkSoldDialog
                killEventId={item.id}
                serverId={serverId}
                archimonsterName={item.archimonster.name}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
