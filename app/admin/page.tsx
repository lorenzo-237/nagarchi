"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AdminNav, type AdminSection } from "@/components/admin/admin-nav";
import { AppHeader } from "@/components/layout/app-header";
import { KillEventsTable } from "@/components/admin/kill-events-table";
import { PendingUsersTable } from "@/components/admin/pending-users-table";
import { PriceEventsTable } from "@/components/admin/price-events-table";
import { SettingsForm } from "@/components/admin/settings-form";
import { UsersTable } from "@/components/admin/users-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useServerContext } from "@/components/providers/server-context";
import {
  useAdminKillEvents,
  useAdminPriceEvents,
  useApproveUser,
  useDeleteAdminKillEvent,
  useDeleteAdminPriceEvent,
  usePendingUsers,
  useRejectUser,
  useRevokeUser,
  useUsers,
} from "@/hooks/use-admin";
import { useCurrentUser } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/client";

export default function AdminPage() {
  const router = useRouter();
  const { currentServerId } = useServerContext();
  const [section, setSection] = React.useState<AdminSection>("pending");
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: pendingUsers, isLoading: pendingLoading } = usePendingUsers();
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: killEvents, isLoading: killEventsLoading } = useAdminKillEvents(currentServerId);
  const { data: priceEvents, isLoading: priceEventsLoading } = useAdminPriceEvents(currentServerId);
  const approveUser = useApproveUser();
  const rejectUser = useRejectUser();
  const revokeUser = useRevokeUser();
  const deleteKillEvent = useDeleteAdminKillEvent(currentServerId);
  const deletePriceEvent = useDeleteAdminPriceEvent(currentServerId);

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

  async function handleRevoke(userId: string) {
    try {
      await revokeUser.mutateAsync(userId);
      toast.success("Compte remis en attente");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Impossible de remettre ce compte en attente");
    }
  }

  async function handleDeleteKillEvent(killEventId: string) {
    try {
      await deleteKillEvent.mutateAsync(killEventId);
      toast.success("Kill supprimé");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Impossible de supprimer ce kill");
    }
  }

  async function handleDeletePriceEvent(priceEventId: string) {
    try {
      await deletePriceEvent.mutateAsync(priceEventId);
      toast.success("Prix supprimé");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Impossible de supprimer ce prix");
    }
  }

  if (isNotAdmin) return null;

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 p-4 sm:flex-row">
        <AdminNav section={section} pendingCount={pendingUsers?.length} onChange={setSection} />

        <div className="min-w-0 flex-1">
          {section === "pending" && (
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
          )}

          {section === "users" && (
            <Card>
              <CardHeader>
                <CardTitle>Utilisateurs</CardTitle>
                <CardDescription>
                  Gère les comptes existants. Remettre en attente bloque la connexion jusqu&apos;à
                  une nouvelle approbation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading && (
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                )}
                {!usersLoading && users && users.length > 0 && user && (
                  <UsersTable
                    users={users}
                    currentUserId={user.id}
                    isRevoking={revokeUser.isPending}
                    onRevoke={handleRevoke}
                  />
                )}
              </CardContent>
            </Card>
          )}

          {section === "kills" && (
            <Card>
              <CardHeader>
                <CardTitle>Kills</CardTitle>
                <CardDescription>
                  Tous les kills signalés sur le serveur sélectionné. Supprimer recalcule
                  automatiquement le dernier kill affiché pour l&apos;archimonstre concerné.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {killEventsLoading && (
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                )}
                {!killEventsLoading && killEvents?.length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucun kill enregistré.</p>
                )}
                {killEvents && killEvents.length > 0 && (
                  <KillEventsTable
                    events={killEvents}
                    isDeleting={deleteKillEvent.isPending}
                    onDelete={handleDeleteKillEvent}
                  />
                )}
              </CardContent>
            </Card>
          )}

          {section === "prices" && (
            <Card>
              <CardHeader>
                <CardTitle>Prix</CardTitle>
                <CardDescription>
                  Tous les changements de prix signalés sur le serveur sélectionné. Supprimer
                  recalcule automatiquement le prix affiché pour l&apos;archimonstre concerné.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {priceEventsLoading && (
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                )}
                {!priceEventsLoading && priceEvents?.length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucun prix enregistré.</p>
                )}
                {priceEvents && priceEvents.length > 0 && (
                  <PriceEventsTable
                    events={priceEvents}
                    isDeleting={deletePriceEvent.isPending}
                    onDelete={handleDeletePriceEvent}
                  />
                )}
              </CardContent>
            </Card>
          )}

          {section === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>Paramètres</CardTitle>
                <CardDescription>Réglages globaux de l&apos;application.</CardDescription>
              </CardHeader>
              <CardContent>
                <SettingsForm />
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
