"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/api/client";
import type { AuthUser } from "@/lib/api/types";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => apiGet<AuthUser>("/api/proxy/auth/me"),
    retry: false,
  });
}

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  email: string;
  pseudo: string;
  password: string;
  serverIds: string[];
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginInput) => apiPost("/api/auth/login", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth", "me"] }),
  });
}

export function useRegister() {
  // Le compte créé est en attente de validation : pas de session ouverte,
  // donc rien à invalider dans le cache.
  return useMutation({
    mutationFn: (input: RegisterInput) => apiPost("/api/auth/register", input),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiPost("/api/auth/logout"),
    onSuccess: () => queryClient.clear(),
  });
}
