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
    .select("id, name, platforms, monthly_revenue");

  if (!restaurants) {
    return NextResponse.json({ error: "No restaurants found" }, { status: 500 });
  }

  for (const restaurant of restaurants) {
    try {
      const insights: Array<{
        type: string;
        severity: string;
        title: string;
        message: string;
        data: Record<string, unknown>;
      }> = [];

      // Get recent orders
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      const { data: thisWeekOrders } = await supabase
        .from("orders")
        .select("total, platform")
        .eq("restaurant_id", restaurant.id)
        .gte("ordered_at", weekAgo.toISOString());

      const { data: lastWeekOrders } = await supabase
        .from("orders")
        .select("total, platform")
        .eq("restaurant_id", restaurant.id)
        .gte("ordered_at", twoWeeksAgo.toISOString())
        .lt("ordered_at", weekAgo.toISOString());

      // Revenue trend
      const thisWeekRevenue = thisWeekOrders?.reduce((sum, o) => sum + o.total, 0) || 0;
      const lastWeekRevenue = lastWeekOrders?.reduce((sum, o) => sum + o.total, 0) || 0;

      if (lastWeekRevenue > 0) {
        const change = ((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100;
        if (change < -15) {
          insights.push({
            type: "revenue_drop",
            severity: "high",
            title: "Queda de receita detectada",
            message: `Receita caiu ${Math.abs(change).toFixed(0)}% vs semana anterior. Considerar promoções ou ajustes de preço.`,
            data: { thisWeek: thisWeekRevenue, lastWeek: lastWeekRevenue, change },
          });
        } else if (change > 20) {
          insights.push({
            type: "revenue_growth",
            severity: "positive",
            title: "Crescimento de receita",
            message: `Receita cresceu ${change.toFixed(0)}% vs semana anterior. Boa performance!`,
            data: { thisWeek: thisWeekRevenue, lastWeek: lastWeekRevenue, change },
          });
        }
      }

      // Platform distribution
      const platformStats: Record<string, number> = {};
      for (const order of thisWeekOrders || []) {
        platformStats[order.platform] = (platformStats[order.platform] || 0) + order.total;
      }
      const topPlatform = Object.entries(platformStats).sort(([, a], [, b]) => b - a)[0];
      if (topPlatform) {
        insights.push({
          type: "platform_insight",
          severity: "info",
          title: "Plataforma líder",
          message: `${topPlatform[0]} representa ${((topPlatform[1] / thisWeekRevenue) * 100).toFixed(0)}% da receita esta semana.`,
          data: { platformStats, topPlatform: topPlatform[0] },
        });
      }

      // Low rating alerts
      const { data: recentReviews } = await supabase
        .from("reviews")
        .select("rating, text, platform")
        .eq("restaurant_id", restaurant.id)
        .gte("reviewed_at", weekAgo.toISOString());

      const lowRatings = (recentReviews || []).filter((r) => r.rating <= 2);
      if (lowRatings.length > 0) {
        insights.push({
          type: "low_ratings",
          severity: "high",
          title: "Reviews negativos",
          message: `${lowRatings.length} reviews com rating ≤2 esta semana. Responder e analisar padrões.`,
          data: { count: lowRatings.length, reviews: lowRatings },
        });
      }

      // Store insights
      if (insights.length > 0) {
        await supabase.from("daily_digests").upsert({
          restaurant_id: restaurant.id,
          date: new Date().toISOString().split("T")[0],
          type: "insights",
          data: { insights },
        }, { onConflict: "restaurant_id,date,type" });

        // Create alerts for high severity
        for (const insight of insights.filter((i) => i.severity === "high")) {
          await supabase.from("alerts").insert({
            restaurant_id: restaurant.id,
            type: insight.type,
            title: insight.title,
            message: insight.message,
            severity: insight.severity,
            read: false,
          });
        }
      }

      results.generated++;
      results.details.push(`${restaurant.name}: ${insights.length} insights generated`);
    } catch (error) {
      results.errors++;
      results.details.push(`${restaurant.name}: Error - ${error}`);
    }
  }

  return NextResponse.json(results);
}
