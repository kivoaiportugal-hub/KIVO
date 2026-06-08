import { createAdminClient } from "@/lib/supabase/admin";

export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, { type: string; description: string; required?: boolean }>;
  execute: (params: Record<string, any>, restaurantId: string) => Promise<string>;
}

const supabase = createAdminClient();

export const TOOLS: Tool[] = [
  {
    name: "create_promotion",
    description: "Criar uma promoção no restaurante. Usa esta ferramenta quando o utilizador quiser criar uma promoção, campanha ou desconto.",
    parameters: {
      name: { type: "string", description: "Nome da promoção", required: true },
      platform: { type: "string", description: "Plataforma: 'all', 'uber_eats', 'glovo', 'bolt_food'" },
      discount_type: { type: "string", description: "Tipo: 'percentage' ou 'fixed'" },
      discount_value: { type: "number", description: "Valor do desconto (ex: 10 para 10%)" },
      description: { type: "string", description: "Descrição da promoção" },
    },
    execute: async (params, restaurantId) => {
      const { data, error } = await supabase.from("promotions").insert({
        restaurant_id: restaurantId,
        name: params.name,
        platform: params.platform || "all",
        discount_type: params.discount_type || "percentage",
        discount_value: params.discount_value || 10,
        description: params.description || "",
        status: "active",
      }).select().single();

      if (error) return `Erro ao criar promoção: ${error.message}`;
      return `Promoção "${params.name}" criada com sucesso! ${params.discount_value}${params.discount_type === "percentage" ? "%" : "€"} de desconto em ${params.platform || "todas as plataformas"}.`;
    },
  },
  {
    name: "adjust_price",
    description: "Ajustar o preço de um item do menu. Usa quando o utilizador quiser alterar o preço de um prato.",
    parameters: {
      item_name: { type: "string", description: "Nome do item do menu", required: true },
      new_price: { type: "number", description: "Novo preço em euros", required: true },
    },
    execute: async (params, restaurantId) => {
      const { data: item } = await supabase
        .from("menu_items")
        .select("id, name, price")
        .eq("restaurant_id", restaurantId)
        .ilike("name", `%${params.item_name}%`)
        .single();

      if (!item) return `Não encontrei o item "${params.item_name}" no menu.`;

      const oldPrice = item.price;
      const diff = params.new_price - oldPrice;
      const diffPct = ((diff / oldPrice) * 100).toFixed(1);

      await supabase.from("menu_items").update({ price: params.new_price }).eq("id", item.id);

      return `Preço de "${item.name}" atualizado: €${oldPrice.toFixed(2)} → €${params.new_price.toFixed(2)} (${diff >= 0 ? "+" : ""}${diffPct}%)`;
    },
  },
  {
    name: "respond_to_review",
    description: "Responder a um review/review negativo. Usa quando o utilizador quiser responder a um review.",
    parameters: {
      review_id: { type: "string", description: "ID do review" },
      response_text: { type: "string", description: "Texto da resposta", required: true },
    },
    execute: async (params, restaurantId) => {
      const { error } = await supabase
        .from("reviews")
        .update({ responded: true, response_text: params.response_text })
        .eq("id", params.review_id)
        .eq("restaurant_id", restaurantId);

      if (error) return `Erro ao responder review: ${error.message}`;
      return "Resposta ao review guardada com sucesso!";
    },
  },
  {
    name: "get_menu_analytics",
    description: "Obter analytics do menu — itens mais/menos vendidos, margens, receita. Usa quando o utilizador perguntar sobre performance do menu.",
    parameters: {},
    execute: async (_params, restaurantId) => {
      const { data: items } = await supabase
        .from("menu_items")
        .select("name, category, price, cost, margin_pct, orders_count, revenue")
        .eq("restaurant_id", restaurantId)
        .order("revenue", { ascending: false })
        .limit(15);

      if (!items?.length) return "Sem dados de menu disponíveis. Adiciona itens ao menu primeiro.";

      const totalRevenue = items.reduce((s, i) => s + (i.revenue || 0), 0);
      const avgMargin = items.reduce((s, i) => s + (i.margin_pct || 0), 0) / items.length;
      const topItem = items[0];
      const bottomItem = items[items.length - 1];

      return `📊 Analytics do Menu:
- ${items.length} itens ativos
- Receita total: €${totalRevenue.toFixed(2)}
- Margem média: ${avgMargin.toFixed(1)}%
- Top item: ${topItem.name} (€${topItem.revenue?.toFixed(2) || 0} receita)
- Bottom item: ${bottomItem.name} (€${bottomItem.revenue?.toFixed(2) || 0} receita)
- Top 3: ${items.slice(0, 3).map(i => `${i.name} (€${i.revenue?.toFixed(2) || 0})`).join(", ")}`;
    },
  },
  {
    name: "get_performance_summary",
    description: "Obter resumo de performance — vendas, pedidos, ticket médio. Usa quando o utilizador perguntar sobre performance geral.",
    parameters: {
      period: { type: "string", description: "Período: 'today', 'week', 'month'" },
    },
    execute: async (params, restaurantId) => {
      const now = new Date();
      let since = new Date();

      switch (params.period || "week") {
        case "today": since.setHours(0, 0, 0, 0); break;
        case "week": since.setDate(now.getDate() - 7); break;
        case "month": since.setMonth(now.getMonth() - 1); break;
      }

      const { data: orders } = await supabase
        .from("orders")
        .select("total, platform, ordered_at")
        .eq("restaurant_id", restaurantId)
        .gte("ordered_at", since.toISOString());

      if (!orders?.length) return "Sem dados de pedidos para este período.";

      const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
      const avgTicket = totalRevenue / orders.length;
      const byPlatform: Record<string, { count: number; revenue: number }> = {};

      for (const order of orders) {
        if (!byPlatform[order.platform]) byPlatform[order.platform] = { count: 0, revenue: 0 };
        byPlatform[order.platform].count++;
        byPlatform[order.platform].revenue += order.total;
      }

      const platformBreakdown = Object.entries(byPlatform)
        .map(([p, d]) => `${p}: ${d.count} pedidos (€${d.revenue.toFixed(2)})`)
        .join("\n  ");

      return `📈 Performance (${params.period || "week"}):
- ${orders.length} pedidos
- Receita total: €${totalRevenue.toFixed(2)}
- Ticket médio: €${avgTicket.toFixed(2)}
- Por plataforma:
  ${platformBreakdown}`;
    },
  },
  {
    name: "list_reviews",
    description: "Listar reviews recentes. Usa quando o utilizador quiser ver reviews ou feedback dos clientes.",
    parameters: {
      limit: { type: "number", description: "Número de reviews a mostrar (default 5)" },
    },
    execute: async (params, restaurantId) => {
      const { data: reviews } = await supabase
        .from("reviews")
        .select("id, platform, rating, text, author_name, reviewed_at, responded")
        .eq("restaurant_id", restaurantId)
        .order("reviewed_at", { ascending: false })
        .limit(params.limit || 5);

      if (!reviews?.length) return "Sem reviews ainda.";

      return `⭐ Reviews recentes:
${reviews.map(r => `${r.rating}★ [${r.platform}] ${r.author_name}: "${r.text}" ${r.responded ? "(respondido)" : "(por responder)"}`).join("\n")}`;
    },
  },
  {
    name: "create_alert",
    description: "Criar um alerta para o utilizador. Usa quando detetares um problema que o restaurante precisa de saber.",
    parameters: {
      title: { type: "string", description: "Título do alerta", required: true },
      message: { type: "string", description: "Mensagem detalhada", required: true },
      severity: { type: "string", description: "Severidade: 'info', 'high', 'positive'" },
    },
    execute: async (params, restaurantId) => {
      const { error } = await supabase.from("alerts").insert({
        restaurant_id: restaurantId,
        type: "ai_alert",
        title: params.title,
        message: params.message,
        severity: params.severity || "info",
        read: false,
      });

      if (error) return `Erro ao criar alerta: ${error.message}`;
      return `Alerta criado: "${params.title}"`;
    },
  },
];

export function getToolByName(name: string): Tool | undefined {
  return TOOLS.find((t) => t.name === name);
}

export function getToolsDescription(): string {
  return TOOLS.map((t) => {
    const params = Object.entries(t.parameters)
      .map(([k, v]) => `  - ${k} (${v.type}${v.required ? ", obrigatório" : ""}): ${v.description}`)
      .join("\n");
    return `${t.name}: ${t.description}\n${params ? `Parâmetros:\n${params}` : "Sem parâmetros"}`;
  }).join("\n\n");
}
