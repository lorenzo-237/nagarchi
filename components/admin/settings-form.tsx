"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppSettings, useUpdateAppSettings } from "@/hooks/use-settings";
import { ApiError } from "@/lib/api/client";

const settingsSchema = z.object({
  maxKillsPerDay: z
    .string()
    .transform((value) => Number(value))
    .refine((value) => Number.isInteger(value) && value >= 1 && value <= 50, {
      message: "Doit être un entier entre 1 et 50",
    }),
});

export function SettingsForm() {
  const { data: settings, isLoading } = useAppSettings();
  const updateSettings = useUpdateAppSettings();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<z.input<typeof settingsSchema>, unknown, z.output<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    values: { maxKillsPerDay: settings ? String(settings.maxKillsPerDay) : "" },
  });

  async function onSubmit(values: z.output<typeof settingsSchema>) {
    try {
      await updateSettings.mutateAsync(values.maxKillsPerDay);
      toast.success("Réglages enregistrés");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Impossible d'enregistrer les réglages");
    }
  }

  if (isLoading) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="maxKillsPerDay">Kills max par jour affichés sur le graphique</Label>
        <Input
          id="maxKillsPerDay"
          type="number"
          min={1}
          max={50}
          className="max-w-32"
          {...register("maxKillsPerDay")}
        />
        <p className="text-xs text-muted-foreground">
          Sert de repère (ligne en pointillés) sur le graphique d&apos;historique des kills d&apos;un
          archimonstre.
        </p>
      </div>

      <Button type="submit" className="w-fit" disabled={isSubmitting}>
        {isSubmitting ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
