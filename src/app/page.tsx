"use client";

import React, { useState } from "react";
import { AppProvider, useApp } from "../context/AppContext";
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { RoleSelectModal } from "../components/RoleSelectModal";
import { NotificationModal } from "../components/NotificationModal";
import { MenuCatalog } from "../components/customer/MenuCatalog";
import { CartView } from "../components/customer/CartView";
import { CheckoutModal } from "../components/customer/CheckoutModal";
import { QrisModal } from "../components/customer/QrisModal";
import { ActiveOrdersView } from "../components/customer/ActiveOrdersView";
import { OrderHistoryView } from "../components/customer/OrderHistoryView";
import { ProfileView } from "../components/customer/ProfileView";
import { StaffDashboard } from "../components/staff/StaffDashboard";
import { Order } from "../types";
import { UtensilsCrossed } from "lucide-react";

function MainContent() {
  const { isHydrated, profile, activeTab } = useApp();

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [qrisOrder, setQrisOrder] = useState<Order | null>(null);

  // Loading state during initial localStorage hydration (R-27)
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--background)] text-[var(--foreground)]">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg animate-pulse mb-3">
          <UtensilsCrossed className="w-7 h-7" />
        </div>
        <h2 className="text-base font-bold text-[var(--foreground)]">
          Menyiapkan e-njajan...
        </h2>
        <p className="text-xs text-[var(--muted)] mt-1">
          Memuat data kantin sekolah dan pesanan lokal
        </p>
      </div>
    );
  }

  const isStaff = profile.role === "petugas";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      {/* Top Header */}
      <Header
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onOpenNotifModal={() => setIsNotifModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 pt-4 sm:pt-6">
        {isStaff ? (
          <StaffDashboard />
        ) : (
          <>
            {activeTab === "menu" && <MenuCatalog />}
            {activeTab === "cart" && (
              <CartView onOpenCheckout={() => setIsCheckoutOpen(true)} />
            )}
            {activeTab === "active_orders" && (
              <ActiveOrdersView />
            )}
            {activeTab === "history" && <OrderHistoryView />}
            {activeTab === "profile" && (
              <ProfileView onOpenRoleModal={() => setIsRoleModalOpen(true)} />
            )}
          </>
        )}
      </main>

      {/* Bottom Nav for customer views */}
      {!isStaff && <BottomNav />}

      {/* Modals */}
      <RoleSelectModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />

      <NotificationModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOpenQris={(order) => setQrisOrder(order)}
      />

      <QrisModal
        order={qrisOrder}
        isOpen={!!qrisOrder}
        onClose={() => setQrisOrder(null)}
      />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
