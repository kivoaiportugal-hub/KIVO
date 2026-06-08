// KIVO Mock Data — Use this to populate the app with realistic data
// Import and use in development/demo mode

export const MOCK_RESTAURANT = {
  id: "mock-restaurant-001",
  user_id: "mock-user-001",
  name: "O Kivo Restaurante",
  cuisine_type: "Portuguesa",
  city: "Lisboa",
  platforms: ["uber_eats", "glovo", "bolt_food"],
  daily_orders: "31-50",
  monthly_revenue: 8500,
  avg_ticket: 12.50,
  team_size: "4-6",
  has_delivery_manager: true,
  challenges: ["Poucos pedidos", "Margens baixas"],
  onboarding_score: 72,
  onboarding_plan: "grow",
  onboarding_completed: true,
  whatsapp_phone: "+351 912 345 678",
  created_at: "2026-01-15T10:00:00Z",
  updated_at: "2026-06-01T10:00:00Z",
};

export const MOCK_MENU_ITEMS = [
  { id: "mi-001", restaurant_id: "mock-restaurant-001", name: "Francesinha Clássica", category: "Pratos", price: 14.50, cost: 5.20, orders_count: 87, revenue: 1261.50, trend_pct: 12, is_active: true },
  { id: "mi-002", restaurant_id: "mock-restaurant-001", name: "Burger Kivo", category: "Pratos", price: 12.00, cost: 4.80, orders_count: 65, revenue: 780.00, trend_pct: 8, is_active: true },
  { id: "mi-003", restaurant_id: "mock-restaurant-001", name: "Salada Caesar", category: "Pratos", price: 9.50, cost: 3.10, orders_count: 42, revenue: 399.00, trend_pct: -5, is_active: true },
  { id: "mi-004", restaurant_id: "mock-restaurant-001", name: "Pizza Margherita", category: "Pizzas", price: 11.00, cost: 3.50, orders_count: 38, revenue: 418.00, trend_pct: 3, is_active: true },
  { id: "mi-005", restaurant_id: "mock-restaurant-001", name: "Bacalhau à Brás", category: "Pratos", price: 13.50, cost: 5.80, orders_count: 35, revenue: 472.50, trend_pct: 15, is_active: true },
  { id: "mi-006", restaurant_id: "mock-restaurant-001", name: "Sobremesa do Dia", category: "Sobremesas", price: 6.50, cost: 1.80, orders_count: 28, revenue: 182.00, trend_pct: 0, is_active: true },
  { id: "mi-007", restaurant_id: "mock-restaurant-001", name: "Arroz de Pato", category: "Pratos", price: 12.50, cost: 4.50, orders_count: 22, revenue: 275.00, trend_pct: -8, is_active: true },
  { id: "mi-008", restaurant_id: "mock-restaurant-001", name: "Água Mineral", category: "Bebidas", price: 1.50, cost: 0.30, orders_count: 120, revenue: 180.00, trend_pct: 2, is_active: true },
  { id: "mi-009", restaurant_id: "mock-restaurant-001", name: "Coca-Cola", category: "Bebidas", price: 2.50, cost: 0.80, orders_count: 95, revenue: 237.50, trend_pct: 1, is_active: true },
  { id: "mi-010", restaurant_id: "mock-restaurant-001", name: "Bifana", category: "Pratos", price: 8.00, cost: 2.90, orders_count: 18, revenue: 144.00, trend_pct: -12, is_active: true },
];

export const MOCK_ORDERS = Array.from({ length: 150 }, (_, i) => {
  const daysAgo = Math.floor(Math.random() * 30);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(9 + Math.floor(Math.random() * 14), Math.floor(Math.random() * 60));

  return {
    id: `order-${i}`,
    restaurant_id: "mock-restaurant-001",
    platform: ["uber_eats", "glovo", "bolt_food"][Math.floor(Math.random() * 3)],
    total: Math.round((8 + Math.random() * 15) * 100) / 100,
    items: [
      { name: MOCK_MENU_ITEMS[Math.floor(Math.random() * MOCK_MENU_ITEMS.length)].name, quantity: 1 + Math.floor(Math.random() * 3), price: 8 + Math.random() * 7 },
    ],
    status: "delivered",
    ordered_at: date.toISOString(),
    delivered_at: new Date(date.getTime() + 25 * 60000).toISOString(),
    created_at: date.toISOString(),
  };
});

