"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AppHeader } from "@/components/layout/app-header";
import { PendingUsersTable } from "@/components/admin/pending-users-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApproveUser, usePendingUsers, useRejectUser } from "@/hooks/use-admin";
import { useCurrentUser } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/client";

export default function AdminPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: pendingUsers, isLoading: pendingLoading } = usePendingUsers();
  const approveUser = useApproveUser();
  const rejectUser = useRejectUser();

  const isNotAdmin = !userLoading && user !== undefined && !user.isAdmin;

  React.useEffect(() => {
    if (isNotAdmin) router.replace("/");
  }, [isNotAdmin, router]);

  async function handleApprove(userId: string) {
    try {
      await approveUser.mutateAsync(userId);
      toast.success("Compte approuvé");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Impossible d'approuver ce compte");
    }
  }

  async function handleReject(userId: string) {
    try {
      await rejectUser.mutateAsync(userId);
      toast.success("Compte rejeté");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Impossible de rejeter ce compte");
    }
  }

  if (isNotAdmin) return null;

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Inscriptions en attente</CardTitle>
            <CardDescription>Valide ou rejette les nouvelles inscriptions.</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingLoading && (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            )}
            {!pendingLoading && pendingUsers?.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucune inscription en attente.</p>
            )}
            {pendingUsers && pendingUsers.length > 0 && (
              <PendingUsersTable
                users={pendingUsers}
                isApproving={approveUser.isPending}
                isRejecting={rejectUser.isPending}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
