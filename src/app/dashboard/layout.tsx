import type { Metadata } from "next";
import Link from "next/link";
import { SubscriptionProvider } from "@/features/billing/subscription-provider";

export const metadata: Metadata = {
  title: "Dashboard",
};

const navigation = [
  { name: "Home", href: "/dashboard/home", icon: "🏠" },
  { name: "AI Assistant", href: "/dashboard/assistant", icon: "🤖" },
  { name: "Performance", href: "/dashboard/performance", icon: "📊" },
  { name: "Menu Intel", href: "/dashboard/menu", icon: "🍔" },
  { name: "Pricing", href: "/dashboard/pricing-engine", icon: "💸" },
  { name: "Promoções", href: "/dashboard/promotions", icon: "🎯" },
  { name: "Reviews", href: "/dashboard/reviews", icon: "⭐" },
  { name: "Forecast", href: "/dashboard/forecasts", icon: "🔮" },
  { name: "Autopilot", href: "/dashboard/autopilot", icon: "⚙️" },
  { name: "Integrações", href: "/dashboard/integrations", icon: "🔗" },
  { name: "Alertas", href: "/dashboard/alerts", icon: "🔔" },
  { name: "Configurações", href: "/dashboard/settings", icon: "⚙️" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard/home" className="flex items-center gap-2">
            <span className="text-xl font-bold">
              <span className="text-primary">K</span>
              <span className="text-foreground/80">ivo</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="border-t p-3">
          <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              U
            </div>
            <div className="flex-1 truncate">
              <div className="font-medium">Utilizador</div>
              <div className="text-xs text-muted-foreground">
                Plano: Start
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <SubscriptionProvider>{children}</SubscriptionProvider>
      </main>
    </div>
  );
}
