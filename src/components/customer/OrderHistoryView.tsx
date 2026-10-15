"use client";

import React from "react";
import { useApp, formatRupiah } from "../../context/AppContext";
import { Receipt, RotateCcw, Utensils, CheckCircle, XCircle } from "lucide-react";

export function OrderHistoryView() {
  const { orders, profile, addToCart, setActiveTab } = useApp();

  // Completed or cancelled orders for current user
  const pastOrders = orders.filter(
    (o) =>
      o.customerName === profile.name &&
      (o.orderStatus === "selesai" || o.orderStatus === "dibatalkan")
  );

  const handleReorder = (order: typeof pastOrders[0]) => {
    order.items.forEach((item) => {
      addToCart(item.menuId, item.quantity);
    });
    setActiveTab("cart");
  };

  if (pastOrders.length === 0) {
    return (
      <div className="py-16 text-center space-y-4 bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto">
          <Receipt className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="font-bold text-lg text-[var(--foreground)]">
            Belum Ada Riwayat Pesanan
          </h2>
          <p className="text-xs text-[var(--muted)] max-w-xs mx-auto leading-relaxed">
            Pesanan yang telah Anda selesaikan atau batalkan akan tercatat rapi di halaman ini.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setActiveTab("menu")}
          className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition-colors inline-flex items-center gap-2 min-h-[44px]"
        >
          <Utensils className="w-4 h-4" />
          <span>Mulai Pesan Menu</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-28 max-w-lg mx-auto">
      <div>
        <h1 className="font-bold text-xl text-[var(--foreground)]">
          Riwayat Jajan
        </h1>
        <p className="text-xs text-[var(--muted)]">
          Daftar transaksi dan struk pemesanan sebelumnya
        </p>
      </div>

      <div className="space-y-3.5">
        {pastOrders.map((order) => {
          const isCompleted = order.orderStatus === "selesai";

          return (
            <div
              key={order.id}
              className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-3.5"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[var(--foreground)]">
                      {order.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isCompleted
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          <span>Selesai</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          <span>Dibatalkan</span>
                        </>
                      )}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--muted)] block mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    ·{" "}
                    {new Date(order.createdAt).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400 block">
                    {formatRupiah(order.total)}
                  </span>
                  <span className="text-[11px] text-[var(--muted)]">
                    {order.fulfillmentMethod === "pickup" ? "Pickup" : "Delivery"}
                  </span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="p-3 rounded-xl bg-[var(--background-subtle)] space-y-1.5 text-xs border border-[var(--border-subtle)]">
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
                    <span>Biaya Antar ({order.deliveryLocation})</span>
                    <span>{formatRupiah(order.deliveryFee)}</span>
                  </div>
                )}
              </div>

              {/* Status Note & Reorder Button */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="text-xs text-[var(--muted)]">
                  {order.paymentStatus === "refund_disimulasikan" ? (
                    <span className="text-rose-600 dark:text-rose-400 font-medium">
                      Pengembalian dana disimulasikan
                    </span>
                  ) : order.paymentStatus === "lunas" || order.paymentStatus === "berhasil_disimulasikan" ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      Pembayaran Lunas ({order.paymentMethod === "qris" ? "QRIS" : "Tunai"})
                    </span>
                  ) : (
                    <span>Metode: Tunai</span>
                  )}
                </div>

                {isCompleted && (
                  <button
                    type="button"
                    onClick={() => handleReorder(order)}
                    className="px-3.5 py-2 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] hover:bg-orange-50 hover:border-orange-300 dark:hover:bg-orange-950/30 text-xs font-semibold text-[var(--foreground)] transition-colors flex items-center gap-1.5 min-h-[40px]"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                    <span>Pesan Lagi</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
