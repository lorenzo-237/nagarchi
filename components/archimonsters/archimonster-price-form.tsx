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

const priceSchema = z.object({
  price: z
    .string()
    .transform((value) => (value.trim() === "" ? null : Number(value)))
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
        <Input id="price" type="number" min={0} className="flex-1" {...register("price")} />
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
