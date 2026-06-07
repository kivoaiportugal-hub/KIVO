"use client";

import Link from "next/link";
import { useActionState } from "react";
import { forgotPassword } from "@/features/auth/actions";
import type { AuthFormState } from "@/features/auth/types";
import { initialAuthState } from "@/features/auth/types";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: AuthFormState, formData: FormData) => {
      const result = await forgotPassword(formData);
      if (result?.error) {
        return { error: result.error, success: false };
      }
      return { error: "", success: true };
    },
    initialAuthState
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-primary">K</span>ivo
            </h1>
          </Link>
          <p className="text-sm text-muted-foreground">
            Enviámos um email com instruções para repor a password.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
          {state.error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          {state.success ? (
            <div className="rounded-md bg-primary/10 p-3 text-sm text-primary">
              Email enviado! Verifica a tua caixa de entrada.
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="teu@email.com"
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="flex h-10 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {isPending ? "A enviar..." : "Enviar Email"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Lembrou-te da password?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Entra
          </Link>
        </p>
      </div>
    </div>
  );
}
