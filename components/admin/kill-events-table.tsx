"use client";

import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminKillEvent } from "@/lib/api/types";

interface KillEventsTableProps {
  events: AdminKillEvent[];
  isDeleting: boolean;
  onDelete: (killEventId: string) => void;
}

export function KillEventsTable({ events, isDeleting, onDelete }: KillEventsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Archimonstre</TableHead>
          <TableHead>Date/heure</TableHead>
          <TableHead>Signalé par</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell className="font-medium">{event.archimonsterName}</TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(event.killedAt).toLocaleString("fr-FR")}
            </TableCell>
            <TableCell className="text-muted-foreground">{event.createdByPseudo ?? "—"}</TableCell>
            <TableCell className="text-right">
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                aria-label="Supprimer ce kill"
                disabled={isDeleting}
                onClick={() => {
                  if (window.confirm(`Supprimer ce kill de "${event.archimonsterName}" ?`)) {
                    onDelete(event.id);
                  }
                }}
              >
                <Trash2Icon />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
