"use client";

import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";
import { toast } from "sonner";

import { AppHeader } from "@/components/layout/app-header";
import { DiscordLinkForm } from "@/components/profile/discord-link-form";
import { ServerMembershipRow } from "@/components/profile/server-membership-row";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { useJoinServer, useLeaveServer, useServers } from "@/hooks/use-servers";
import { ApiError } from "@/lib/api/client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { data: allServers } = useServers();
  const joinServer = useJoinServer();
  const leaveServer = useLeaveServer();
  const logout = useLogout();

  const myServers = user?.servers ?? [];
  const myServerIds = new Set(myServers.map((server) => server.id));
  const availableServers = (allServers ?? []).filter((server) => !myServerIds.has(server.id));

  async function handleLogout() {
    await logout.mutateAsync();
    router.push("/login");
    router.refresh();
  }

  async function handleJoin(serverId: string) {
    try {
      await joinServer.mutateAsync(serverId);
      toast.success("Serveur rejoint");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Impossible de rejoindre ce serveur");
    }
  }

  async function handleLeave(serverId: string) {
    try {
      await leaveServer.mutateAsync(serverId);
      toast.success("Serveur quitté");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Impossible de quitter ce serveur");
    }
  }

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
            <CardDescription>
              {user ? `${user.pseudo} · ${user.email}` : "Chargement..."}
            </CardDescription>
            <CardAction>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={logout.isPending}
                onClick={handleLogout}
              >
                <LogOutIcon />
                Déconnexion
              </Button>
            </CardAction>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications Discord</CardTitle>
          </CardHeader>
          <CardContent>{user && <DiscordLinkForm user={user} />}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mes serveurs</CardTitle>
            <CardDescription>Tu dois rester inscrit sur au moins un serveur.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {myServers.map((server) => (
              <ServerMembershipRow
                key={server.id}
                server={server}
                actionLabel="Quitter"
                actionVariant="destructive"
                disabled={myServers.length <= 1}
                isPending={leaveServer.isPending}
                onAction={() => handleLeave(server.id)}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rejoindre un serveur</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {availableServers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Tu es déjà inscrit sur tous les serveurs.
              </p>
            ) : (
              availableServers.map((server) => (
                <ServerMembershipRow
                  key={server.id}
                  server={server}
                  actionLabel="Rejoindre"
                  isPending={joinServer.isPending}
                  onAction={() => handleJoin(server.id)}
                />
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
