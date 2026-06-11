"use client";

import { useData } from "@/lib/mock-data-provider";
import { useRouter } from "next/navigation";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { generateDailyRevenue } from "@/lib/mock-data";

export function InsightsPanel() {
  const { orders, reviews, promotions, restaurant } = useData();
  const router = useRouter();

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const activePromos = promotions.filter((p) => p.status === "active").length;

  const forecast = generateDailyRevenue(7);

  const insights = [
    {
      type: "warning",
      title: "Queda de 15% vs semana anterior",
      description: "Receita: €3.450 → €2.932",
      actions: ["Criar promoção", "Ajustar preços"],
    },
    {
      type: "info",
      title: "Top plataforma: Uber Eats (62%)",
      description: "Uber Eats: €1.818 | Glovo: €892 | Bolt: €222",
      actions: [],
    },
    {
      type: "positive",
      title: "Reviews: 4.2★ médio (12 novos)",
      description: "3 negativos precisam de resposta",
      actions: ["Ver reviews", "Responder todos"],
    },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Insights Automáticos</h3>

      {insights.map((insight, i) => (
        <div
          key={i}
          className={`rounded-xl border p-4 ${
            insight.type === "warning"
              ? "border-yellow-200 bg-yellow-50"
              : insight.type === "positive"
              ? "border-green-200 bg-green-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <p className="text-sm font-medium text-gray-900">{insight.title}</p>
          <p className="mt-1 text-xs text-gray-500">{insight.description}</p>
          {insight.actions.length > 0 && (
            <div className="mt-3 flex gap-2">
              {insight.actions.map((action) => (
                <button
                  key={action}
                  onClick={() => {
                    sessionStorage.setItem("kivo_agent_context", JSON.stringify({
                      action: "insight_action",
                      message: action,
                    }));
                    router.push("/dashboard/assistant");
                  }}
                  className="rounded-lg bg-[#2CDF0C] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#23b80a]"
                >
                  {action}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Forecast */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <h4 className="mb-2 text-sm font-semibold text-gray-700">Previsão 7 dias</h4>
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={forecast}>
            <XAxis dataKey="date" tick={{ fontSize: 8 }} stroke="#9CA3AF" />
            <YAxis hide />
            <Tooltip
              formatter={(value) => [`€${Number(value).toFixed(2)}`, "Receita"]}
              contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 10 }}
            />
            <Line type="monotone" dataKey="revenue" stroke="#2CDF0C" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <p className="mt-1 text-xs text-gray-500">Confiança: 78%</p>
      </div>

      {/* Quick actions */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <h4 className="mb-2 text-sm font-semibold text-gray-700">Ações Rápidas</h4>
        <div className="space-y-2">
          <button className="w-full rounded-lg border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-700 hover:bg-gray-50">
            Criar promoção "2x1 Pizzas" — Impacto: +€450/semana
          </button>
          <button className="w-full rounded-lg border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-700 hover:bg-gray-50">
            Responder a 3 reviews negativos
          </button>
          <button className="w-full rounded-lg border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-700 hover:bg-gray-50">
            Ajustar preço da Salada Caesar (+€180/mês)
          </button>
        </div>
      </div>
    </div>
  );
}
