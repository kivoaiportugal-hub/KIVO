export type OnboardingStep =
  | "restaurant"
  | "platforms"
  | "volume"
  | "team"
  | "challenges"
  | "results";

export const ONBOARDING_STEPS: OnboardingStep[] = [
  "restaurant",
  "platforms",
  "volume",
  "team",
  "challenges",
  "results",
];

export const STEP_TITLES: Record<OnboardingStep, { pt: string; en: string }> = {
  restaurant: { pt: "Restaurante", en: "Restaurant" },
  platforms: { pt: "Plataformas", en: "Platforms" },
  volume: { pt: "Volume", en: "Volume" },
  team: { pt: "Equipa", en: "Team" },
  challenges: { pt: "Desafios", en: "Challenges" },
  results: { pt: "Resultados", en: "Results" },
};

export const STEP_ICONS: Record<OnboardingStep, string> = {
  restaurant: "🍽️",
  platforms: "📱",
  volume: "📦",
  team: "👥",
  challenges: "⚡",
  results: "🎯",
};

export const CUISINE_TYPES = [
  "Restaurante Geral",
  "Fast Food / Burger",
  "Pizza",
  "Sushi / Japonês",
  "Chinesa",
  "Indiana",
  "Mediterrânica / Árabe",
  "Italiana",
  "Pastelaria / Café",
  "Saudável / Vegano",
  "Francesinha / Bistrô",
  "Marisco / Peixe",
  "Churrascaria",
  "Outro",
] as const;

export const CITIES = [
  "Lisboa",
  "Porto",
  "Braga",
  "Faro",
  "Coimbra",
  "Setúbal",
  "Leiria",
  "Aveiro",
  "Viseu",
  "Guimarães",
  "Outra",
] as const;

export const DELIVERY_PLATFORMS = [
  { id: "uber_eats", name: "Uber Eats", color: "#06C167" },
  { id: "glovo", name: "Glovo", color: "#000000" },
  { id: "bolt_food", name: "Bolt Food", color: "#2DB5A0" },
  { id: "own_app", name: "App própria", color: "#187906" },
] as const;

export const VOLUME_RANGES = [
  { id: "small", label: "1–30 pedidos/dia", min: 1, max: 30 },
  { id: "medium", label: "31–100 pedidos/dia", min: 31, max: 100 },
  { id: "large", label: "101–300 pedidos/dia", min: 101, max: 300 },
  { id: "enterprise", label: "300+ pedidos/dia", min: 301, max: 9999 },
] as const;

export const TEAM_SIZES = [
  { id: "solo", label: "1–2 pessoas", min: 1, max: 2 },
  { id: "small", label: "3–5 pessoas", min: 3, max: 5 },
  { id: "medium", label: "6–15 pessoas", min: 6, max: 15 },
  { id: "large", label: "16+ pessoas", min: 16, max: 999 },
] as const;

export const CHALLENGES = [
  { id: "margins", label: "Margens apertadas", icon: "💰" },
  { id: "reviews", label: "Avaliações negativas", icon: "⭐" },
  { id: "visibility", label: "Pouca visibilidade", icon: "👁️" },
  { id: "competitors", label: "Muitos concorrentes", icon: "⚔️" },
  { id: "operations", label: "Operações desorganizadas", icon: "📋" },
  { id: "pricing", label: "Dificuldade em definir preços", icon: "💸" },
  { id: "promotions", label: "Não sei criar promoções", icon: "🎯" },
  { id: "time", label: "Falta de tempo", icon: "⏰" },
  { id: "data", label: "Não analiso dados", icon: "📊" },
  { id: "automation", label: "Quero automatizar tudo", icon: "🤖" },
] as const;

export interface OnboardingData {
  restaurantName: string;
  cuisineType: string;
  city: string;
  platforms: string[];
  dailyOrders: string;
  monthlyRevenue: string;
  avgTicket: string;
  teamSize: string;
  hasDeliveryManager: boolean;
  challenges: string[];
}

export const initialOnboardingData: OnboardingData = {
  restaurantName: "",
  cuisineType: "",
  city: "",
  platforms: [],
  dailyOrders: "",
  monthlyRevenue: "",
  avgTicket: "",
  teamSize: "",
  hasDeliveryManager: false,
  challenges: [],
};

export function calculateMaturityScore(data: OnboardingData): number {
  let score = 0;

  // Platform connectivity (0-25)
  score += Math.min(data.platforms.length * 8, 25);

  // Volume (0-20)
  const vol = VOLUME_RANGES.find((v) => v.id === data.dailyOrders);
  if (vol) {
    if (vol.id === "enterprise") score += 20;
    else if (vol.id === "large") score += 15;
    else if (vol.id === "medium") score += 10;
    else score += 5;
  }

  // Revenue (0-15)
  const rev = Number(data.monthlyRevenue);
  if (rev >= 50000) score += 15;
  else if (rev >= 20000) score += 12;
  else if (rev >= 10000) score += 8;
  else if (rev > 0) score += 4;

  // Team (0-15)
  const team = TEAM_SIZES.find((t) => t.id === data.teamSize);
  if (team) {
    if (team.id === "large") score += 15;
    else if (team.id === "medium") score += 12;
    else if (team.id === "small") score += 8;
    else score += 4;
  }

  // Delivery manager (0-10)
  if (data.hasDeliveryManager) score += 10;

  // Challenges identified (0-15) — having challenges is a signal of awareness
  score += Math.min(data.challenges.length * 3, 15);

  return Math.min(score, 100);
}

export function getRecommendedPlan(score: number): "start" | "grow" | "autopilot" {
  if (score >= 66) return "autopilot";
  if (score >= 31) return "grow";
  return "start";
}
