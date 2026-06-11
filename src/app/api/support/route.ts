import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { subject, message } = await request.json();

  if (!subject || !message) {
    return NextResponse.json({ error: "Subject and message required" }, { status: 400 });
  }

  // Mock: just return success
  return NextResponse.json({ success: true });
}
