"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useRegister } from "@/hooks/use-auth";
import { useServers } from "@/hooks/use-servers";
import { ApiError } from "@/lib/api/client";

const registerSchema = z.object({
  email: z.string().trim().email("Adresse email invalide"),
  pseudo: z.string().trim().min(3, "3 caractères minimum").max(32, "32 caractères maximum"),
  password: z.string().min(8, "8 caractères minimum"),
  serverIds: z.array(z.string()).min(1, "Sélectionne au moins un serveur"),
});

type RegisterValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onRegistered: () => void;
}

export function RegisterForm({ onRegistered }: RegisterFormProps) {
  const registerUser = useRegister();
  const { data: servers, isLoading: serversLoading } = useServers();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { serverIds: [] },
  });

  async function onSubmit(values: RegisterValues) {
    try {
      await registerUser.mutateAsync(values);
      onRegistered();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Inscription impossible");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="pseudo">Pseudo</Label>
        <Input id="pseudo" autoComplete="username" {...register("pseudo")} />
        {errors.pseudo && <p className="text-sm text-destructive">{errors.pseudo.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
        />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Serveur(s)</Label>
        {serversLoading && (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        )}
        {servers && servers.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun serveur disponible pour le moment.</p>
        )}
        {servers && servers.length > 0 && (
          <Controller
            control={control}
            name="serverIds"
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                {servers.map((server) => {
                  const checked = field.value.includes(server.id);
                  return (
                    <label
                      key={server.id}
                      htmlFor={`server-${server.id}`}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Checkbox
                        id={`server-${server.id}`}
                        checked={checked}
                        onCheckedChange={(value) => {
                          const isChecked = value === true;
                          field.onChange(
                            isChecked
                              ? [...field.value, server.id]
                              : field.value.filter((id) => id !== server.id)
                          );
                        }}
                      />
                      {server.name}
                    </label>
                  );
                })}
              </div>
            )}
          />
        )}
        {errors.serverIds && <p className="text-sm text-destructive">{errors.serverIds.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? "Inscription..." : "S'inscrire"}
      </Button>
    </form>
  );
}
