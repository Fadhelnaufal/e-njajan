"use client";

import React, { useState, useEffect } from "react";
import { useApp, formatRupiah } from "../../context/AppContext";
import { OrderStatus } from "../../types";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Banknote,
  XCircle,
  Utensils,
  Info,
} from "lucide-react";

export function ActiveOrdersView() {
  const { orders, profile, cancelOrder, setActiveTab } = useApp();
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Close cancellation confirmation modal on Escape key (R-32)
  useEffect(() => {
    if (!cancellingOrderId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCancellingOrderId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cancellingOrderId]);

  const [mountTime] = useState(() => Date.now());

  // Filter only active orders for current user (deduplicated by order.id)
  const activeOrders = orders
    .filter(
      (o) =>
        o.customerName === profile.name &&
        o.orderStatus !== "selesai" &&
        o.orderStatus !== "dibatalkan"
    )
    .filter((o, idx, self) => idx === self.findIndex((item) => item.id === o.id));

  // Filter recently cancelled orders (within 3 hours)
  const recentlyCancelledOrders = orders
    .filter(
      (o) =>
        o.customerName === profile.name &&
        o.orderStatus === "dibatalkan" &&
        mountTime - new Date(o.createdAt).getTime() < 3 * 60 * 60 * 1000
    )
    .filter((o, idx, self) => idx === self.findIndex((item) => item.id === o.id));

  const [dismissedCancelledId, setDismissedCancelledId] = useState<string | null>(null);

  const handleCancel = (orderId: string) => {
    setCancelError(null);
    const res = cancelOrder(orderId);
    if (!res.success) {
      setCancelError(res.error || "Gagal membatalkan pesanan.");
    } else {
      setCancellingOrderId(null);
    }
  };

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case "menunggu_konfirmasi":
        return 0;
      case "sedang_disiapkan":
        return 1;
      case "siap_diambil":
      case "dalam_pengantaran":
        return 2;
      case "selesai":
        return 3;
      default:
        return 0;
    }
  };

  if (activeOrders.length === 0) {
    return (
      <div className="space-y-4 max-w-lg mx-auto">
        {recentlyCancelledOrders.length > 0 && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-left space-y-2.5 shadow-sm">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-sm">
              <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              <span>Pesanan {recentlyCancelledOrders[0].id} Ditolak Petugas Kantin</span>
            </div>
            <div className="p-3 rounded-xl bg-white/70 dark:bg-black/30 border border-rose-200/60 dark:border-rose-800/60 text-xs space-y-1">
              <span className="text-[var(--muted)] font-semibold block">Alasan Penolakan:</span>
              <p className="font-medium text-rose-900 dark:text-rose-200 leading-relaxed">
                &ldquo;{recentlyCancelledOrders[0].cancellationReason || "Bahan makanan habis atau antrean kantin sedang padat."}&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setActiveTab("menu")}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-all active:scale-[0.98]"
              >
                Pilih Menu Lain
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--background-subtle)] transition-all"
              >
                Lihat Riwayat
              </button>
            </div>
          </div>
        )}

        <div className="py-14 text-center space-y-4 bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
          <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="font-bold text-lg text-[var(--foreground)]">
              Tidak Ada Pesanan Aktif
            </h2>
            <p className="text-xs text-[var(--muted)] max-w-xs mx-auto leading-relaxed">
              Semua pesanan jajan Anda telah selesai atau Anda belum melakukan pemesanan hari ini.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("menu")}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98] inline-flex items-center gap-2 min-h-[44px]"
          >
            <Utensils className="w-4 h-4" />
            <span>Pesan Makanan Sekarang</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-28 max-w-lg mx-auto">
      <div>
        <h1 className="font-bold text-xl text-[var(--foreground)]">
          Pesanan Sedang Diproses
        </h1>
        <p className="text-xs text-[var(--muted)]">
          Pantau status makanan dan minuman secara berkala
        </p>
      </div>

      {recentlyCancelledOrders.length > 0 &&
        dismissedCancelledId !== recentlyCancelledOrders[0].id && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs flex items-start justify-between gap-3 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-300">
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                <span>Pesanan {recentlyCancelledOrders[0].id} Ditolak Petugas Kantin</span>
              </div>
              <p className="text-rose-900 dark:text-rose-200 pl-5">
                Alasan: {recentlyCancelledOrders[0].cancellationReason || "Bahan habis atau antrean padat."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDismissedCancelledId(recentlyCancelledOrders[0].id)}
              className="p-1 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50"
              aria-label="Tutup notifikasi penolakan"
            >
              &times;
            </button>
          </div>
        )}

      {cancelError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/50 dark:border-rose-900 dark:text-rose-200 text-xs font-medium flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <span>{cancelError}</span>
        </div>
      )}

      <div className="space-y-4">
        {activeOrders.map((order) => {
          const stepIndex = getStatusStepIndex(order.orderStatus);
          const canCancel = order.orderStatus === "menunggu_konfirmasi";

          const steps = [
            { label: "Menunggu", desc: "Konfirmasi kantin" },
            { label: "Disiapkan", desc: "Makanan dimasak" },
            {
              label: order.fulfillmentMethod === "pickup" ? "Siap Ambil" : "Diantar",
              desc: order.fulfillmentMethod === "pickup" ? "Di kounter kantin" : "Menuju kelas/ruang",
            },
          ];

          return (
            <div
              key={order.id}
              className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-4"
            >
              {/* Order Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-[var(--foreground)]">
                      {order.id}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                      {order.fulfillmentMethod === "pickup" ? "Ambil Sendiri" : "Diantar"}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--muted)] block mt-0.5">
                    {new Date(order.createdAt).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {order.deliveryLocation && ` · ${order.deliveryLocation}`}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400 block">
                    {formatRupiah(order.total)}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                      order.paymentStatus === "lunas" ||
                      order.paymentStatus === "berhasil_disimulasikan"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {order.paymentStatus === "berhasil_disimulasikan"
                      ? "QRIS Terbayar"
                      : order.paymentStatus === "lunas"
                      ? "Lunas (Tunai)"
                      : "Belum Bayar (Tunai)"}
                  </span>
                </div>
              </div>

              {/* Progress Stepper Visualizer */}
              <div className="pt-2">
                <div className="grid grid-cols-3 gap-2 relative">
                  {steps.map((st, i) => {
                    const isCompleted = i < stepIndex;
                    const isCurrent = i === stepIndex;
                    return (
                      <div key={st.label} className="text-center space-y-1">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs font-bold transition-all ${
                            isCompleted
                              ? "bg-emerald-600 text-white"
                              : isCurrent
                              ? "bg-orange-600 text-white ring-4 ring-orange-100 dark:ring-orange-950"
                              : "bg-[var(--background-subtle)] text-[var(--muted)] border border-[var(--border)]"
                          }`}
                        >
                          {isCompleted ? <CheckCircle className="w-4 h-4" /> : i + 1}
                        </div>
                        <span
                          className={`text-xs block font-semibold leading-tight ${
                            isCurrent
                              ? "text-orange-600 dark:text-orange-400"
                              : isCompleted
                              ? "text-[var(--foreground)]"
                              : "text-[var(--muted)]"
                          }`}
                        >
                          {st.label}
                        </span>
                        <span className="text-[10px] text-[var(--muted)] hidden sm:block">
                          {st.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items List */}
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
              </div>

              {/* Payment Reminder & Actions */}
              <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                {order.paymentStatus === "belum_dibayar" && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1.5 rounded-lg border border-amber-200 dark:border-amber-900/60">
                    <Banknote className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Bayar tunai di kasir kantin</span>
                  </div>
                )}

                {canCancel ? (
                  <button
                    type="button"
                    onClick={() => setCancellingOrderId(order.id)}
                    className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline py-1.5 px-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 ml-auto min-h-[40px] flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Batalkan Pesanan</span>
                  </button>
                ) : (
                  <div className="text-[11px] text-[var(--muted)] flex items-center gap-1 ml-auto">
                    <Info className="w-3.5 h-3.5 text-orange-600" />
                    <span>Pesanan sudah disiapkan, tidak dapat dibatalkan</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cancellation Confirmation Modal */}
      {cancellingOrderId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-order-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCancellingOrderId(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="w-full max-w-xs bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 space-y-4 shadow-2xl">
            <h3 id="cancel-order-modal-title" className="font-bold text-sm text-[var(--foreground)]">
              Batalkan Pesanan {cancellingOrderId}?
            </h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Pesanan ini belum mulai disiapkan. Pembatalan akan memulihkan stok makanan kantin.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCancellingOrderId(null)}
                className="px-3.5 py-2 rounded-lg border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] min-h-[40px]"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => handleCancel(cancellingOrderId)}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold min-h-[40px]"
              >
                Ya, Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
