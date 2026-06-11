import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Mock: just acknowledge the webhook
  return NextResponse.json({ status: "ok" });
}
