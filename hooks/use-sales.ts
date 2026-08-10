"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPost } from "@/lib/api/client";
import type { KillFeedItem, ProfitRange, ProfitSummary, Sale } from "@/lib/api/types";

export function useKillFeed(serverId: string | undefined) {
  return useQuery({
    queryKey: ["kill-feed", serverId],
    queryFn: () => apiGet<KillFeedItem[]>(`/api/proxy/servers/${serverId}/kills/feed`),
    enabled: Boolean(serverId),
  });
}

export function useProfitSummary(serverId: string | undefined, range: ProfitRange) {
  return useQuery({
    queryKey: ["profit-summary", serverId, range],
    queryFn: () =>
      apiGet<ProfitSummary>(`/api/proxy/servers/${serverId}/sales/summary?range=${range}`),
    enabled: Boolean(serverId),
  });
}

interface CreateSaleInput {
  killEventId: string;
  amount: number;
}

export function useCreateSale(serverId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ killEventId, amount }: CreateSaleInput) =>
      apiPost<Sale>(`/api/proxy/servers/${serverId}/kills/${killEventId}/sale`, { amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kill-feed", serverId] });
      queryClient.invalidateQueries({ queryKey: ["profit-summary", serverId] });
    },
  });
}

export function useDeleteSale(serverId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (killEventId: string) =>
      apiDelete(`/api/proxy/servers/${serverId}/kills/${killEventId}/sale`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kill-feed", serverId] });
      queryClient.invalidateQueries({ queryKey: ["profit-summary", serverId] });
    },
  });
}
