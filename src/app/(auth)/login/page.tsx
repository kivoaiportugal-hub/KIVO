import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-primary">K</span>ivo
          </h1>
          <p className="text-sm text-muted-foreground">
            Entra na tua conta para continuar.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="teu@email.com"
              className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <button className="flex h-10 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Entrar
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Não tens conta?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Regista-te grátis
          </Link>
        </p>
      </div>
    </div>
  );
}
