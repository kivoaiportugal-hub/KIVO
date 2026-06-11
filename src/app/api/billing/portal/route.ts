import { NextResponse } from "next/server";

export async function POST() {
  // Mock: return a fake portal URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kivo.ai";
  return NextResponse.json({
    url: `${appUrl}/dashboard/billing`,
  });
}
