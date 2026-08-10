"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateArchimonster } from "@/hooks/use-archimonsters";
import { ApiError } from "@/lib/api/client";
import type { ArchimonsterListItem } from "@/lib/api/types";

const respawnSchema = z.object({
  respawnHours: z
    .string()
    .transform((value) => (value.trim() === "" ? null : Number(value)))
    .refine((value) => value === null || Number.isFinite(value), "Doit être un nombre")
    .refine((value) => value === null || value >= 0, "Doit être positif"),
});

interface ArchimonsterRespawnFormProps {
  archimonster: ArchimonsterListItem;
  serverId: string;
}

// Indépendant du prix et du dernier kill : change juste l'intervalle utilisé
// pour calculer le créneau de réapparition.
export function ArchimonsterRespawnForm({ archimonster, serverId }: ArchimonsterRespawnFormProps) {
  const updateArchimonster = useUpdateArchimonster(serverId);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<z.input<typeof respawnSchema>, unknown, z.output<typeof respawnSchema>>({
    resolver: zodResolver(respawnSchema),
    defaultValues: { respawnHours: archimonster.respawnHours?.toString() ?? "" },
  });

  async function onSubmit(values: z.output<typeof respawnSchema>) {
    try {
      await updateArchimonster.mutateAsync({
        archimonsterId: archimonster.id,
        respawnHours: values.respawnHours,
      });
      toast.success("Réapparition mise à jour");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Mise à jour impossible");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1.5">
      <Label htmlFor="respawnHours">Réapparition (heures)</Label>
      <div className="flex gap-2">
        <Input
          id="respawnHours"
          type="number"
          min={0}
          step="0.5"
          className="flex-1"
          {...register("respawnHours")}
        />
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
