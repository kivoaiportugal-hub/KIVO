import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "Messages array required" }, { status: 400 });
  }

  // Mock AI: keyword-based responses with streaming simulation
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";

  let response = "";
  if (lastMessage.includes("vendas") || lastMessage.includes("receita")) {
    response = "📊 Análise de Vendas (Mock):\n\n• Receita semanal: €2.850\n• Pedidos: 142\n• Ticket médio: €20.05\n• Top plataforma: Uber Eats (58%)\n\nRecomendação: Considerar uma promoção no Glovo para aumentar a volume.";
  } else if (lastMessage.includes("preço") || lastMessage.includes("pricing")) {
    response = "💰 Análise de Preços (Mock):\n\n• Pizza Margherita: €12.90 (margem 62%)\n• Francesinha: €14.50 (margem 58%)\n• Sugerir aumento de 5% em 3 itens = +€180/mês";
  } else if (lastMessage.includes("promoção") || lastMessage.includes("promo")) {
    response = "🎯 Promoções Ativas (Mock):\n\n1. 2x1 Pizzas (Glovo) - Ativa\n2. Frete Grátis >€25 (Uber Eats) - Ativa\n3. Combo Família (Bolt) - Programada\n\nImpacto estimado: +€450/semana";
  } else if (lastMessage.includes("review") || lastMessage.includes("avaliação")) {
    response = "⭐ Reviews (Mock):\n\n• Média: 4.2★ (12 novos)\n• 3 negativos precisam de resposta\n• Top elogio: \"Entrega rápida\"\n• Top reclamação: \"Pedido atrasado\"";
  } else if (lastMessage.includes("menu") || lastMessage.includes("cardápio")) {
    response = "📋 Menu (Mock):\n\n• 24 itens ativos\n• Top venda: Pizza Pepperoni (€420/mês)\n• Margem baixa: Salada Caesar (28%)\n• Sugerir remover 2 itens pouco vendidos";
  } else {
    response = "Olá! Sou o Kivo, o teu assistente de restaurante. Posso ajudar com:\n\n• 📊 Análise de vendas\n• 💰 Otimização de preços\n• 🎯 Promoções\n• ⭐ Gestão de reviews\n• 📋 Análise do menu\n\nO que queres saber?";
  }

  // Simulate streaming
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const words = response.split(" ");
      for (const word of words) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ content: word + " " })}\n\n`)
        );
        await new Promise((resolve) => setTimeout(resolve, 30));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
