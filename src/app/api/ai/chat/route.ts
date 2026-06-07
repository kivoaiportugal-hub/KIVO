import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import ai from "@/lib/ai/client";

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
- Use data-driven insights
- Be conversational but professional
- When suggesting actions, estimate the financial impact

You have access to the restaurant's data including:
- Sales by platform, time period, and menu item
- Menu items with costs, prices, and margins
- Customer reviews and ratings
- Promotional campaign history
- Competitor pricing (where available)

Always be helpful, specific, and focused on driving revenue growth.`;

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
