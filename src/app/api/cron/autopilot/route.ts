import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

interface AutopilotRule {
  id: string;
  restaurant_id: string;
  name: string;
  condition_type: string;
  condition_value: { threshold: number };
  action_type: string;
  action_value: { value: string };
  status: string;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const results = { evaluated: 0, actions: 0, errors: 0, details: [] as string[] };

  // Get all active autopilot rules
  const { data: rules } = await supabase
    .from("autopilot_rules")
    .select("*")
    .eq("status", "active");

  if (!rules?.length) {
    return NextResponse.json({ message: "No active rules", ...results });
  }

  for (const rule of rules) {
    try {
      const typedRule = rule as AutopilotRule;
      const triggered = await evaluateRule(supabase, typedRule);

      if (triggered) {
        await executeAction(supabase, typedRule);
        results.actions++;

        // Log the action
        await supabase.from("action_log").insert({
          restaurant_id: typedRule.restaurant_id,
          rule_id: typedRule.id,
          action_type: typedRule.action_type,
          action_value: typedRule.action_value,
          condition_met: typedRule.condition_type,
          executed_at: new Date().toISOString(),
        });
      }

      results.evaluated++;
      results.details.push(`${typedRule.name}: ${triggered ? "TRIGGERED" : "not triggered"}`);
    } catch (error) {
      results.errors++;
      results.details.push(`${rule.name}: Error - ${error}`);
    }
  }

  return NextResponse.json(results);
}

async function evaluateRule(supabase: any, rule: AutopilotRule): Promise<boolean> {
  const threshold = rule.condition_value?.threshold || 0;
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  switch (rule.condition_type) {
    case "sales_drop": {
      const { data: thisWeek } = await supabase
        .from("orders")
        .select("total")
        .eq("restaurant_id", rule.restaurant_id)
        .gte("ordered_at", weekAgo.toISOString());

      const { data: lastWeek } = await supabase
        .from("orders")
        .select("total")
        .eq("restaurant_id", rule.restaurant_id)
        .gte("ordered_at", twoWeeksAgo.toISOString())
        .lt("ordered_at", weekAgo.toISOString());

      const thisWeekTotal = thisWeek?.reduce((sum: number, o: any) => sum + o.total, 0) || 0;
      const lastWeekTotal = lastWeek?.reduce((sum: number, o: any) => sum + o.total, 0) || 0;

      if (lastWeekTotal > 0) {
        const drop = ((lastWeekTotal - thisWeekTotal) / lastWeekTotal) * 100;
        return drop >= threshold;
      }
      return false;
    }

    case "low_margin": {
      const { data: menuItems } = await supabase
        .from("menu_items")
        .select("price, cost")
        .eq("restaurant_id", rule.restaurant_id);

      const lowMarginItems = (menuItems || []).filter((item: any) => {
        if (!item.cost || !item.price) return false;
        const margin = ((item.price - item.cost) / item.price) * 100;
        return margin < threshold;
      });

      return lowMarginItems.length > 0;
    }

    case "negative_review": {
      const { data: reviews } = await supabase
        .from("reviews")
        .select("rating")
        .eq("restaurant_id", rule.restaurant_id)
        .gte("reviewed_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const negativeCount = (reviews || []).filter((r: any) => r.rating <= (threshold || 2)).length;
      return negativeCount >= 1;
    }

    case "high_demand": {
      const { data: orders } = await supabase
        .from("orders")
        .select("id")
        .eq("restaurant_id", rule.restaurant_id)
        .gte("ordered_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());

      return (orders?.length || 0) >= threshold;
    }

    default:
      return false;
  }
}

async function executeAction(supabase: any, rule: AutopilotRule): Promise<void> {
  switch (rule.action_type) {
    case "notify": {
      await supabase.from("alerts").insert({
        restaurant_id: rule.restaurant_id,
        type: "autopilot_notification",
        title: `Autopilot: ${rule.name}`,
        message: rule.action_value?.value || `Regra "${rule.name}" foi ativada.`,
        severity: "info",
        read: false,
      });
      break;
    }

    case "promo": {
      await supabase.from("promotions").insert({
        restaurant_id: rule.restaurant_id,
        name: `Auto: ${rule.name}`,
        platform: "all",
        discount_type: "percentage",
        discount_value: Number(rule.action_value?.value) || 10,
        status: "active",
      });
      break;
    }

    case "price_adjust": {
      const adjustment = Number(rule.action_value?.value) || -5;
      const { data: items } = await supabase
        .from("menu_items")
        .select("id, price")
        .eq("restaurant_id", rule.restaurant_id)
        .eq("available", true);

      for (const item of items || []) {
        const newPrice = item.price * (1 + adjustment / 100);
        await supabase.from("menu_items").update({
          price: Math.round(newPrice * 100) / 100,
        }).eq("id", item.id);
      }
      break;
    }

    case "alert": {
      await supabase.from("alerts").insert({
        restaurant_id: rule.restaurant_id,
        type: "autopilot_alert",
        title: `Alerta: ${rule.name}`,
        message: rule.action_value?.value || `Alerta da regra "${rule.name}".`,
        severity: "high",
        read: false,
      });
      break;
    }
  }
}
