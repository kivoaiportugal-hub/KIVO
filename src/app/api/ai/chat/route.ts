import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import ai from "@/lib/ai/client";

export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "Messages array required" }, { status: 400 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch restaurant data for context
  let restaurantContext = "";
  try {
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("*")
      .eq("user_id", user.id)
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

    // Fetch menu items
    if (restaurant?.id) {
      const { data: menuItems } = await supabase
        .from("menu_items")
        .select("name, category, price, cost, margin_pct, orders_count, revenue")
        .eq("restaurant_id", restaurant.id)
        .order("orders_count", { ascending: false })
        .limit(20);

      if (menuItems && menuItems.length > 0) {
        restaurantContext += `
MENU ITEMS (top ${menuItems.length}):
${menuItems.map((m) => `  - ${m.name} (${m.category}): €${m.price} (cost €${m.cost}, margin ${m.margin_pct}%) — ${m.orders_count} orders, €${m.revenue} revenue`).join("\n")}
`;
      }
    }

    // Fetch recent reviews
    if (restaurant?.id) {
      const { data: reviews } = await supabase
        .from("reviews")
        .select("platform, rating, text, sentiment")
        .eq("restaurant_id", restaurant.id)
        .order("reviewed_at", { ascending: false })
        .limit(5);

      if (reviews && reviews.length > 0) {
        restaurantContext += `
RECENT REVIEWS:
${reviews.map((r) => `  - ${r.platform} ${r.rating}★ (${r.sentiment}): "${r.text}"`).join("\n")}
`;
      }
    }

    // Fetch recent orders
    if (restaurant?.id) {
      const { data: recentOrders } = await supabase
        .from("orders")
        .select("platform, total, ordered_at")
        .eq("restaurant_id", restaurant.id)
        .order("ordered_at", { ascending: false })
        .limit(10);

      if (recentOrders && recentOrders.length > 0) {
        const totalRevenue = recentOrders.reduce((s, o) => s + (o.total || 0), 0);
        restaurantContext += `
RECENT ORDERS (last 10):
- Total revenue: €${totalRevenue.toFixed(2)}
- Platforms: ${[...new Set(recentOrders.map((o) => o.platform))].join(", ")}
`;
      }
    }
  } catch {
    // Tables might not exist yet
  }

  const SYSTEM_PROMPT = `You are Kivo, an AI Restaurant Growth & Operations Agent for delivery restaurants in Portugal.

You help restaurant owners:
- Analyze their delivery performance (Uber Eats, Glovo, Bolt Food)
- Optimize pricing and margins
- Create effective promotions
- Improve menu structure and item performance
- React to negative reviews
- Forecast demand
- Automate operations

Key principles:
- Always respond in the same language the user writes in (Portuguese or English)
- Be direct and actionable — give specific recommendations with estimated impact in euros
- Reference specific platforms when relevant
- Use data-driven insights from the restaurant data below
- Be conversational but professional
- When suggesting actions, estimate the financial impact
- Reference specific menu items by name when relevant

${restaurantContext}

Always be helpful, specific, and focused on driving revenue growth. Use the real data above to give personalized advice.`;

  try {
    const stream = await ai.chat.completions.create({
      model: "meta/llama-3.1-8b-instruct",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      stream: true,
      max_tokens: 1024,
      temperature: 0.7,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
              );
            }
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
