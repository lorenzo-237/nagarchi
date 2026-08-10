"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MailCheckIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  const [registered, setRegistered] = React.useState(false);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-4">
      <Image src="/assets/favicon.svg" alt="Nagarchi" width={56} height={56} className="rounded-2xl" />
      <Card className="w-full max-w-sm">
        {registered ? (
          <CardContent className="flex flex-col items-center gap-3 text-center">
            <MailCheckIcon className="size-10 text-primary" />
            <CardTitle>Inscription enregistrée</CardTitle>
            <CardDescription>
              Un administrateur doit valider ton compte avant que tu puisses te connecter.
            </CardDescription>
            <Link href="/login" className={buttonVariants({ className: "mt-2" })}>
              Retour à la connexion
            </Link>
          </CardContent>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Inscription</CardTitle>
              <CardDescription>Crée ton compte et choisis ton/tes serveur(s).</CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm onRegistered={() => setRegistered(true)} />
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Déjà inscrit ?{" "}
                <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                  Se connecter
                </Link>
              </p>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
