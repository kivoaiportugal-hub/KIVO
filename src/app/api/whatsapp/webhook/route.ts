import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = createAdminClient();

  // Process incoming WhatsApp messages
  const entry = body.entry?.[0];
  const changes = entry?.changes?.[0];
  const messages = changes?.value?.messages;

  if (!messages?.length) {
    return NextResponse.json({ status: "ok" });
  }

  for (const message of messages) {
    try {
      const from = message.from; // phone number
      const text = message.text?.body;

      if (!text) continue;

      // Find restaurant by phone number
      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("id, name")
        .eq("whatsapp_phone", from)
        .single();

      if (!restaurant) {
        // Unknown number, send welcome message
        continue;
      }

      // Store incoming message
      await supabase.from("chat_messages").insert({
        restaurant_id: restaurant.id,
        role: "user",
        content: text,
        channel: "whatsapp",
        metadata: { whatsapp_message_id: message.id, from },
      });

      // Generate AI response
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant_id: restaurant.id,
          message: text,
          channel: "whatsapp",
        }),
      });

      const data = await response.json();

      // Send response back via WhatsApp
      if (data.response) {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/whatsapp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: from,
            message: data.response,
            restaurant_id: restaurant.id,
          }),
        });
      }
    } catch (error) {
      console.error("WhatsApp webhook error:", error);
    }
  }

  return NextResponse.json({ status: "ok" });
}
