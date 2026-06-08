import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getConnector } from "@/lib/platforms";

export async function POST(request: NextRequest) {
  const { platform, restaurant_id, action } = await request.json();

  if (!platform || !restaurant_id) {
    return NextResponse.json({ error: "Missing platform or restaurant_id" }, { status: 400 });
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

  // Get platform token
  const { data: tokenData } = await supabase
    .from("platform_tokens")
    .select("*")
    .eq("restaurant_id", restaurant_id)
    .eq("platform", platform)
    .single();

  if (!tokenData) {
    return NextResponse.json({ error: "Platform not connected" }, { status: 400 });
  }

  try {
    const connector = getConnector(platform);
    let accessToken = tokenData.access_token;
    let refreshToken = tokenData.refresh_token;
    let expiresAt = new Date(tokenData.expires_at).getTime();

    // Refresh if expired
    if (Date.now() > expiresAt && refreshToken) {
      const newToken = await connector.refreshToken(refreshToken);
      accessToken = newToken.access_token;
      refreshToken = newToken.refresh_token;
      expiresAt = newToken.expires_at;
      await supabase.from("platform_tokens").update({
        access_token: newToken.access_token,
        refresh_token: newToken.refresh_token,
        expires_at: new Date(newToken.expires_at).toISOString(),
      }).eq("id", tokenData.id);
    }

    let result;
    switch (action) {
      case "menu":
        result = await connector.getMenuItems(accessToken);
        break;
      case "orders":
        result = await connector.getOrders(accessToken);
        break;
      case "reviews":
        result = await connector.getReviews(accessToken);
        break;
      case "financials":
        result = await connector.getFinancials(accessToken);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error(`Platform sync error:`, error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
