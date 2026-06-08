import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { streamChat } from "@/lib/ai/client";
import { TOOLS, getToolByName, getToolsDescription } from "@/lib/ai/tools";

export async function POST(request: NextRequest) {
  const { messages, restaurant_id } = await request.json();

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "Messages array required" }, { status: 400 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get restaurant ID from param or from user
  let targetRestaurantId = restaurant_id;
  if (!targetRestaurantId) {
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("user_id", user.id)
      .single();
    targetRestaurantId = restaurant?.id;
  }

  if (!targetRestaurantId) {
    return NextResponse.json({ error: "No restaurant found" }, { status: 400 });
  }

  // Build restaurant context
  let restaurantContext = "";
  try {
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", targetRestaurantId)
      .single();

    if (restaurant) {
      restaurantContext = `
RESTAURANT DATA:
- Name: ${restaurant.name}
- Cuisine: ${restaurant.cuisine_type}
- City: ${restaurant.city}
- Platforms: ${restaurant.platforms?.join(", ") || "None connected"}
- Daily orders: ${restaurant.daily_orders || "Unknown"}
- Monthly revenue: €${restaurant.monthly_revenue || "Unknown"}
- Team size: ${restaurant.team_size || "Unknown"}
- Maturity score: ${restaurant.onboarding_score}/100
`;
    }

    // Menu items
    const { data: menuItems } = await supabase
      .from("menu_items")
      .select("id, name, category, price, cost, margin_pct, orders_count, revenue")
      .eq("restaurant_id", targetRestaurantId)
      .order("orders_count", { ascending: false })
      .limit(20);

    if (menuItems?.length) {
      restaurantContext += `
MENU ITEMS (top ${menuItems.length}):
${menuItems.map((m) => `  - [${m.id}] ${m.name} (${m.category}): €${m.price} (cost €${m.cost || "?"}, margin ${m.margin_pct || "?"}%) — ${m.orders_count || 0} orders, €${m.revenue || 0} revenue`).join("\n")}
`;
    }

    // Reviews
    const { data: reviews } = await supabase
      .from("reviews")
      .select("id, platform, rating, text, sentiment, responded")
      .eq("restaurant_id", targetRestaurantId)
      .order("reviewed_at", { ascending: false })
      .limit(5);

    if (reviews?.length) {
      restaurantContext += `
RECENT REVIEWS:
${reviews.map((r) => `  - [${r.id}] ${r.platform} ${r.rating}★ (${r.sentiment || "unknown"}): "${r.text}" ${r.responded ? "(respondido)" : "(por responder)"}`).join("\n")}
`;
    }

    // Recent orders
    const { data: recentOrders } = await supabase
      .from("orders")
      .select("platform, total, ordered_at")
      .eq("restaurant_id", targetRestaurantId)
      .order("ordered_at", { ascending: false })
      .limit(10);

    if (recentOrders?.length) {
      const totalRevenue = recentOrders.reduce((s, o) => s + (o.total || 0), 0);
      restaurantContext += `
RECENT ORDERS (last 10):
- Total revenue: €${totalRevenue.toFixed(2)}
- Platforms: ${[...new Set(recentOrders.map((o) => o.platform))].join(", ")}
`;
    }

    // Active promotions
    const { data: promos } = await supabase
      .from("promotions")
      .select("name, platform, discount_type, discount_value, status")
      .eq("restaurant_id", targetRestaurantId)
      .eq("status", "active")
      .limit(5);

    if (promos?.length) {
      restaurantContext += `
ACTIVE PROMOTIONS:
${promos.map((p) => `  - ${p.name}: ${p.discount_value}${p.discount_type === "percentage" ? "%" : "€"} off on ${p.platform}`).join("\n")}
`;
    }

    // Unread alerts count
    const { count } = await supabase
      .from("alerts")
      .select("id", { count: "exact", head: true })
      .eq("restaurant_id", targetRestaurantId)
      .eq("read", false);

    restaurantContext += `\nUNREAD ALERTS: ${count || 0}\n`;
  } catch {
    // Tables might not exist yet
  }

  const toolsDescription = getToolsDescription();

  const SYSTEM_PROMPT = `You are Kivo, an AI Restaurant Growth & Operations Agent for delivery restaurants in Portugal.

You are a proactive, intelligent assistant that can ANALYZE data and EXECUTE ACTIONS.

## CAPABILITIES
You have access to tools that let you take real actions:
${toolsDescription}

## HOW TO USE TOOLS
When you determine that an action should be taken, output a tool call in this exact format:
<tool_call>
{"name": "tool_name", "params": {"param1": "value1", "param2": "value2"}}
</tool_call>

You can output multiple tool calls. After executing tools, you will receive results and should continue the conversation.

## IMPORTANT RULES
- Always respond in the same language the user writes in (Portuguese or English)
- Be direct and actionable — give specific recommendations with estimated impact in euros
- When suggesting actions, ASK FOR CONFIRMATION before executing tools (except for get_* tools which are read-only)
- Reference specific platforms when relevant
- Use data-driven insights from the restaurant data below
- Be conversational but professional
- Reference specific menu items by name and ID when relevant
- For read-only tools (get_menu_analytics, get_performance_summary, list_reviews), execute immediately
- For write tools (create_promotion, adjust_price, respond_to_review, create_alert), ask first, then execute after user confirms

## RESPONSE FORMAT
1. First, analyze the user's request
2. If it requires data, use read tools
3. If it requires action, explain what you'll do and ask confirmation
4. After tool execution, summarize the result
5. Always end with a clear next step or question

${restaurantContext}

Always be helpful, specific, and focused on driving revenue growth. Use the real data above to give personalized advice.`;

  // Collect all messages including system prompt
  const chatMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    })),
  ];

  try {
    // First, check if the last user message implies a tool confirmation
    const lastMessage = messages[messages.length - 1];
    const isConfirmation = lastMessage?.role === "user" && 
      /^(sim|yes|confirma|confirmar|pode|executa|faz|go ahead|confirm)/i.test(lastMessage.content);

    // Collect full response first (non-streaming for tool detection)
    let fullResponse = "";
    for await (const chunk of streamChat("meta/llama-3.1-8b-instruct", chatMessages)) {
      fullResponse += chunk;
    }

    // Detect tool calls
    const toolCalls: Array<{ name: string; params: Record<string, any> }> = [];
    const toolCallStart = "<tool_call>";
    const toolCallEnd = "</tool_call>";
    let searchFrom = 0;

    while (true) {
      const startIdx = fullResponse.indexOf(toolCallStart, searchFrom);
      if (startIdx === -1) break;
      const endIdx = fullResponse.indexOf(toolCallEnd, startIdx + toolCallStart.length);
      if (endIdx === -1) break;
      const jsonStr = fullResponse.slice(startIdx + toolCallStart.length, endIdx).trim();
      try {
        const parsed = JSON.parse(jsonStr);
        toolCalls.push(parsed);
      } catch {}
      searchFrom = endIdx + toolCallEnd.length;
    }

    // If there are tool calls and user hasn't confirmed yet, ask for confirmation
    if (toolCalls.length > 0 && !isConfirmation) {
      const nonReadTools = toolCalls.filter((t) => {
        const tool = getToolByName(t.name);
        return tool && !t.name.startsWith("get_");
      });

      if (nonReadTools.length > 0) {
        // Ask for confirmation
        const actionDescription = nonReadTools.map((t) => {
          const tool = getToolByName(t.name);
          return `- ${tool?.name}: ${JSON.stringify(t.params)}`;
        }).join("\n");

        // Strip tool_call tags from response for display
        let cleanResponse = fullResponse;
        while (cleanResponse.includes("<tool_call>")) {
          const start = cleanResponse.indexOf("<tool_call>");
          const end = cleanResponse.indexOf("</tool_call>", start);
          if (end === -1) break;
          cleanResponse = cleanResponse.slice(0, start) + cleanResponse.slice(end + toolCallEnd.length);
        }
        cleanResponse = cleanResponse.trim();

        const confirmationMessage = `${cleanResponse}\n\n⚡ **Ações pendentes:**\n${actionDescription}\n\nPara confirmar, responde "sim" ou "confirmar".`;

        return new Response(
          `data: ${JSON.stringify({ content: confirmationMessage })}\n\ndata: [DONE]\n\n`,
          {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              Connection: "keep-alive",
            },
          }
        );
      }
    }

    // Execute tools (either read-only or confirmed)
    const toolResults: string[] = [];
    for (const toolCall of toolCalls) {
      const tool = getToolByName(toolCall.name);
      if (tool) {
        try {
          const result = await tool.execute(toolCall.params, targetRestaurantId);
          toolResults.push(result);
        } catch (err) {
          toolResults.push(`Erro ao executar ${toolCall.name}: ${err}`);
        }
      }
    }

    // If tools were executed, re-run with results
    if (toolResults.length > 0) {
      const toolResultsMessage = `\n\n[Tool Results]\n${toolResults.join("\n\n")}`;
      chatMessages.push({ role: "assistant", content: fullResponse });
      chatMessages.push({ role: "user", content: toolResultsMessage });

      // Stream final response
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of streamChat("meta/llama-3.1-8b-instruct", chatMessages)) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`)
              );
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          } catch (err) {
            controller.error(err);
          }
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

    // No tools — stream original response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          // Re-stream since we already consumed the generator
          for await (const chunk of streamChat("meta/llama-3.1-8b-instruct", chatMessages)) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`)
            );
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("AI chat error:", err);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
