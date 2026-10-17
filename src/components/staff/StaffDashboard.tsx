"use client";

import React, { useState, useEffect } from "react";
import { useApp, formatRupiah } from "../../context/AppContext";
import { MenuItem } from "../../types";
import {
  Store,
  Clock,
  CheckCircle,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Edit2,
  Trash2,
  DollarSign,
  TrendingUp,
  Settings,
  ShoppingBag,
  Banknote,
  QrCode,
  Power,
  RefreshCw,
  Search,
  Check,
  X,
  XCircle,
} from "lucide-react";

export function StaffDashboard() {
  const {
    orders,
    menu,
    settings,
    updateOrderStatus,
    cancelOrder,
    confirmCashPayment,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updateStock,
    updateSettings,
    resetDemoData,
    isCloudConnected,
  } = useApp();

  const [activeStaffTab, setActiveStaffTab] = useState<
    "orders" | "menu" | "sales" | "settings"
  >("orders");

  // Orders Filter
  const [orderFilter, setOrderFilter] = useState<
    "semua" | "aktif" | "siap_antar" | "selesai" | "dibatalkan"
  >("semua");

  // Menu Search
  const [menuSearch, setMenuSearch] = useState("");

  // Modals state
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [isAddingMenu, setIsAddingMenu] = useState(false);
  const [deletingMenuId, setDeletingMenuId] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [quickStockItem, setQuickStockItem] = useState<{ id: string; name: string; stock: number } | null>(null);

  // Close modals on Escape key (R-32)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (quickStockItem) setQuickStockItem(null);
        if (deletingMenuId) setDeletingMenuId(null);
        if (isResetConfirmOpen) setIsResetConfirmOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [quickStockItem, deletingMenuId, isResetConfirmOpen]);

  // Settings form state
  const [canteenNameInput, setCanteenNameInput] = useState(settings.canteenName);
  const [deliveryFeeInput, setDeliveryFeeInput] = useState(String(settings.deliveryFee));
  const [settingsSavedAlert, setSettingsSavedAlert] = useState(false);

  // Operational Statistics (PRD Section 7.7)
  const totalOrdersCount = orders.length;
  const completedOrders = orders.filter((o) => o.orderStatus === "selesai");
  const completedOrdersCount = completedOrders.length;
  const activeProcessingOrdersCount = orders.filter(
    (o) => o.orderStatus !== "selesai" && o.orderStatus !== "dibatalkan"
  ).length;

  // Revenue is strictly calculated ONLY from completed orders (PRD Section 7.7)
  const completedRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);

  // Filtered orders list
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === "semua") return true;
    if (orderFilter === "aktif") {
      return o.orderStatus === "menunggu_konfirmasi" || o.orderStatus === "sedang_disiapkan";
    }
    if (orderFilter === "siap_antar") {
      return o.orderStatus === "siap_diambil" || o.orderStatus === "dalam_pengantaran";
    }
    if (orderFilter === "selesai") return o.orderStatus === "selesai";
    if (orderFilter === "dibatalkan") return o.orderStatus === "dibatalkan";
    return true;
  });

  // Filtered menu list
  const filteredMenu = menu.filter((item) => {
    return (
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(menuSearch.toLowerCase())
    );
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      canteenName: canteenNameInput.trim() || settings.canteenName,
      deliveryFee: Number(deliveryFeeInput) >= 0 ? Number(deliveryFeeInput) : settings.deliveryFee,
    });
    setSettingsSavedAlert(true);
    setTimeout(() => setSettingsSavedAlert(false), 3000);
  };

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      {/* Dashboard Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-stone-800 to-stone-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold mb-1.5 border border-orange-500/30">
            <Store className="w-3.5 h-3.5" />
            <span>Meja Operasional Petugas</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold tracking-tight">
              Dashboard Kantin Sekolah
            </h1>
            {isCloudConnected ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Supabase Live</span>
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <span>Mode Offline (Local)</span>
              </span>
            )}
          </div>
          <p className="text-xs text-stone-300 mt-0.5">
            Kelola pesanan masuk, ketersediaan stok, pembayaran tunai, dan ringkasan kasir.
          </p>
        </div>

        {/* Quick Service Status Toggle */}
        <div className="flex items-center gap-3 bg-stone-950/60 p-2.5 rounded-xl border border-stone-700/60 flex-shrink-0">
          <div>
            <span className="text-[11px] text-stone-400 block">Status Layanan</span>
            <span
              className={`text-xs font-bold ${
                settings.isServiceActive ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {settings.isServiceActive ? "Kantin Buka" : "Kantin Tutup"}
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              updateSettings({ isServiceActive: !settings.isServiceActive })
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors min-h-[36px] flex items-center gap-1.5 ${
              settings.isServiceActive
                ? "bg-rose-600 hover:bg-rose-700 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{settings.isServiceActive ? "Tutup" : "Buka"}</span>
          </button>
        </div>
      </div>

      {/* 4 Stats Cards (PRD Section 7.7) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-medium text-[var(--muted)]">Total Pesanan</span>
            <ShoppingBag className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--foreground)]">
            {totalOrdersCount}
          </div>
          <span className="text-[11px] text-[var(--muted)] mt-0.5 block">Hari ini</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-medium text-[var(--muted)]">Pesanan Selesai</span>
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {completedOrdersCount}
          </div>
          <span className="text-[11px] text-[var(--muted)] mt-0.5 block">Tuntas diserahkan</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-medium text-[var(--muted)]">Sedang Diproses</span>
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
            {activeProcessingOrdersCount}
          </div>
          <span className="text-[11px] text-[var(--muted)] mt-0.5 block">Perlu disiapkan</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-medium text-[var(--muted)]">Pendapatan Selesai</span>
            <DollarSign className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="mt-2 text-lg sm:text-xl font-bold text-orange-600 dark:text-orange-400 truncate">
            {formatRupiah(completedRevenue)}
          </div>
          <span className="text-[11px] text-[var(--muted)] mt-0.5 block">Dari pesanan selesai</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs for Staff */}
      <div className="flex border-b border-[var(--border)] overflow-x-auto scrollbar-none gap-2">
        {[
          { id: "orders" as const, label: "Daftar Pesanan", icon: ShoppingBag, badge: activeProcessingOrdersCount },
          { id: "menu" as const, label: "Kelola Menu & Stok", icon: Store, badge: 0 },
          { id: "sales" as const, label: "Ringkasan Penjualan", icon: TrendingUp, badge: 0 },
          { id: "settings" as const, label: "Pengaturan & Reset", icon: Settings, badge: 0 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeStaffTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveStaffTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-3.5 font-semibold text-xs border-b-2 whitespace-nowrap transition-colors min-h-[44px] ${
                isActive
                  ? "border-orange-600 text-orange-600 dark:text-orange-400"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Orders Pipeline & Management */}
      {activeStaffTab === "orders" && (
        <div className="space-y-4">
          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "semua" as const, label: `Semua (${orders.length})` },
              { id: "aktif" as const, label: `Perlu Diproses (${activeProcessingOrdersCount})` },
              {
                id: "siap_antar" as const,
                label: `Siap / Diantar (${
                  orders.filter(
                    (o) =>
                      o.orderStatus === "siap_diambil" ||
                      o.orderStatus === "dalam_pengantaran"
                  ).length
                })`,
              },
              { id: "selesai" as const, label: `Selesai (${completedOrdersCount})` },
              {
                id: "dibatalkan" as const,
                label: `Dibatalkan (${
                  orders.filter((o) => o.orderStatus === "dibatalkan").length
                })`,
              },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setOrderFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors min-h-[38px] ${
                  orderFilter === f.id
                    ? "bg-orange-600 text-white shadow-sm"
                    : "bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center space-y-2 bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <ShoppingBag className="w-10 h-10 text-[var(--muted)] mx-auto" />
              <h3 className="font-semibold text-sm text-[var(--foreground)]">
                Tidak ada pesanan pada filter ini
              </h3>
              <p className="text-xs text-[var(--muted)]">
                Pesanan baru dari siswa atau guru akan otomatis muncul di sini.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredOrders.map((order) => {
                const isPaid =
                  order.paymentStatus === "lunas" ||
                  order.paymentStatus === "berhasil_disimulasikan";

                return (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-3.5"
                  >
                    {/* Top Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-[var(--foreground)]">
                            {order.id}
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                            {order.fulfillmentMethod === "pickup" ? "Ambil Sendiri" : "Diantar"}
                          </span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              order.orderStatus === "selesai"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                : order.orderStatus === "dibatalkan"
                                ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            }`}
                          >
                            {order.orderStatus.replace("_", " ").toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--muted)] mt-1">
                          Pemesan: <strong className="text-[var(--foreground)]">{order.customerName}</strong>
                          {order.deliveryLocation && ` · Lokasi: ${order.deliveryLocation}`}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:text-right gap-3">
                        <div>
                          <span className="text-sm font-bold text-orange-600 dark:text-orange-400 block">
                            {formatRupiah(order.total)}
                          </span>
                          <span className="text-[11px] text-[var(--muted)]">
                            {order.paymentMethod === "qris" ? "Metode: QRIS" : "Metode: Tunai"}
                          </span>
                        </div>
                        <div>
                          {isPaid ? (
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Lunas
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 text-xs font-semibold flex items-center gap-1 border border-amber-200 dark:border-amber-800">
                              <Clock className="w-3.5 h-3.5" />
                              Belum Lunas
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ordered Items */}
                    <div className="p-3 rounded-xl bg-[var(--background-subtle)] space-y-1.5 text-xs">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[var(--foreground)]">
                          <span className="flex items-center gap-1.5">
                            <span>{it.emoji}</span>
                            <span className="font-medium">
                              {it.quantity}x {it.name}
                            </span>
                          </span>
                          <span className="font-semibold text-[var(--muted)]">
                            {formatRupiah(it.price * it.quantity)}
                          </span>
                        </div>
                      ))}
                      {order.deliveryFee > 0 && (
                        <div className="flex justify-between items-center text-[var(--muted)] pt-1 border-t border-[var(--border)]">
                          <span>Biaya Pengantaran</span>
                          <span>{formatRupiah(order.deliveryFee)}</span>
                        </div>
                      )}
                    </div>

                    {/* Staff Operational Action Buttons (PRD Section 7.6) */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      {/* Cash payment confirmation button */}
                      {order.paymentMethod === "tunai" && order.paymentStatus === "belum_dibayar" && (
                        <button
                          type="button"
                          onClick={() => confirmCashPayment(order.id)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm min-h-[40px]"
                        >
                          <Banknote className="w-3.5 h-3.5" />
                          <span>Tandai Lunas Tunai</span>
                        </button>
                      )}

                      {/* State transitions according to PRD 7.6 */}
                      <div className="flex items-center gap-2 ml-auto">
                        {order.orderStatus === "menunggu_konfirmasi" && (
                          <>
                            <button
                              type="button"
                              onClick={() => cancelOrder(order.id)}
                              className="px-3 py-2 rounded-xl border border-rose-300 text-rose-600 dark:border-rose-800 dark:text-rose-400 hover:bg-rose-50 text-xs font-semibold min-h-[40px]"
                            >
                              Tolak / Batalkan
                            </button>
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(order.id, "sedang_disiapkan")}
                              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm min-h-[40px]"
                            >
                              Mulai Persiapan
                            </button>
                          </>
                        )}

                        {order.orderStatus === "sedang_disiapkan" && (
                          <button
                            type="button"
                            onClick={() =>
                              updateOrderStatus(
                                order.id,
                                order.fulfillmentMethod === "pickup"
                                  ? "siap_diambil"
                                  : "dalam_pengantaran"
                              )
                            }
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm min-h-[40px] flex items-center gap-1.5"
                          >
                            {order.fulfillmentMethod === "pickup" ? (
                              <>
                                <Store className="w-3.5 h-3.5" />
                                <span>Tandai Siap Diambil</span>
                              </>
                            ) : (
                              <>
                                <Truck className="w-3.5 h-3.5" />
                                <span>Mulai Pengantaran</span>
                              </>
                            )}
                          </button>
                        )}

                        {(order.orderStatus === "siap_diambil" ||
                          order.orderStatus === "dalam_pengantaran") && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, "selesai")}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm min-h-[40px] flex items-center gap-1.5"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Tandai Selesai & Diserahkan</span>
                          </button>
                        )}

                        {order.orderStatus === "selesai" && (
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Pesanan Selesai
                          </span>
                        )}

                        {order.orderStatus === "dibatalkan" && (
                          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                            <XCircle className="w-4 h-4" />
                            Pesanan Dibatalkan
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Menu & Stock Management (CRUD) */}
      {activeStaffTab === "menu" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Cari menu kantin..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:border-orange-500 focus:outline-none min-h-[42px]"
              />
            </div>

            {/* Add Menu Button */}
            <button
              type="button"
              onClick={() => setIsAddingMenu(true)}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm min-h-[42px]"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Menu Baru</span>
            </button>
          </div>

          {/* Menu Table / Cards */}
          <div className="space-y-2.5">
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-[var(--background-subtle)] overflow-hidden flex items-center justify-center flex-shrink-0 border border-[var(--border-subtle)] text-xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                      className="w-full h-full object-cover"
                    />
                    <span aria-hidden="true">{item.emoji}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-[var(--foreground)] truncate">
                        {item.name}
                      </h3>
                      {!item.isActive && (
                        <span className="px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-[10px] font-semibold text-[var(--muted)]">
                          Nonaktif
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs mt-0.5">
                      <span className="font-semibold text-orange-600 dark:text-orange-400">
                        {formatRupiah(item.price)}
                      </span>
                      <span className="text-[var(--muted)]">·</span>
                      <span className="text-[var(--muted)] capitalize">
                        {item.category.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stock Controls & Actions */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[var(--border-subtle)]">
                  {/* Quick stock stepper */}
                  <div className="flex items-center gap-1.5 bg-[var(--background-subtle)] border border-[var(--border)] rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => updateStock(item.id, -1)}
                      className="w-7 h-7 rounded bg-[var(--card)] text-[var(--foreground)] hover:bg-orange-100 flex items-center justify-center font-bold min-h-[30px] min-w-[30px]"
                      aria-label="Kurangi stok 1"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setQuickStockItem({
                          id: item.id,
                          name: item.name,
                          stock: item.stock,
                        })
                      }
                      className="text-xs font-bold text-[var(--foreground)] px-2 py-1 rounded hover:bg-[var(--card)] min-w-[50px] text-center"
                      title="Klik untuk ubah stok langsung"
                    >
                      Stok: {item.stock}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStock(item.id, 1)}
                      className="w-7 h-7 rounded bg-orange-600 text-white hover:bg-orange-700 flex items-center justify-center font-bold min-h-[30px] min-w-[30px]"
                      aria-label="Tambah stok 1"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Edit & Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        updateMenuItem(item.id, { isActive: !item.isActive })
                      }
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold min-h-[36px] transition-colors ${
                        item.isActive
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                      }`}
                    >
                      {item.isActive ? "Aktif" : "Mati"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingMenu(item)}
                      className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--background-subtle)] min-h-[36px] min-w-[36px] flex items-center justify-center text-[var(--foreground)]"
                      aria-label="Edit menu"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingMenuId(item.id)}
                      className="p-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900 min-h-[36px] min-w-[36px] flex items-center justify-center"
                      aria-label="Hapus menu"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Sales Summary (PRD Section 7.7) */}
      {activeStaffTab === "sales" && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-4">
            <h2 className="font-bold text-base text-[var(--foreground)]">
              Ringkasan Penjualan Hari Ini
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[var(--background-subtle)] space-y-1">
                <span className="text-xs text-[var(--muted)]">Total Transaksi Selesai</span>
                <div className="text-xl font-bold text-[var(--foreground)]">
                  {completedOrdersCount} Pesanan
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[var(--background-subtle)] space-y-1">
                <span className="text-xs text-[var(--muted)]">Total Omzet Selesai</span>
                <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  {formatRupiah(completedRevenue)}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[var(--background-subtle)] space-y-1">
                <span className="text-xs text-[var(--muted)]">Rata-rata per Pesanan</span>
                <div className="text-xl font-bold text-[var(--foreground)]">
                  {completedOrdersCount > 0
                    ? formatRupiah(Math.round(completedRevenue / completedOrdersCount))
                    : "Rp 0"}
                </div>
              </div>
            </div>

            {/* Payment Method Distribution */}
            <div className="pt-2 border-t border-[var(--border)]">
              <h3 className="font-semibold text-xs text-[var(--foreground)] mb-2">
                Distribusi Metode Pembayaran
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-[var(--border)] flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-[var(--foreground)]">
                      QRIS Simulasi
                    </span>
                    <span className="text-[var(--muted)]">
                      {orders.filter((o) => o.paymentMethod === "qris").length} transaksi
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-[var(--border)] flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-[var(--foreground)]">
                      Tunai Kasir
                    </span>
                    <span className="text-[var(--muted)]">
                      {orders.filter((o) => o.paymentMethod === "tunai").length} transaksi
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Canteen Settings & Demo Reset (PRD Section 7.8 & 7.10) */}
      {activeStaffTab === "settings" && (
        <div className="space-y-4">
          <form
            onSubmit={handleSaveSettings}
            className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-4"
          >
            <h2 className="font-bold text-base text-[var(--foreground)]">
              Pengaturan Operasional Kantin
            </h2>

            {settingsSavedAlert && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Pengaturan kantin berhasil disimpan!</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="canteen-name"
                className="text-xs font-semibold text-[var(--foreground)] block"
              >
                Nama Kantin
              </label>
              <input
                id="canteen-name"
                type="text"
                required
                value={canteenNameInput}
                onChange={(e) => setCanteenNameInput(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-orange-500 focus:outline-none min-h-[44px]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="delivery-fee"
                className="text-xs font-semibold text-[var(--foreground)] block"
              >
                Biaya Pesan Antar / Delivery (Rp)
              </label>
              <input
                id="delivery-fee"
                type="number"
                min="0"
                step="500"
                required
                value={deliveryFeeInput}
                onChange={(e) => setDeliveryFeeInput(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-orange-500 focus:outline-none min-h-[44px]"
              />
              <span className="text-[11px] text-[var(--muted)] block">
                Biaya ini otomatis ditambahkan saat pemesan memilih opsi delivery. Untuk pesanan lama, biaya tetap mengikat saat checkout.
              </span>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-colors min-h-[44px]"
            >
              Simpan Pengaturan
            </button>
          </form>

          {/* Reset Demo Data Card (PRD Section 7.10) */}
          <div className="p-5 rounded-2xl bg-[var(--card)] border border-rose-200 dark:border-rose-900/60 shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 flex-shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[var(--foreground)]">
                  Reset Data Demo Aplikasi
                </h3>
                <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">
                  Kembalikan 15 menu awal, stok, pesanan contoh hari ini, dan pengaturan kantin ke kondisi mula. Cocok untuk mengulang demonstrasi alur pengujian.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(true)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-colors min-h-[44px] flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Data Demo Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stock Modal */}
      {quickStockItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-stock-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setQuickStockItem(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
        >
          <div className="w-full max-w-xs bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 space-y-4 shadow-2xl">
            <h3 id="quick-stock-modal-title" className="font-bold text-sm text-[var(--foreground)]">
              Ubah Stok: {quickStockItem.name}
            </h3>
            <div className="space-y-2">
              <label htmlFor="quick-stock-input" className="text-xs text-[var(--muted)] block">Jumlah Stok</label>
              <input
                id="quick-stock-input"
                type="number"
                min="0"
                step="1"
                value={quickStockItem.stock}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                    e.preventDefault();
                  }
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const sanitizedStock = Math.max(0, Math.floor(Number(quickStockItem.stock)) || 0);
                    updateStock(quickStockItem.id, sanitizedStock, true);
                    setQuickStockItem(null);
                  }
                }}
                onPaste={(e) => {
                  const paste = e.clipboardData.getData("text");
                  const parsed = parseInt(paste, 10);
                  if (isNaN(parsed) || parsed < 0) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  const parsed = parseInt(val, 10);
                  setQuickStockItem({
                    ...quickStockItem,
                    stock: isNaN(parsed) ? 0 : Math.max(0, parsed),
                  });
                }}
                className="w-full px-3 py-2 text-base font-bold rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] min-h-[44px]"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setQuickStockItem(null)}
                className="px-3 py-2 rounded-lg border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] min-h-[40px]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  const sanitizedStock = Math.max(0, Math.floor(Number(quickStockItem.stock)) || 0);
                  updateStock(quickStockItem.id, sanitizedStock, true);
                  setQuickStockItem(null);
                }}
                className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold min-h-[40px]"
              >
                Simpan Stok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Menu Modal */}
      {(isAddingMenu || editingMenu) && (
        <MenuFormModal
          isOpen={isAddingMenu || !!editingMenu}
          initialItem={editingMenu}
          onClose={() => {
            setIsAddingMenu(false);
            setEditingMenu(null);
          }}
          onSave={(itemData) => {
            if (editingMenu) {
              updateMenuItem(editingMenu.id, itemData);
            } else {
              addMenuItem(itemData);
            }
            setIsAddingMenu(false);
            setEditingMenu(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingMenuId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-menu-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeletingMenuId(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
        >
          <div className="w-full max-w-xs bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 space-y-4 shadow-2xl">
            <h3 id="delete-menu-modal-title" className="font-bold text-sm text-[var(--foreground)]">
              Hapus Menu Kantin?
            </h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Menu ini akan dihapus dari katalog dan keranjang pelanggan. Pesanan lama yang sudah dibuat tidak akan terpengaruh.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingMenuId(null)}
                className="px-3.5 py-2 rounded-lg border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] min-h-[40px]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteMenuItem(deletingMenuId);
                  setDeletingMenuId(null);
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold min-h-[40px]"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Demo Confirmation Modal */}
      {isResetConfirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-demo-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsResetConfirmOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
        >
          <div className="w-full max-w-xs bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 space-y-4 shadow-2xl">
            <h3 id="reset-demo-modal-title" className="font-bold text-sm text-[var(--foreground)]">
              Konfirmasi Reset Data Demo
            </h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Apakah Anda yakin ingin mereset seluruh data menu, pesanan, dan pengaturan kembali ke keadaan awal?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3.5 py-2 rounded-lg border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] min-h-[40px]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  resetDemoData();
                  setIsResetConfirmOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold min-h-[40px]"
              >
                Reset Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponent: Add / Edit Menu Form Modal
interface MenuFormModalProps {
  isOpen: boolean;
  initialItem: MenuItem | null;
  onClose: () => void;
  onSave: (data: Omit<MenuItem, "id">) => void;
}

function MenuFormModal({ initialItem, onClose, onSave }: MenuFormModalProps) {
  // Close menu form modal on Escape key (R-32)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const [name, setName] = useState(initialItem?.name || "");
  const [description, setDescription] = useState(initialItem?.description || "");
  const [price, setPrice] = useState(String(initialItem?.price || 10000));
  const [stock, setStock] = useState(String(initialItem?.stock || 20));
  const [category, setCategory] = useState<MenuItem["category"]>(
    initialItem?.category || "makanan_berat"
  );
  const [emoji, setEmoji] = useState(initialItem?.emoji || "🍱");
  const [image, setImage] = useState(
    initialItem?.image ||
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
  );
  const [isActive, setIsActive] = useState(
    initialItem ? initialItem.isActive : true
  );
  const [isPopular, setIsPopular] = useState(
    initialItem ? initialItem.isPopular || false : false
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      description: description.trim(),
      price: Math.max(0, Number(price) || 0),
      stock: Math.max(0, Number(stock) || 0),
      category,
      emoji: emoji.trim() || "🍲",
      image: image.trim() || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
      isActive,
      isPopular,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-form-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
    >
      <div
        className="w-full max-w-md bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 id="menu-form-modal-title" className="font-bold text-base text-[var(--foreground)]">
            {initialItem ? "Edit Menu Kantin" : "Tambah Menu Kantin Baru"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5">
          <div className="space-y-1">
            <label htmlFor="menu-name-input" className="text-xs font-semibold text-[var(--foreground)] block">Nama Menu</label>
            <input
              id="menu-name-input"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Nasi Goreng Spesial"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-orange-500 focus:outline-none min-h-[42px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="menu-price-input" className="text-xs font-semibold text-[var(--foreground)] block">Harga (Rp)</label>
              <input
                id="menu-price-input"
                type="number"
                min="0"
                step="500"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-orange-500 focus:outline-none min-h-[42px]"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="menu-stock-input" className="text-xs font-semibold text-[var(--foreground)] block">Stok Porsi</label>
              <input
                id="menu-stock-input"
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-orange-500 focus:outline-none min-h-[42px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="menu-category-select" className="text-xs font-semibold text-[var(--foreground)] block">Kategori</label>
              <select
                id="menu-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as MenuItem["category"])}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-orange-500 focus:outline-none min-h-[42px]"
              >
                <option value="makanan_berat">Makanan Berat</option>
                <option value="camilan">Camilan & Snack</option>
                <option value="minuman_dingin">Minuman Dingin</option>
                <option value="minuman_hangat">Minuman Hangat</option>
              </select>
            </div>
            <div className="space-y-1">
              <label htmlFor="menu-emoji-input" className="text-xs font-semibold text-[var(--foreground)] block">Emoji Ikon</label>
              <input
                id="menu-emoji-input"
                type="text"
                required
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-orange-500 focus:outline-none min-h-[42px]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="menu-desc-input" className="text-xs font-semibold text-[var(--foreground)] block">Deskripsi Singkat</label>
            <textarea
              id="menu-desc-input"
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan cita rasa atau isi menu..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="menu-image-input" className="text-xs font-semibold text-[var(--foreground)] block">URL Foto (Unsplash / Web)</label>
            <input
              id="menu-image-input"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-orange-500 focus:outline-none min-h-[42px]"
            />
          </div>

          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[var(--foreground)]">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
              />
              <span>Menu Aktif Tersedia</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[var(--foreground)]">
              <input
                type="checkbox"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
              />
              <span>Tandai Menu Favorit</span>
            </label>
          </div>

          <div className="pt-3 border-t border-[var(--border)] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] min-h-[42px]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm min-h-[42px]"
            >
              Simpan Menu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
