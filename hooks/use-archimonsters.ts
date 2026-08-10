"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api/client";
import type { ArchimonsterListItem, ArchimonsterServerData } from "@/lib/api/types";

interface UseArchimonstersOptions {
  search: string;
  favoritesOnly: boolean;
}

export function useArchimonsters(
  serverId: string | undefined,
  { search, favoritesOnly }: UseArchimonstersOptions
) {
  return useQuery({
    queryKey: ["archimonsters", serverId, search, favoritesOnly],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (favoritesOnly) params.set("favoritesOnly", "true");
      const qs = params.toString();
      return apiGet<ArchimonsterListItem[]>(
        `/api/proxy/servers/${serverId}/archimonsters${qs ? `?${qs}` : ""}`
      );
    },
    enabled: Boolean(serverId),
  });
}

interface UpdateArchimonsterInput {
  archimonsterId: string;
  price?: number | null;
  respawnHours?: number | null;
  lastKilledAt?: string | null;
}

export function useUpdateArchimonster(serverId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ archimonsterId, ...data }: UpdateArchimonsterInput) =>
      apiPatch<ArchimonsterServerData>(
        `/api/proxy/servers/${serverId}/archimonsters/${archimonsterId}`,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archimonsters", serverId] });
      queryClient.invalidateQueries({ queryKey: ["kills", serverId] });
      queryClient.invalidateQueries({ queryKey: ["kill-feed", serverId] });
      queryClient.invalidateQueries({ queryKey: ["prices", serverId] });
    },
  });
}

interface ToggleFavoriteInput {
  archimonsterId: string;
  isFavorite: boolean;
}

export function useToggleFavorite(serverId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ archimonsterId, isFavorite }: ToggleFavoriteInput) =>
      isFavorite
        ? apiDelete(`/api/proxy/archimonsters/${archimonsterId}/favorite`)
        : apiPost(`/api/proxy/archimonsters/${archimonsterId}/favorite`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archimonsters", serverId] });
    },
  });
}
