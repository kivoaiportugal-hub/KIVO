import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getConnector } from "@/lib/platforms";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const results = { synced: 0, errors: 0, details: [] as string[] };

  // Get all restaurants with connected platforms
  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("id, name, platforms");

  if (!restaurants) {
    return NextResponse.json({ error: "No restaurants found" }, { status: 500 });
  }

  for (const restaurant of restaurants) {
    if (!restaurant.platforms?.length) continue;

    for (const platformId of restaurant.platforms) {
      try {
        // Get platform token
        const { data: tokenData } = await supabase
          .from("platform_tokens")
          .select("*")
          .eq("restaurant_id", restaurant.id)
          .eq("platform", platformId)
          .single();

        if (!tokenData) continue;

        const connector = getConnector(platformId);
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

        // Sync orders
        const orders = await connector.getOrders(accessToken);
        for (const order of orders) {
          await supabase.from("orders").upsert({
            restaurant_id: restaurant.id,
            platform: platformId,
            external_id: order.external_id,
            status: order.status,
            total: order.total,
            items: order.items,
            customer_name: order.customer_name,
            ordered_at: order.ordered_at,
            delivered_at: order.delivered_at,
          }, { onConflict: "restaurant_id,external_id" });
        }

        // Sync reviews
        const reviews = await connector.getReviews(accessToken);
        for (const review of reviews) {
          await supabase.from("reviews").upsert({
            restaurant_id: restaurant.id,
            platform: platformId,
            external_id: review.external_id,
            rating: review.rating,
            text: review.text,
            author_name: review.author_name,
            reviewed_at: review.reviewed_at,
          }, { onConflict: "restaurant_id,external_id" });
        }

        // Sync menu items
        const menuItems = await connector.getMenuItems(accessToken);
        for (const item of menuItems) {
          await supabase.from("menu_items").upsert({
            restaurant_id: restaurant.id,
            platform: platformId,
            external_id: item.external_id,
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            available: item.available,
          }, { onConflict: "restaurant_id,external_id" });
        }

        results.synced++;
        results.details.push(`${restaurant.name}: ${platformId} synced (${orders.length} orders, ${reviews.length} reviews, ${menuItems.length} items)`);
      } catch (error) {
        results.errors++;
        results.details.push(`${restaurant.name}: ${platformId} error - ${error}`);
      }
    }
  }

  return NextResponse.json(results);
}
