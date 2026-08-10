"use client";

import * as React from "react";
import { useCurrentUser } from "@/hooks/use-auth";

const STORAGE_KEY = "nagarchi:current-server-id";

interface ServerContextValue {
  currentServerId: string | undefined;
  setCurrentServerId: (serverId: string) => void;
}

const ServerContext = React.createContext<ServerContextValue | undefined>(undefined);

function readStoredServerId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export function ServerProvider({ children }: { children: React.ReactNode }) {
  const { data: user } = useCurrentUser();
  const [overrideServerId, setOverrideServerId] = React.useState<string | null>(readStoredServerId);

  const isOverrideValid = Boolean(
    overrideServerId && user?.servers.some((server) => server.id === overrideServerId)
  );
  const currentServerId = isOverrideValid ? overrideServerId! : user?.servers[0]?.id;

  const setCurrentServerId = React.useCallback((serverId: string) => {
    setOverrideServerId(serverId);
    window.localStorage.setItem(STORAGE_KEY, serverId);
  }, []);

  return (
    <ServerContext.Provider value={{ currentServerId, setCurrentServerId }}>
      {children}
    </ServerContext.Provider>
  );
}

export function useServerContext() {
  const context = React.useContext(ServerContext);
  if (!context) throw new Error("useServerContext doit être utilisé dans un ServerProvider");
  return context;
}
