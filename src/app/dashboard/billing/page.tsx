"use client";

export default function BillingPage() {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-lg font-bold text-gray-900">Subscrição</h1>

        {/* Current Plan */}
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-700">Plano Atual</h2>
              <p className="mt-1 text-2xl font-bold text-gray-900">Grow</p>
              <p className="text-sm text-gray-500">€99/mês</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                Ativo
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400">Próxima cobrança: 15/07/2026</p>
        </section>

        {/* Plan Features */}
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">O teu plano inclui</h2>
          <ul className="space-y-2">
            {[
              "Tudo do Start",
              "Menu Intelligence (via agente)",
              "Pricing Engine (via agente)",
              "Gestão de promoções (via agente)",
              "Reviews + respostas (via agente)",
              "Import de dados das plataformas",
              "Sugestões com impacto em €",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-[#187906]">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </section>

        {/* Upgrade Options */}
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Upgrade de Plano</h2>
          <div className="space-y-3">
            {[
              { id: "start", name: "Start", price: 39 },
              { id: "grow", name: "Grow", price: 99, current: true },
              { id: "autopilot", name: "Autopilot", price: 199 },
            ].map((plan) => (
              <div
                key={plan.id}
                className={`flex items-center justify-between rounded-lg border p-4 ${
                  plan.current ? "border-[#2CDF0C] bg-[#2CDF0C]/5" : "border-gray-100"
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{plan.name}</p>
                  <p className="text-xs text-gray-500">€{plan.price}/mês</p>
                </div>
                {plan.current ? (
                  <span className="text-xs font-medium text-[#187906]">Plano Atual</span>
                ) : (
                  <button className="rounded-lg bg-[#2CDF0C] px-4 py-2 text-xs font-medium text-white hover:bg-[#23b80a]">
                    Fazer Upgrade
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
