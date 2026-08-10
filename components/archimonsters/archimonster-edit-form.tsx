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
import { isToday, todayAtTime, toHHmm } from "@/lib/respawn";

function numberField() {
  return z
    .string()
    .transform((value) => (value.trim() === "" ? null : Number(value)))
    .refine((value) => value === null || Number.isFinite(value), "Doit être un nombre")
    .refine((value) => value === null || value >= 0, "Doit être positif");
}

const editSchema = z.object({
  price: numberField(),
  respawnHours: numberField(),
  lastKilledTime: z.string().optional(),
});

interface ArchimonsterEditFormProps {
  archimonster: ArchimonsterListItem;
  serverId: string;
  onSuccess: () => void;
}

export function ArchimonsterEditForm({
  archimonster,
  serverId,
  onSuccess,
}: ArchimonsterEditFormProps) {
  const updateArchimonster = useUpdateArchimonster(serverId);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<z.input<typeof editSchema>, unknown, z.output<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      price: archimonster.price?.toString() ?? "",
      respawnHours: archimonster.respawnHours?.toString() ?? "",
      lastKilledTime:
        archimonster.lastKilledAt && isToday(archimonster.lastKilledAt)
          ? toHHmm(archimonster.lastKilledAt)
          : "",
    },
  });

  async function onSubmit(values: z.output<typeof editSchema>) {
    try {
      await updateArchimonster.mutateAsync({
        archimonsterId: archimonster.id,
        price: values.price,
        respawnHours: values.respawnHours,
        lastKilledAt: values.lastKilledTime ? todayAtTime(values.lastKilledTime) : undefined,
      });
      toast.success("Archimonstre mis à jour");
      onSuccess();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Mise à jour impossible");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="price">Prix actuel (K)</Label>
        <Input id="price" type="number" min={0} {...register("price")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="respawnHours">Réapparition (heures)</Label>
        <Input id="respawnHours" type="number" min={0} step="0.5" {...register("respawnHours")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="lastKilledTime">Dernier kill (aujourd&apos;hui, heure)</Label>
        <Input id="lastKilledTime" type="time" {...register("lastKilledTime")} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
