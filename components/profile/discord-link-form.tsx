"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateDiscordId } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/client";
import type { AuthUser } from "@/lib/api/types";

const discordSchema = z.object({
  discordUserId: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^\d{17,20}$/.test(value),
      "Doit être un identifiant Discord valide (uniquement des chiffres)"
    ),
});

interface DiscordLinkFormProps {
  user: AuthUser;
}

// Indépendant du reste du profil : sert uniquement au bot Discord pour cibler
// le DM de notification de respawn.
export function DiscordLinkForm({ user }: DiscordLinkFormProps) {
  const updateDiscordId = useUpdateDiscordId();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<z.infer<typeof discordSchema>>({
    resolver: zodResolver(discordSchema),
    values: { discordUserId: user.discordUserId ?? "" },
  });

  async function onSubmit(values: z.infer<typeof discordSchema>) {
    try {
      await updateDiscordId.mutateAsync(values.discordUserId === "" ? null : values.discordUserId);
      toast.success(values.discordUserId === "" ? "Compte Discord délié" : "Compte Discord lié");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Mise à jour impossible");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1.5">
      <Label htmlFor="discordUserId">Identifiant Discord</Label>
      <div className="flex gap-2">
        <Input
          id="discordUserId"
          type="text"
          inputMode="numeric"
          placeholder="Ex. 123456789012345678"
          className="flex-1"
          {...register("discordUserId")}
        />
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "..." : "Enregistrer"}
        </Button>
      </div>
      <div className="text-xs text-muted-foreground">
        <p>
          Pour recevoir un message privé Discord quand un archimonstre que tu as tué redevient
          disponible. Laisse vide pour délier ton compte.
        </p>
        <p className="mt-1">
          Pour trouver ton identifiant : dans Discord, <strong>Paramètres utilisateur</strong> →{" "}
          <strong>Avancés</strong> → active le <strong>Mode développeur</strong>, puis fais un clic
          droit sur ton pseudo → <strong>Copier l&apos;ID utilisateur</strong>.
        </p>
      </div>
    </form>
  );
}
