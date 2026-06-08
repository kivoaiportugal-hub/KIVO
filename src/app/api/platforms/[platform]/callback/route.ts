import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getConnector } from "@/lib/platforms";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // restaurant_id
  const platform = request.nextUrl.pathname.split("/")[3]; // uber-eats, glovo, bolt-food

  if (!code || !state) {
    return NextResponse.redirect(new URL("/dashboard/settings?error=missing_params", request.url));
  }

  const platformId = platform.replace("-", "_");

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
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const connector = getConnector(platformId);
    const token = await connector.handleCallback(code, state);

    await supabase.from("platform_tokens").upsert({
      restaurant_id: state,
      platform: platformId,
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      expires_at: new Date(token.expires_at).toISOString(),
      token_type: token.token_type,
    }, { onConflict: "restaurant_id,platform" });

    // Add platform to restaurant's platforms array
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("platforms")
      .eq("id", state)
      .single();

    if (restaurant && !restaurant.platforms?.includes(platformId)) {
      await supabase.from("restaurants").update({
        platforms: [...(restaurant.platforms || []), platformId],
      }).eq("id", state);
    }

    return NextResponse.redirect(new URL("/dashboard/settings?connected=" + platformId, request.url));
  } catch (error) {
    console.error(`OAuth callback error for ${platform}:`, error);
    return NextResponse.redirect(new URL("/dashboard/settings?error=oauth_failed", request.url));
  }
}
