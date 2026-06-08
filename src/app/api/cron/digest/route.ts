import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const results = { generated: 0, errors: 0, details: [] as string[] };

  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("id, name");

  if (!restaurants) {
    return NextResponse.json({ error: "No restaurants found" }, { status: 500 });
  }

  const today = new Date().toISOString().split("T")[0];

  for (const restaurant of restaurants) {
    try {
      const startOfDay = new Date(today);
      const endOfDay = new Date(today);
      endOfDay.setDate(endOfDay.getDate() + 1);

      // Get today's orders
      const { data: orders } = await supabase
        .from("orders")
        .select("total, platform, status, ordered_at")
        .eq("restaurant_id", restaurant.id)
        .gte("ordered_at", startOfDay.toISOString())
        .lt("ordered_at", endOfDay.toISOString());

      // Get today's reviews
      const { data: reviews } = await supabase
        .from("reviews")
        .select("rating, platform")
        .eq("restaurant_id", restaurant.id)
        .gte("reviewed_at", startOfDay.toISOString());

      // Get today's alerts
      const { data: alerts } = await supabase
        .from("alerts")
        .select("type, title, severity")
        .eq("restaurant_id", restaurant.id)
        .gte("created_at", startOfDay.toISOString());

      // Get today's insights
      const { data: digestData } = await supabase
        .from("daily_digests")
        .select("data")
        .eq("restaurant_id", restaurant.id)
        .eq("date", today)
        .eq("type", "insights")
        .single();

      // Build digest
      const totalRevenue = orders?.reduce((sum, o) => sum + o.total, 0) || 0;
      const avgRating = reviews?.length
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      const digest = {
        date: today,
        restaurant_name: restaurant.name,
        summary: {
          total_orders: orders?.length || 0,
          total_revenue: totalRevenue,
          avg_ticket: orders?.length ? totalRevenue / orders.length : 0,
          reviews_count: reviews?.length || 0,
          avg_rating: Math.round(avgRating * 10) / 10,
          alerts_count: alerts?.length || 0,
        },
        by_platform: {} as Record<string, { orders: number; revenue: number }>,
        highlights: [] as string[],
      };

      // Platform breakdown
      for (const order of orders || []) {
        if (!digest.by_platform[order.platform]) {
          digest.by_platform[order.platform] = { orders: 0, revenue: 0 };
        }
        digest.by_platform[order.platform].orders++;
        digest.by_platform[order.platform].revenue += order.total;
      }

      // Highlights
      if (digest.summary.total_orders > 0) {
        digest.highlights.push(`${digest.summary.total_orders} pedidos hoje`);
      }
      if (digest.summary.total_revenue > 0) {
        digest.highlights.push(`Receita: €${digest.summary.total_revenue.toFixed(2)}`);
      }
      if (digest.summary.avg_rating > 0) {
        digest.highlights.push(`Rating médio: ${digest.summary.avg_rating}★`);
      }

      // Store digest
      await supabase.from("daily_digests").upsert({
        restaurant_id: restaurant.id,
        date: today,
        type: "digest",
        data: digest,
      }, { onConflict: "restaurant_id,date,type" });

      results.generated++;
      results.details.push(`${restaurant.name}: Digest generated`);
    } catch (error) {
      results.errors++;
      results.details.push(`${restaurant.name}: Error - ${error}`);
    }
  }

  return NextResponse.json(results);
}
