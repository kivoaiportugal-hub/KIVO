import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const WHATSAPP_API_URL = "https://graph.facebook.com/v18.0";
const WHATSAPP_TOKEN = process.env.WHATSAPP_API_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

export async function POST(request: NextRequest) {
  const { to, message, restaurant_id } = await request.json();

  if (!to || !message) {
    return NextResponse.json({ error: "Missing to or message" }, { status: 400 });
  }

  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    return NextResponse.json({ error: "WhatsApp not configured" }, { status: 503 });
  }

  try {
    const response = await fetch(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: message },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API error:", data);
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }

    // Log the message
    if (restaurant_id) {
      const supabase = createAdminClient();
      await supabase.from("chat_messages").insert({
        restaurant_id,
        role: "assistant",
        content: message,
        channel: "whatsapp",
        metadata: { to, whatsapp_message_id: data.messages?.[0]?.id },
      });
    }

    return NextResponse.json({ success: true, messageId: data.messages?.[0]?.id });
  } catch (error) {
    console.error("WhatsApp send error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

// Webhook receiver for incoming WhatsApp messages
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}
