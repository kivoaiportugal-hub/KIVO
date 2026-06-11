import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Mock: return success
  return NextResponse.json({ evaluated: 0, actions: 0, errors: 0, details: ["Mock: no active rules"] });
}
