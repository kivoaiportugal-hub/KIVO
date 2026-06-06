import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold tracking-tight">
            <span className="text-primary">K</span>
            <span className="text-foreground">ivo</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            AI Restaurant Growth & Operations Agent
          </p>
          <p className="text-sm text-muted-foreground">
            O teu agente AI para gerir e otimizar o canal de delivery.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Começar Grátis
          </Link>
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Entrar
          </Link>
        </div>

        <div className="pt-8 flex gap-8 justify-center text-sm text-muted-foreground">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">3</div>
            <div>Plataformas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">AI</div>
            <div>Gestor Autónomo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">24/7</div>
            <div>Monitorização</div>
          </div>
        </div>
      </div>
    </div>
  );
}
