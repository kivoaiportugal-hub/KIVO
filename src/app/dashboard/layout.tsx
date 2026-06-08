"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SubscriptionProvider } from "@/features/billing/subscription-provider";
import { SidebarUser } from "@/components/sidebar-user";
import { CompleteAccountWidget } from "@/components/complete-account-widget";
import { useAlerts, useRestaurant } from "@/hooks/use-data";
import {
  AssistantIcon,
  PerformanceIcon,
  MenuIcon,
  PricingIcon,
  PromotionsIcon,
  ReviewsIcon,
  SettingsIcon,
  SupportIcon,
  SearchIcon,
  BellIcon,
  MenuMobileIcon,
  CloseIcon,
  BillingIcon,
} from "@/components/icons";

const mainNav = [
  { name: "Assistente", href: "/dashboard/assistant", icon: AssistantIcon },
  { name: "Performance", href: "/dashboard/performance", icon: PerformanceIcon },
  { name: "Menu", href: "/dashboard/menu", icon: MenuIcon },
  { name: "Pricing", href: "/dashboard/pricing-engine", icon: PricingIcon },
  { name: "Promoções", href: "/dashboard/promotions", icon: PromotionsIcon },
  { name: "Reviews", href: "/dashboard/reviews", icon: ReviewsIcon },
];

const bottomNav = [
  { name: "Definições", href: "/dashboard/settings", icon: SettingsIcon },
  { name: "Subscrição", href: "/dashboard/billing", icon: BillingIcon },
  { name: "Suporte", href: "/dashboard/support", icon: SupportIcon },
];

function UnreadBadge() {
  const { restaurant } = useRestaurant();
  const { alerts } = useAlerts(restaurant?.id);
  const unread = alerts.filter((a: { read: boolean }) => !a.read).length;
  if (unread === 0) return null;
  return (
    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
      {unread > 99 ? "99+" : unread}
    </span>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[72px] flex-col items-center rounded-r-2xl border-r border-gray-100 bg-gray-50/80 py-4 transition-transform duration-200 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile close */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute right-2 top-2 rounded-md p-1 lg:hidden"
        >
          <CloseIcon size={16} />
        </button>

        {/* Logo */}
        <Link href="/dashboard/assistant" className="mb-6 flex items-center justify-center" onClick={() => setSidebarOpen(false)}>
          <span className="text-3xl font-black italic text-[#2CDF0C]">K</span>
        </Link>

        {/* Main nav */}
        <nav className="flex flex-1 flex-col items-center gap-1">
          {mainNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                title={item.name}
                onClick={() => setSidebarOpen(false)}
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                  isActive
                    ? "bg-[#2CDF0C] shadow-md shadow-[#2CDF0C]/30"
                    : "hover:bg-gray-200/60"
                }`}
              >
                <item.icon active={isActive} size={22} />
              </Link>
            );
          })}
        </nav>

        {/* Separator */}
        <div className="my-3 h-[2px] w-8 rounded-full bg-[#2CDF0C]" />

        {/* Bottom nav */}
        <nav className="flex flex-col items-center gap-1">
          {bottomNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                title={item.name}
                onClick={() => setSidebarOpen(false)}
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                  isActive
                    ? "bg-[#2CDF0C]/10"
                    : "hover:bg-gray-200/60"
                }`}
              >
                <item.icon active={isActive} size={22} />
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-end gap-3 px-6">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="mr-auto rounded-md p-2 lg:hidden"
          >
            <MenuMobileIcon size={22} />
          </button>

          {/* Search */}
          <div className="relative">
            {searchOpen ? (
              <input
                autoFocus
                onBlur={() => setSearchOpen(false)}
                placeholder="Pesquisar..."
                className="h-10 w-64 rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-[#2CDF0C] focus:ring-1 focus:ring-[#2CDF0C]/30"
              />
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100"
              >
                <SearchIcon size={18} />
              </button>
            )}
            {searchOpen && (
              <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2" />
            )}
          </div>

          {/* Notifications */}
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100">
            <BellIcon size={18} />
            <UnreadBadge />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-hidden">
          <SubscriptionProvider>{children}</SubscriptionProvider>
        </main>
      </div>

      {/* Complete account widget */}
      <CompleteAccountWidget />
    </div>
  );
}
