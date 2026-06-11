import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { to, message } = await request.json();

  if (!to || !message) {
    return NextResponse.json({ error: "Missing to or message" }, { status: 400 });
  }

  // Mock: return success
  return NextResponse.json({ success: true, messageId: "mock_msg_" + Date.now() });
}

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
