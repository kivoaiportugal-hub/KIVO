export const APP_NAME = "Kivo";
export const APP_DESCRIPTION =
  "AI Restaurant Growth & Operations Agent — O teu agente AI para gerir e otimizar o canal de delivery.";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://kivo.ai";

export const PLANS = {
  start: {
    id: "start",
    name: "Start",
    tagline: "O teu copiloto de delivery",
    price: 39,
    priceYearly: 390,
    features: [
      "WhatsApp AI (chat + respostas)",
      "Resumos diários e semanais",
      "Insights de performance",
      "Análise de vendas por plataforma",
      "Identificação de problemas",
    ],
    limits: {
      max_platforms: 3,
      max_menu_items: 100,
      data_retention_days: 90,
      ai_queries_per_day: 50,
    },
  },
  grow: {
    id: "grow",
    name: "Grow",
    tagline: "O teu gestor de delivery semi-automático",
    price: 99,
    priceYearly: 990,
    features: [
      "Tudo do Start",
      "Recomendações de preços",
      "Sugestões de promoções automáticas",
      "Menu intelligence completo",
      "Simulador de impacto (€)",
      "Alertas proativos no WhatsApp",
      "Botões de ação",
    ],
    limits: {
      max_platforms: 5,
      max_menu_items: 500,
      data_retention_days: 365,
      ai_queries_per_day: 200,
    },
  },
  autopilot: {
    id: "autopilot",
    name: "Autopilot",
    tagline: "O teu operador de negócio de delivery",
    price: 299,
    priceYearly: 2990,
    features: [
      "Tudo do Grow",
      "Execução automática de ações",
      "Ajuste dinâmico de preços",
      "Gestão automática de promoções",
      "Otimização contínua de margem",
      "Reação automática a quedas",
      "Regras personalizadas",
    ],
    limits: {
      max_platforms: 10,
      max_menu_items: -1,
      data_retention_days: -1,
      ai_queries_per_day: -1,
    },
  },
} as const;

export type PlanId = keyof typeof PLANS;

export const PLATFORMS = {
  uber_eats: { name: "Uber Eats", color: "#06C167", icon: "uber-eats" },
  glovo: { name: "Glovo", color: "#000000", icon: "glovo" },
  bolt_food: { name: "Bolt Food", color: "#2DB5A0", icon: "bolt-food" },
} as const;

export type PlatformId = keyof typeof PLATFORMS;
