"use client";

import { ChartLineIcon, MailCheckIcon, SettingsIcon, SwordsIcon, UsersIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type AdminSection = "pending" | "users" | "settings" | "kills" | "prices";

interface AdminNavProps {
  section: AdminSection;
  pendingCount?: number;
  onChange: (section: AdminSection) => void;
}

export function AdminNav({ section, pendingCount, onChange }: AdminNavProps) {
  return (
    <nav className="flex shrink-0 flex-row gap-1 sm:w-48 sm:flex-col">
      <Button
        type="button"
        variant={section === "pending" ? "secondary" : "ghost"}
        className="flex-1 justify-start gap-2 sm:flex-initial"
        onClick={() => onChange("pending")}
      >
        <MailCheckIcon />
        Inscriptions
        {Boolean(pendingCount) && (
          <Badge variant="secondary" className="ml-auto">
            {pendingCount}
          </Badge>
        )}
      </Button>
      <Button
        type="button"
        variant={section === "users" ? "secondary" : "ghost"}
        className="flex-1 justify-start gap-2 sm:flex-initial"
        onClick={() => onChange("users")}
      >
        <UsersIcon />
        Utilisateurs
      </Button>
      <Button
        type="button"
        variant={section === "kills" ? "secondary" : "ghost"}
        className="flex-1 justify-start gap-2 sm:flex-initial"
        onClick={() => onChange("kills")}
      >
        <SwordsIcon />
        Kills
      </Button>
      <Button
        type="button"
        variant={section === "prices" ? "secondary" : "ghost"}
        className="flex-1 justify-start gap-2 sm:flex-initial"
        onClick={() => onChange("prices")}
      >
        <ChartLineIcon />
        Prix
      </Button>
      <Button
        type="button"
        variant={section === "settings" ? "secondary" : "ghost"}
        className="flex-1 justify-start gap-2 sm:flex-initial"
        onClick={() => onChange("settings")}
      >
        <SettingsIcon />
        Paramètres
      </Button>
    </nav>
  );
}
