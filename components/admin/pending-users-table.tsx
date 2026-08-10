"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PendingUser } from "@/lib/api/types";

interface PendingUsersTableProps {
  users: PendingUser[];
  isApproving: boolean;
  isRejecting: boolean;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
}

export function PendingUsersTable({
  users,
  isApproving,
  isRejecting,
  onApprove,
  onReject,
}: PendingUsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pseudo</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Serveurs</TableHead>
          <TableHead>Inscrit le</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.pseudo}</TableCell>
            <TableCell className="text-muted-foreground">{user.email}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {user.servers.map((server) => (
                  <Badge key={server.id} variant="secondary" className="text-xs">
                    {server.name}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(user.createdAt).toLocaleDateString("fr-FR")}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isApproving || isRejecting}
                  onClick={() => onReject(user.id)}
                >
                  Rejeter
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={isApproving || isRejecting}
                  onClick={() => onApprove(user.id)}
                >
                  Approuver
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
