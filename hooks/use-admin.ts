"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPost } from "@/lib/api/client";
import type { AdminKillEvent, AdminPriceEvent, AdminUser, PendingUser } from "@/lib/api/types";

export function usePendingUsers() {
  return useQuery({
    queryKey: ["admin", "pending-users"],
    queryFn: () => apiGet<PendingUser[]>("/api/proxy/admin/users/pending"),
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => apiGet<AdminUser[]>("/api/proxy/admin/users"),
  });
}

export function useApproveUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => apiPost(`/api/proxy/admin/users/${userId}/approve`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin"] }),
  });
}

export function useRejectUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => apiDelete(`/api/proxy/admin/users/${userId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin"] }),
  });
}

export function useRevokeUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => apiPost(`/api/proxy/admin/users/${userId}/revoke`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin"] }),
  });
}

export function useAdminKillEvents(serverId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "kills", serverId],
    queryFn: () => apiGet<AdminKillEvent[]>(`/api/proxy/admin/kills?serverId=${serverId}`),
    enabled: Boolean(serverId),
  });
}

// Une suppression admin peut changer la valeur "actuelle" d'un archimonstre
// (lastKilledAt recalculé côté API) et cascader sur une vente liée : on
// invalide tout ce qui pourrait en dépendre, pas seulement la liste admin.
function invalidateAfterKillOrPriceDelete(
  queryClient: ReturnType<typeof useQueryClient>,
  serverId: string | undefined
) {
  queryClient.invalidateQueries({ queryKey: ["admin"] });
  queryClient.invalidateQueries({ queryKey: ["archimonsters", serverId] });
  queryClient.invalidateQueries({ queryKey: ["kills", serverId] });
  queryClient.invalidateQueries({ queryKey: ["prices", serverId] });
  queryClient.invalidateQueries({ queryKey: ["kill-feed", serverId] });
  queryClient.invalidateQueries({ queryKey: ["profit-summary", serverId] });
}

export function useDeleteAdminKillEvent(serverId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (killEventId: string) => apiDelete(`/api/proxy/admin/kills/${killEventId}`),
    onSuccess: () => invalidateAfterKillOrPriceDelete(queryClient, serverId),
  });
}

export function useAdminPriceEvents(serverId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "prices", serverId],
    queryFn: () => apiGet<AdminPriceEvent[]>(`/api/proxy/admin/prices?serverId=${serverId}`),
    enabled: Boolean(serverId),
  });
}

export function useDeleteAdminPriceEvent(serverId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (priceEventId: string) => apiDelete(`/api/proxy/admin/prices/${priceEventId}`),
    onSuccess: () => invalidateAfterKillOrPriceDelete(queryClient, serverId),
  });
}
