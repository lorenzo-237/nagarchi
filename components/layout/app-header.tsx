"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldIcon } from "lucide-react";

import { ServerSwitcher } from "@/components/layout/server-switcher";
import { UserMenu } from "@/components/layout/user-menu";
import { buttonVariants } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-auth";

export function AppHeader() {
  const { data: user } = useCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-heading text-base font-semibold">
          <Image src="/assets/favicon.svg" alt="" width={28} height={28} className="rounded-lg" />
          Nagarchi
        </Link>

        <div className="flex items-center gap-3">
          {user?.isAdmin && (
            <Link href="/admin" aria-label="Administration" className={buttonVariants({ variant: "ghost", size: "icon-sm" })}>
              <ShieldIcon />
            </Link>
          )}
          <ServerSwitcher />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
