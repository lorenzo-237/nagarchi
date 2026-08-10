"use client";

import { useCurrentUser } from "@/hooks/use-auth";
import { useServerContext } from "@/components/providers/server-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ServerSwitcher() {
  const { data: user } = useCurrentUser();
  const { currentServerId, setCurrentServerId } = useServerContext();

  if (!user || user.servers.length === 0) return null;

  if (user.servers.length === 1) {
    return <span className="px-2 text-sm font-medium">{user.servers[0].name}</span>;
  }

  const items = Object.fromEntries(user.servers.map((server) => [server.id, server.name]));

  return (
    <Select
      items={items}
      value={currentServerId}
      onValueChange={(value) => {
        if (value) setCurrentServerId(value);
      }}
    >
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Serveur" />
      </SelectTrigger>
      <SelectContent>
        {user.servers.map((server) => (
          <SelectItem key={server.id} value={server.id}>
            {server.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
