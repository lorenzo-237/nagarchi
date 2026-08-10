"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPost } from "@/lib/api/client";
import type { PendingUser } from "@/lib/api/types";

export function usePendingUsers() {
  return useQuery({
    queryKey: ["admin", "pending-users"],
    queryFn: () => apiGet<PendingUser[]>("/api/proxy/admin/users/pending"),
  });
}

export function useApproveUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => apiPost(`/api/proxy/admin/users/${userId}/approve`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "pending-users"] }),
  });
}

export function useRejectUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => apiDelete(`/api/proxy/admin/users/${userId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "pending-users"] }),
  });
}
