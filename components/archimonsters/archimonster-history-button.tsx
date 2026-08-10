"use client";

import * as React from "react";
import { ChartLineIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArchimonsterKillChart } from "@/components/archimonsters/archimonster-kill-chart";
import { ArchimonsterPriceChart } from "@/components/archimonsters/archimonster-price-chart";
import { cn } from "@/lib/utils";

type HistoryTab = "kills" | "price";

interface ArchimonsterHistoryButtonProps {
  archimonsterId: string;
  archimonsterName: string;
  serverId: string;
  className?: string;
}

export function ArchimonsterHistoryButton({
  archimonsterId,
  archimonsterName,
  serverId,
  className,
}: ArchimonsterHistoryButtonProps) {
  const [tab, setTab] = React.useState<HistoryTab>("kills");

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn(className)}
            aria-label="Historique"
            onClick={(event) => event.stopPropagation()}
          />
        }
      >
        <ChartLineIcon className="text-muted-foreground" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl" onClick={(event) => event.stopPropagation()}>
        <DialogHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <DialogTitle>{archimonsterName} — historique</DialogTitle>
            <div className="flex items-center gap-1 rounded-2xl bg-muted p-1">
              <Button
                type="button"
                size="xs"
                variant={tab === "kills" ? "default" : "ghost"}
                onClick={() => setTab("kills")}
              >
                Kills
              </Button>
              <Button
                type="button"
                size="xs"
                variant={tab === "price" ? "default" : "ghost"}
                onClick={() => setTab("price")}
              >
                Prix
              </Button>
            </div>
          </div>
        </DialogHeader>
        {tab === "kills" ? (
          <ArchimonsterKillChart archimonsterId={archimonsterId} serverId={serverId} />
        ) : (
          <ArchimonsterPriceChart archimonsterId={archimonsterId} serverId={serverId} />
        )}
      </DialogContent>
    </Dialog>
  );
}
