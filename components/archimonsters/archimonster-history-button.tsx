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
import { cn } from "@/lib/utils";

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
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn(className)}
            aria-label="Historique des kills"
            onClick={(event) => event.stopPropagation()}
          />
        }
      >
        <ChartLineIcon className="text-muted-foreground" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl" onClick={(event) => event.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{archimonsterName} — historique des kills</DialogTitle>
        </DialogHeader>
        <ArchimonsterKillChart archimonsterId={archimonsterId} serverId={serverId} />
      </DialogContent>
    </Dialog>
  );
}
