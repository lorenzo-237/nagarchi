"use client";

import { CopyIcon } from "lucide-react";
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

// Pour se placer premier vendeur sur l'HDV en jeu, on copie le prix moins 1.
async function copyUndercutPrice(price: number) {
  const undercut = price - 1;
  try {
    await navigator.clipboard.writeText(String(undercut));
    toast.success(`${undercut.toLocaleString("fr-FR")} copié`);
  } catch {
    toast.error("Impossible de copier le prix");
  }
}

const priceSchema = z.object({
  // Autorise de coller un prix copié depuis le jeu ("305 990") : les espaces
  // (normaux ou insécables) sont retirés avant conversion.
  price: z
    .string()
    .transform((value) => value.replace(/\s/g, ""))
    .transform((value) => (value === "" ? null : Number(value)))
    .refine((value) => value === null || Number.isFinite(value), "Doit être un nombre")
    .refine((value) => value === null || value >= 0, "Doit être positif"),
});

interface ArchimonsterPriceFormProps {
  archimonster: ArchimonsterListItem;
  serverId: string;
}

// Une simple info communautaire, indépendante du reste : ne touche jamais la
// réapparition ni le dernier kill.
export function ArchimonsterPriceForm({ archimonster, serverId }: ArchimonsterPriceFormProps) {
  const updateArchimonster = useUpdateArchimonster(serverId);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<z.input<typeof priceSchema>, unknown, z.output<typeof priceSchema>>({
    resolver: zodResolver(priceSchema),
    defaultValues: { price: archimonster.price?.toString() ?? "" },
  });

  async function onSubmit(values: z.output<typeof priceSchema>) {
    try {
      await updateArchimonster.mutateAsync({ archimonsterId: archimonster.id, price: values.price });
      toast.success("Prix mis à jour");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Mise à jour impossible");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1.5">
      <Label htmlFor="price">Prix actuel (K)</Label>
      <div className="flex gap-2">
        <Input id="price" type="text" inputMode="numeric" className="flex-1" {...register("price")} />
        {archimonster.price !== null && (
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Copier le prix -1 kamas"
            title="Copier le prix -1 kamas (pour l'HDV)"
            onClick={() => copyUndercutPrice(archimonster.price!)}
          >
            <CopyIcon />
          </Button>
        )}
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
