"use client"

import * as React from "react"
import { SwordsIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useUpdateArchimonster } from "@/hooks/use-archimonsters"
import { ApiError } from "@/lib/api/client"
import { cn } from "@/lib/utils"

interface ArchimonsterQuickKillButtonProps {
  archimonsterId: string
  archimonsterName: string
  serverId: string
  className?: string
}

export function ArchimonsterQuickKillButton({
  archimonsterId,
  archimonsterName,
  serverId,
  className,
}: ArchimonsterQuickKillButtonProps) {
  const [open, setOpen] = React.useState(false)
  const updateArchimonster = useUpdateArchimonster(serverId)

  function handleConfirm() {
    updateArchimonster.mutate(
      { archimonsterId, lastKilledAt: new Date().toISOString() },
      {
        onSuccess: () => {
          toast.success("Kill enregistré")
          setOpen(false)
        },
        onError: (error) =>
          toast.error(
            error instanceof ApiError
              ? error.message
              : "Impossible d'enregistrer le kill"
          ),
      }
    )
  }

  return (
    // Même raison que dans ArchimonsterHistoryButton : la Dialog reste un
    // enfant React de la card cliquable malgré le Portal, donc on coupe la
    // propagation ici pour ne pas rouvrir la sheet en fermant la modal.
    <div onClick={(event) => event.stopPropagation()}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className={cn(className)}
              aria-label="Je viens de le tuer"
            />
          }
        >
          <SwordsIcon className="text-muted-foreground" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmer le kill</DialogTitle>
            <DialogDescription>
              Enregistrer un kill de {archimonsterName}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Annuler
            </DialogClose>
            <Button
              type="button"
              disabled={updateArchimonster.isPending}
              onClick={handleConfirm}
            >
              {updateArchimonster.isPending ? "Enregistrement..." : "Confirmer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
