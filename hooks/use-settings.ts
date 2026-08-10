"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPatch } from "@/lib/api/client";
import type { AppSettings } from "@/lib/api/types";

export function useAppSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => apiGet<AppSettings>("/api/proxy/settings"),
  });
}

export function useUpdateAppSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (maxKillsPerDay: number) =>
      apiPatch<AppSettings>("/api/proxy/settings", { maxKillsPerDay }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["settings"] }),
  });
}
