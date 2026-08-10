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
import type { AdminUser } from "@/lib/api/types";

interface UsersTableProps {
  users: AdminUser[];
  currentUserId: string;
  isRevoking: boolean;
  onRevoke: (userId: string) => void;
}

export function UsersTable({ users, currentUserId, isRevoking, onRevoke }: UsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pseudo</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Statut</TableHead>
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
                <Badge variant={user.isApproved ? "secondary" : "outline"} className="text-xs">
                  {user.isApproved ? "Approuvé" : "En attente"}
                </Badge>
                {user.isAdmin && (
                  <Badge className="border-transparent bg-primary/10 text-xs text-primary">
                    Admin
                  </Badge>
                )}
              </div>
            </TableCell>
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
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={!user.isApproved || user.id === currentUserId || isRevoking}
                onClick={() => onRevoke(user.id)}
              >
                Remettre en attente
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
