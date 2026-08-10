"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPost } from "@/lib/api/client";
import type { AdminUser, PendingUser } from "@/lib/api/types";

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
