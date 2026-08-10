"use client";

import { Button } from "@/components/ui/button";
import type { Server } from "@/lib/api/types";

interface ServerMembershipRowProps {
  server: Server;
  actionLabel: string;
  actionVariant?: "outline" | "destructive";
  disabled?: boolean;
  isPending: boolean;
  onAction: () => void;
}

export function ServerMembershipRow({
  server,
  actionLabel,
  actionVariant = "outline",
  disabled,
  isPending,
  onAction,
}: ServerMembershipRowProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border px-4 py-3">
      <span className="font-medium">{server.name}</span>
      <Button
        type="button"
        size="sm"
        variant={actionVariant}
        disabled={disabled || isPending}
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    </div>
  );
}
