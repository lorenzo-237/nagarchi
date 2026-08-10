"use client";

import Link from "next/link";
import { UserIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-auth";

export function UserMenu() {
  const { data: user } = useCurrentUser();
  const initials = user?.pseudo.slice(0, 2).toUpperCase();

  return (
    <Link
      href="/profile"
      aria-label="Voir mon profil"
      className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
    >
      <Avatar className="size-8">
        <AvatarFallback>{initials || <UserIcon className="size-4" />}</AvatarFallback>
      </Avatar>
    </Link>
  );
}
