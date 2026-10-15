"use client";

import React from "react";
import { useApp } from "../context/AppContext";
import { Utensils, ShoppingBag, Clock, Receipt, User } from "lucide-react";

export function BottomNav() {
  const { activeTab, setActiveTab, cartItemCount, orders, profile } = useApp();

  // Count active orders for this user
  const activeOrdersCount = orders.filter(
    (o) =>
      o.customerName === profile.name &&
      o.orderStatus !== "selesai" &&
      o.orderStatus !== "dibatalkan"
  ).length;

  const tabs = [
    {
      id: "menu" as const,
      label: "Menu",
      icon: Utensils,
      badge: 0,
    },
    {
      id: "cart" as const,
      label: "Keranjang",
      icon: ShoppingBag,
      badge: cartItemCount,
    },
    {
      id: "active_orders" as const,
      label: "Pesanan",
      icon: Clock,
      badge: activeOrdersCount,
    },
    {
      id: "history" as const,
      label: "Riwayat",
      icon: Receipt,
      badge: 0,
    },
    {
      id: "profile" as const,
      label: "Profil",
      icon: User,
      badge: 0,
    },
  ];

  return (
    <nav
      aria-label="Navigasi Utama"
      className="fixed bottom-0 left-0 right-0 z-30 bg-[var(--card)]/95 backdrop-blur-md border-t border-[var(--border)] transition-colors shadow-lg"
    >
      <div className="max-w-md mx-auto px-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-3 min-h-[56px] min-w-[56px] rounded-xl transition-all ${
                isActive
                  ? "text-orange-600 dark:text-orange-400 font-semibold"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] font-medium"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? "scale-110" : ""
                  }`}
                />
                {tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {tab.badge > 9 ? "9+" : tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 leading-tight tracking-tight">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-orange-600 dark:bg-orange-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