export const MOCK_REVIEWS = [
  { id: "rev-001", restaurant_id: "mock-restaurant-001", platform: "uber_eats", rating: 5, text: "Comida excelente! Entrega rápida. Recomendo a todos!", author_name: "João Silva", sentiment: "positive", responded: false, reviewed_at: "2026-06-01T14:30:00Z" },
  { id: "rev-002", restaurant_id: "mock-restaurant-001", platform: "glovo", rating: 2, text: "Demorou 1 hora. Pizza completamente fria. Mau serviço.", author_name: "Maria Costa", sentiment: "negative", responded: false, reviewed_at: "2026-06-01T12:00:00Z" },
  { id: "rev-003", restaurant_id: "mock-restaurant-001", platform: "uber_eats", rating: 4, text: "Bom restaurante, mas a porção foi um pouco pequena para o preço.", author_name: "Pedro Santos", sentiment: "neutral", responded: true, response_text: "Obrigado pelo feedback! Vamos rever as porções.", reviewed_at: "2026-05-31T20:15:00Z" },
  { id: "rev-004", restaurant_id: "mock-restaurant-001", platform: "bolt_food", rating: 5, text: "Melhor francesinha de Lisboa! Super recomendado!", author_name: "Ana Ferreira", sentiment: "positive", responded: false, reviewed_at: "2026-05-31T19:00:00Z" },
  { id: "rev-005", restaurant_id: "mock-restaurant-001", platform: "glovo", rating: 3, text: "Normal, nada de especial. Esperava mais.", author_name: "Carlos Oliveira", sentiment: "neutral", responded: false, reviewed_at: "2026-05-30T21:30:00Z" },
  { id: "rev-006", restaurant_id: "mock-restaurant-001", platform: "uber_eats", rating: 5, text: "Adorei! A francesinha estava perfeita. Vou repetir!", author_name: "Sofia Mendes", sentiment: "positive", responded: true, response_text: "Obrigado Sofia! Esperamos vê-la em breve!", reviewed_at: "2026-05-30T18:45:00Z" },
  { id: "rev-007", restaurant_id: "mock-restaurant-001", platform: "bolt_food", rating: 1, text: "Pedido errado. Recebi coisa completamente diferente.", author_name: "Rui Almeida", sentiment: "negative", responded: false, reviewed_at: "2026-05-29T20:00:00Z" },
  { id: "rev-008", restaurant_id: "mock-restaurant-001", platform: "glovo", rating: 4, text: "Bom preço e sabor. Entrega demorou um pouco.", author_name: "Inês Rodrigues", sentiment: "neutral", responded: false, reviewed_at: "2026-05-29T13:30:00Z" },
];

export const MOCK_PROMOTIONS = [
  { id: "promo-001", restaurant_id: "mock-restaurant-001", name: "2x1 Pizzas", platform: "uber_eats", discount_type: "percentage", discount_value: 50, status: "active", orders_count: 45, revenue: 520, created_at: "2026-05-28T10:00:00Z" },
  { id: "promo-002", restaurant_id: "mock-restaurant-001", name: "Frete Grátis", platform: "all", discount_type: "fixed", discount_value: 2.50, status: "active", orders_count: 120, revenue: 1200, created_at: "2026-05-25T10:00:00Z" },
  { id: "promo-003", restaurant_id: "mock-restaurant-001", name: "Happy Hour", platform: "glovo", discount_type: "percentage", discount_value: 20, status: "inactive", orders_count: 30, revenue: 280, created_at: "2026-05-20T10:00:00Z" },
];

export const MOCK_ALERTS = [
  { id: "alert-001", restaurant_id: "mock-restaurant-001", type: "low_ratings", title: "Reviews negativos", message: "2 reviews com rating ≤2 esta semana. Responder e analisar padrões.", severity: "high", read: false, created_at: "2026-06-01T08:00:00Z" },
  { id: "alert-002", restaurant_id: "mock-restaurant-001", type: "revenue_drop", title: "Queda de receita", message: "Receita caiu 15% vs semana anterior. Considerar promoções.", severity: "high", read: false, created_at: "2026-06-01T08:00:00Z" },
  { id: "alert-003", restaurant_id: "mock-restaurant-001", type: "platform_insight", title: "Plataforma líder", message: "Uber Eats representa 62% da receita esta semana.", severity: "info", read: true, created_at: "2026-05-30T08:00:00Z" },
];

export const MOCK_AUTOPILOT_RULES = [
  { id: "rule-001", restaurant_id: "mock-restaurant-001", name: "Queda de vendas", condition_type: "sales_drop", condition_value: { threshold: 20 }, action_type: "notify", action_value: { value: "Alertar sobre queda de vendas" }, status: "active", created_at: "2026-05-20T10:00:00Z" },
  { id: "rule-002", restaurant_id: "mock-restaurant-001", name: "Margem baixa", condition_type: "low_margin", condition_value: { threshold: 30 }, action_type: "alert", action_value: { value: "Ajustar preço automaticamente" }, status: "active", created_at: "2026-05-20T10:00:00Z" },
];

// Helper to generate daily chart data
export function generateDailyRevenue(days: number = 30): Array<{ date: string; revenue: number }> {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const baseRevenue = 200 + Math.random() * 200;
    const weekendBoost = (date.getDay() === 0 || date.getDay() === 6) ? 1.3 : 1;
    data.push({
      date: date.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit" }),
      revenue: Math.round(baseRevenue * weekendBoost * 100) / 100,
    });
  }
  return data;
}

// Helper to generate hourly data
export function generateHourlyOrders(): Array<{ hour: string; orders: number }> {
  return Array.from({ length: 15 }, (_, i) => i + 9).map((hour) => {
    let baseOrders = 2;
    if (hour >= 12 && hour <= 14) baseOrders = 8; // Lunch rush
    if (hour >= 19 && hour <= 21) baseOrders = 10; // Dinner rush
    if (hour >= 15 && hour <= 17) baseOrders = 3; // Afternoon lull
    return {
      hour: `${hour}h`,
      orders: baseOrders + Math.floor(Math.random() * 3),
    };
  });
}

// Helper to generate platform pie data
export function generatePlatformData(): Array<{ name: string; value: number; count: number; color: string }> {
  return [
    { name: "Uber Eats", value: 2130, count: 57, color: "#06C167" },
    { name: "Glovo", value: 860, count: 32, color: "#000000" },
    { name: "Bolt Food", value: 460, count: 18, color: "#2DB5A0" },
  ];
}

// Helper to generate star distribution
export function generateStarDistribution(): Array<{ stars: number; count: number; percentage: number }> {
  return [
    { stars: 5, count: 45, percentage: 56 },
    { stars: 4, count: 20, percentage: 25 },
    { stars: 3, count: 8, percentage: 10 },
    { stars: 2, count: 4, percentage: 5 },
    { stars: 1, count: 3, percentage: 4 },
  ];
}
