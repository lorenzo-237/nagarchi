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

const killTimeSchema = z.object({
  lastKilledTime: z.string().min(1, "Renseigne une heure"),
});

interface ArchimonsterKillTimeFormProps {
  archimonster: ArchimonsterListItem;
  serverId: string;
}

// Sert à enregistrer un kill à une heure précise (rétroactif) — le bouton
// "tuer" couvre déjà le cas "maintenant". Indépendant du prix/réapparition.
export function ArchimonsterKillTimeForm({ archimonster, serverId }: ArchimonsterKillTimeFormProps) {
  const updateArchimonster = useUpdateArchimonster(serverId);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<z.infer<typeof killTimeSchema>>({
    resolver: zodResolver(killTimeSchema),
    defaultValues: {
      lastKilledTime:
        archimonster.lastKilledAt && isToday(archimonster.lastKilledAt)
          ? toHHmm(archimonster.lastKilledAt)
          : "",
    },
  });

  async function onSubmit(values: z.infer<typeof killTimeSchema>) {
    try {
      await updateArchimonster.mutateAsync({
        archimonsterId: archimonster.id,
        lastKilledAt: todayAtTime(values.lastKilledTime),
      });
      toast.success("Kill enregistré");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Impossible d'enregistrer le kill");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1.5">
      <Label htmlFor="lastKilledTime">Dernier kill (aujourd&apos;hui, heure)</Label>
      <div className="flex gap-2">
        <Input id="lastKilledTime" type="time" className="flex-1" {...register("lastKilledTime")} />
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
