"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPost } from "@/lib/api/client";
import type { Server } from "@/lib/api/types";

export function useServers() {
  return useQuery({
    queryKey: ["servers"],
    queryFn: () => apiGet<Server[]>("/api/proxy/servers"),
  });
}

export function useJoinServer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serverId: string) => apiPost(`/api/proxy/servers/${serverId}/join`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth", "me"] }),
  });
}

export function useLeaveServer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serverId: string) => apiDelete(`/api/proxy/servers/${serverId}/join`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth", "me"] }),
  });
}
