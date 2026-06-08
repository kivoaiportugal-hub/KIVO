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

  for (const restaurant of restaurants) {
    try {
      // Get last 30 days of orders
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: orders } = await supabase
        .from("orders")
        .select("total, ordered_at, platform")
        .eq("restaurant_id", restaurant.id)
        .gte("ordered_at", thirtyDaysAgo.toISOString())
        .order("ordered_at", { ascending: true });

      if (!orders?.length) {
        results.details.push(`${restaurant.name}: No orders data, skipping`);
        continue;
      }

      // Calculate daily aggregates
      const dailyData: Record<string, { revenue: number; count: number }> = {};
      for (const order of orders) {
        const date = order.ordered_at.split("T")[0];
        if (!dailyData[date]) dailyData[date] = { revenue: 0, count: 0 };
        dailyData[date].revenue += order.total;
        dailyData[date].count++;
      }

      // Simple moving average forecast (7 days)
      const days = Object.entries(dailyData).sort(([a], [b]) => a.localeCompare(b));
      const recentDays = days.slice(-7);
      const avgRevenue = recentDays.reduce((sum, [, d]) => sum + d.revenue, 0) / (recentDays.length || 1);
      const avgOrders = recentDays.reduce((sum, [, d]) => sum + d.count, 0) / (recentDays.length || 1);

      // Generate 7-day forecast
      const forecast = [];
      for (let i = 1; i <= 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        forecast.push({
          date: date.toISOString().split("T")[0],
          predicted_revenue: Math.round(avgRevenue * (0.9 + Math.random() * 0.2) * 100) / 100,
          predicted_orders: Math.round(avgOrders * (0.9 + Math.random() * 0.2)),
          confidence: Math.min(0.95, 0.5 + (recentDays.length / 7) * 0.4),
        });
      }

      // Store forecast
      await supabase.from("daily_digests").upsert({
        restaurant_id: restaurant.id,
        date: new Date().toISOString().split("T")[0],
        type: "forecast",
        data: { forecast, based_on_days: recentDays.length },
      }, { onConflict: "restaurant_id,date,type" });

      results.generated++;
      results.details.push(`${restaurant.name}: Forecast generated (${recentDays.length} days of data)`);
    } catch (error) {
      results.errors++;
      results.details.push(`${restaurant.name}: Error - ${error}`);
    }
  }

  return NextResponse.json(results);
}
