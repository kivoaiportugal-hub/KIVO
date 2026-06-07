"use client";

import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { resetPassword } from "@/features/auth/actions";
import type { AuthFormState } from "@/features/auth/types";
import { initialAuthState } from "@/features/auth/types";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    async (_prev: AuthFormState, formData: FormData) => {
      const result = await resetPassword(formData);
      if (result?.error) {
        return { error: result.error, success: false };
      }
      if (result?.redirectTo) {
        router.push(result.redirectTo);
      }
      return { error: "", success: true };
    },
    initialAuthState
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-primary">K</span>ivo
          </h1>
          <p className="text-sm text-muted-foreground">
            Define a tua nova password.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
          {state.error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Nova Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="Mínimo 8 caracteres"
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="flex h-10 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isPending ? "A guardar..." : "Repor Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
