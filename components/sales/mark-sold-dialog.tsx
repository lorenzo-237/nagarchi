"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateSale } from "@/hooks/use-sales";
import { ApiError } from "@/lib/api/client";

const saleSchema = z.object({
  // Autorise de coller un montant copié depuis le jeu ("305 990") : les
  // espaces (normaux ou insécables) sont retirés avant conversion.
  amount: z
    .string()
    .transform((value) => Number(value.replace(/\s/g, "")))
    .refine((value) => Number.isFinite(value) && value > 0, "Doit être un nombre positif"),
});

interface MarkSoldDialogProps {
  killEventId: string;
  serverId: string;
  archimonsterName: string;
}

export function MarkSoldDialog({ killEventId, serverId, archimonsterName }: MarkSoldDialogProps) {
  const [open, setOpen] = React.useState(false);
  const createSale = useCreateSale(serverId);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<z.input<typeof saleSchema>, unknown, z.output<typeof saleSchema>>({
    resolver: zodResolver(saleSchema),
    defaultValues: { amount: "" },
  });

  async function onSubmit(values: z.output<typeof saleSchema>) {
    try {
      await createSale.mutateAsync({ killEventId, amount: values.amount });
      toast.success("Vente enregistrée");
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Impossible d'enregistrer la vente");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" size="sm" variant="outline" />}>
        Marquer comme vendu
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vente — {archimonsterName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="amount">Prix de vente (K)</Label>
            <Input id="amount" type="text" inputMode="numeric" autoFocus {...register("amount")} />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Confirmer la vente"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
