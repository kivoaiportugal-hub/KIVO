import Link from "next/link";
import { PLANS } from "@/lib/constants";

export default function MarketingHomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">
              <span className="mr-2 text-primary">🚀</span>
              AI para Restaurantes Delivery
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              O teu restaurante{" "}
              <span className="text-primary">merece melhor</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              O Kivo é um agente de IA que gere e otimiza automaticamente o canal
              de delivery. Analisa vendas, otimiza preços, sugere promoções e
              executa ações — tudo em tempo real.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                Começar Grátis — 14 dias
              </Link>
              <Link
                href="/marketing/features"
                className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Saber Mais
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Logos / Social Proof */}
      <section className="border-y bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <span>Integra com:</span>
            <span className="font-medium text-foreground">Uber Eats</span>
            <span className="font-medium text-foreground">Glovo</span>
            <span className="font-medium text-foreground">Bolt Food</span>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Como funciona
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Três passos simples para transformar o teu delivery.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Liga as plataformas",
                description:
                  "Connect Uber Eats, Glovo e Bolt Food em menos de 2 minutos. Sem código, sem complicação.",
              },
              {
                step: "02",
                title: "A IA analisa tudo",
                description:
                  "O Kivo processa vendas, menu, preços e avaliações. Identifica padrões e oportunidades.",
              },
              {
                step: "03",
                title: "Recebe e executa",
                description:
                  "Insights, alertas e ações recomendadas no dashboard ou WhatsApp. Tu decides — ou a IA executa.",
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Tudo o que precisas para vender mais
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              O Kivo não é um dashboard. É um gestor digital que transforma dados
              em decisões.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "🧠",
                title: "AI Insight",
                description:
                  "Recebe insights acionáveis em tempo real. Sabes sempre o que está a acontecer e porquê.",
              },
              {
                icon: "🎯",
                title: "Next Best Action",
                description:
                  "Uma única ação recomendada com impacto estimado. Sem overload, só decisões.",
              },
              {
                icon: "🍔",
                title: "Menu Intelligence",
                description:
                  "Cada produto é uma unidade económica. Sabes a margem, performance e o que fazer.",
              },
              {
                icon: "💸",
                title: "Pricing Engine",
                description:
                  "Simula aumentos de preço e vê o impacto real em euros antes de decidir.",
              },
              {
                icon: "🤖",
                title: "Autopilot",
                description:
                  "Define regras e a IA executa automaticamente. Promoções, preços, reações.",
              },
              {
                icon: "📱",
                title: "WhatsApp",
                description:
                  "Recebe alertas, resumos e toma decisões diretamente no WhatsApp.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border bg-card p-6 shadow-sm"
              >
                <div className="mb-4 text-3xl">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="border-t bg-muted/30 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Planos para cada momento
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Começa grátis. Evolui quando estiveres pronto.
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {Object.values(PLANS).map((plan) => (
              <div
                key={plan.id}
                className={`rounded-lg border bg-card p-8 shadow-sm ${
                  plan.id === "grow" ? "border-primary ring-2 ring-primary/20" : ""
                }`}
              >
                {plan.id === "grow" && (
                  <div className="mb-4 inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Mais Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-foreground">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.tagline}
                </p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-foreground">
                    €{plan.price}
                  </span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-0.5 text-primary">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`mt-8 flex h-10 w-full items-center justify-center rounded-md text-sm font-medium transition-colors ${
                    plan.id === "grow"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  Começar
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Perguntas frequentes
            </h2>
          </div>
          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {[
              {
                q: "Preciso de saber programar?",
                a: "Não. O Kivo é 100% self-service. Liga as plataformas, responde ao questionário e a IA faz o resto.",
              },
              {
                q: "Funciona com o meu restaurante?",
                a: "Sim, se estás no Uber Eats, Glovo ou Bolt Food. O Kivo suporta qualquer tipo de cozinha e tamanho de restaurante em Portugal.",
              },
              {
                q: "Quanto tempo demora a ver resultados?",
                a: "Os primeiros insights aparecem em 24-48 horas. Recomendações de preço e promoções em 3-5 dias. Impacto real em 2-4 semanas.",
              },
              {
                q: "Posso cancelar a qualquer momento?",
                a: "Sim. Sem fidelização, sem taxas de cancelamento. Cancela quando quiseres.",
              },
              {
                q: "Os meus dados estão seguros?",
                a: "Sim. Utilizamos Supabase (PostgreSQL) com encriptação, RLS e hospedagem na UE. Não partilhamos dados com terceiros.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-lg border bg-card p-6 shadow-sm"
              >
                <h3 className="font-semibold text-foreground">{item.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-primary p-8 sm:p-12 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
              Pronto para otimizar o teu delivery?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              Começa o teu trial grátis de 14 dias. Sem cartão de crédito. Sem
              compromisso.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-background px-8 text-sm font-medium text-foreground shadow transition-colors hover:bg-background/90"
            >
              Começar Agora
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
