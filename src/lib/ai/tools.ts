export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, { type: string; description: string; required?: boolean }>;
  execute: (params: Record<string, any>, restaurantId: string) => Promise<string>;
}

export const TOOLS: Tool[] = [
  {
    name: "create_promotion",
    description: "Criar uma promoção no restaurante.",
    parameters: {
      name: { type: "string", description: "Nome da promoção", required: true },
      platform: { type: "string", description: "Plataforma: 'all', 'uber_eats', 'glovo', 'bolt_food'" },
      discount_type: { type: "string", description: "Tipo: 'percentage' ou 'fixed'" },
      discount_value: { type: "number", description: "Valor do desconto" },
    },
    execute: async (params) => {
      return `Promoção "${params.name}" criada! ${params.discount_value}${params.discount_type === "percentage" ? "%" : "€"} off em ${params.platform || "todas as plataformas"}.`;
    },
  },
  {
    name: "adjust_price",
    description: "Ajustar o preço de um item do menu.",
    parameters: {
      item_name: { type: "string", description: "Nome do item", required: true },
      new_price: { type: "number", description: "Novo preço em euros", required: true },
    },
    execute: async (params) => {
      return `Preço de "${params.item_name}" atualizado para €${params.new_price.toFixed(2)}.`;
    },
  },
  {
    name: "respond_to_review",
    description: "Responder a um review.",
    parameters: {
      review_id: { type: "string", description: "ID do review" },
      response_text: { type: "string", description: "Texto da resposta", required: true },
    },
    execute: async (params) => {
      return "Resposta ao review guardada com sucesso!";
    },
  },
  {
    name: "get_menu_analytics",
    description: "Obter analytics do menu.",
    parameters: {},
    execute: async () => {
      return "📊 Analytics do Menu (Mock):\n- 24 itens ativos\n- Receita total: €4.280\n- Margem média: 61%\n- Top item: Pizza Pepperoni (€420)";
    },
  },
  {
    name: "get_performance_summary",
    description: "Obter resumo de performance.",
    parameters: {
      period: { type: "string", description: "Período: 'today', 'week', 'month'" },
    },
    execute: async (params) => {
      return `📈 Performance (${params.period || "week"}):\n- 142 pedidos\n- Receita: €2.850\n- Ticket médio: €20.05`;
    },
  },
  {
    name: "list_reviews",
    description: "Listar reviews recentes.",
    parameters: {
      limit: { type: "number", description: "Número de reviews" },
    },
    execute: async () => {
      return "⭐ Reviews (Mock):\n5★ [Uber Eats] João: \"Excelente!\"\n4★ [Glovo] Maria: \"Bom, mas demorou\"";
    },
  },
  {
    name: "create_alert",
    description: "Criar um alerta para o utilizador.",
    parameters: {
      title: { type: "string", description: "Título do alerta", required: true },
      message: { type: "string", description: "Mensagem detalhada", required: true },
      severity: { type: "string", description: "Severidade: 'info', 'high', 'positive'" },
    },
    execute: async (params) => {
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
