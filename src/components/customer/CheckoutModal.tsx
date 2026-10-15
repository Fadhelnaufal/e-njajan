"use client";

import React, { useState, useEffect } from "react";
import { useApp, formatRupiah } from "../../context/AppContext";
import { FulfillmentMethod, PaymentMethod, Order } from "../../types";
import {
  X,
  Store,
  Truck,
  QrCode,
  Banknote,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Utensils,
  Receipt,
} from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQris: (order: Order) => void;
}

export function CheckoutModal({ isOpen, onClose, onOpenQris }: CheckoutModalProps) {
  const {
    cart,
    menu,
    cartSubtotal,
    cartItemCount,
    settings,
    profile,
    createOrder,
    setActiveTab,
  } = useApp();

  const [fulfillment, setFulfillment] = useState<FulfillmentMethod>("pickup");
  const [deliveryLocation, setDeliveryLocation] = useState(profile.roomOrClass || "");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qris");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setCreatedOrder(null);
      setDeliveryLocation(profile.roomOrClass || "");
    }
  }, [isOpen, profile]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !createdOrder) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, createdOrder]);

  if (!isOpen) return null;

  const deliveryFee = fulfillment === "delivery" ? settings.deliveryFee : 0;
  const grandTotal = cartSubtotal + deliveryFee;

  const quickLocationSuggestions = [
    "Kelas 7A",
    "Kelas 7B",
    "Kelas 8A",
    "Kelas 8B",
    "Kelas 9A",
    "Ruang Guru Meja 4",
    "Ruang Guru Utama",
    "Lab Komputer 1",
    "Perpustakaan",
  ];

  const handleConfirmOrder = () => {
    setErrorMessage(null);
    const result = createOrder({
      fulfillmentMethod: fulfillment,
      deliveryLocation: fulfillment === "delivery" ? deliveryLocation : undefined,
      paymentMethod,
    });

    if (!result.success) {
      setErrorMessage(result.error || "Gagal membuat pesanan.");
      return;
    }

    if (result.order) {
      setCreatedOrder(result.order);
      if (paymentMethod === "qris") {
        onOpenQris(result.order);
      }
    }
  };

  // If order was created successfully, show PRD Section 10 confirmation screen
  if (createdOrder) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
        <div
          className="w-full max-w-sm bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-2xl p-6 text-center space-y-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
              Pesanan Diterima
            </span>
            <h2 className="text-xl font-bold text-[var(--foreground)]">
              Nomor {createdOrder.id}
            </h2>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Pesanan atas nama <strong className="text-[var(--foreground)]">{createdOrder.customerName}</strong> telah diteruskan ke petugas kantin.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--background-subtle)] text-xs space-y-1.5 text-left border border-[var(--border-subtle)]">
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Layanan:</span>
              <span className="font-semibold text-[var(--foreground)]">
                {createdOrder.fulfillmentMethod === "pickup"
                  ? "Ambil Sendiri di Kantin"
                  : `Diantar ke ${createdOrder.deliveryLocation}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Metode Bayar:</span>
              <span className="font-semibold text-[var(--foreground)]">
                {createdOrder.paymentMethod === "qris" ? "QRIS Simulasi" : "Tunai di Kantin"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Total Transaksi:</span>
              <span className="font-bold text-orange-600 dark:text-orange-400">
                {formatRupiah(createdOrder.total)}
              </span>
            </div>
          </div>

          {/* 3 Actions required by PRD Section 10 */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                setActiveTab("active_orders");
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <Clock className="w-4 h-4" />
              <span>Lacak Pesanan</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                setActiveTab("menu");
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background-subtle)] font-medium text-xs transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <Utensils className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span>Kembali ke Menu</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                setActiveTab("history");
              }}
              className="w-full py-2 px-4 text-xs font-semibold text-[var(--muted)] hover:text-[var(--foreground)] hover:underline flex items-center justify-center gap-1 min-h-[40px]"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Lihat Riwayat</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        className="w-full max-w-md bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <div>
            <h2 id="checkout-modal-title" className="font-bold text-lg text-[var(--foreground)]">
              Konfirmasi Pemesanan
            </h2>
            <p className="text-xs text-[var(--muted)]">
              Pilih metode pemenuhan dan pembayaran
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-subtle)] transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Tutup checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/50 dark:border-rose-900 dark:text-rose-200 text-xs font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Fulfillment Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--foreground)] block">
              Metode Pengambilan
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setFulfillment("pickup")}
                className={`p-3 rounded-xl border text-left transition-all min-h-[56px] flex items-center gap-2.5 ${
                  fulfillment === "pickup"
                    ? "border-orange-500 bg-orange-50/60 dark:bg-orange-950/30 ring-1 ring-orange-500"
                    : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--background-subtle)]"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200 flex items-center justify-center flex-shrink-0">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-xs text-[var(--foreground)] block">
                    Ambil Sendiri
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    Gratis (Rp 0)
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFulfillment("delivery")}
                className={`p-3 rounded-xl border text-left transition-all min-h-[56px] flex items-center gap-2.5 ${
                  fulfillment === "delivery"
                    ? "border-orange-500 bg-orange-50/60 dark:bg-orange-950/30 ring-1 ring-orange-500"
                    : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--background-subtle)]"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-xs text-[var(--foreground)] block">
                    Pesan Antar
                  </span>
                  <span className="text-[11px] text-[var(--muted)] font-medium">
                    +{formatRupiah(settings.deliveryFee)}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Delivery Location Input (if delivery is selected) */}
          {fulfillment === "delivery" && (
            <div className="space-y-2 p-3.5 rounded-xl bg-[var(--background-subtle)] border border-[var(--border)]">
              <label
                htmlFor="delivery-location"
                className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                <span>Lokasi Pengantaran (Wajib)</span>
              </label>
              <input
                id="delivery-location"
                type="text"
                required
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder="Contoh: Kelas 8B, Ruang Guru Meja 4, Lab Komputer..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:border-orange-500 focus:outline-none min-h-[44px]"
              />
              <div className="pt-1">
                <span className="text-[11px] text-[var(--muted)] block mb-1">
                  Pilihan cepat:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickLocationSuggestions.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setDeliveryLocation(loc)}
                      className="text-[11px] px-2 py-1 rounded-md bg-[var(--card)] border border-[var(--border)] hover:border-orange-400 text-[var(--foreground)] transition-colors"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--foreground)] block">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod("qris")}
                className={`p-3 rounded-xl border text-left transition-all min-h-[56px] flex items-center gap-2.5 ${
                  paymentMethod === "qris"
                    ? "border-orange-500 bg-orange-50/60 dark:bg-orange-950/30 ring-1 ring-orange-500"
                    : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--background-subtle)]"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200 flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-xs text-[var(--foreground)] block">
                    QRIS Simulasi
                  </span>
                  <span className="text-[11px] text-[var(--muted)]">Scan & bayar</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("tunai")}
                className={`p-3 rounded-xl border text-left transition-all min-h-[56px] flex items-center gap-2.5 ${
                  paymentMethod === "tunai"
                    ? "border-orange-500 bg-orange-50/60 dark:bg-orange-950/30 ring-1 ring-orange-500"
                    : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--background-subtle)]"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200 flex items-center justify-center flex-shrink-0">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-xs text-[var(--foreground)] block">
                    Bayar Tunai
                  </span>
                  <span className="text-[11px] text-[var(--muted)]">Bayar di tempat</span>
                </div>
              </button>
            </div>
          </div>

          {/* Order Summary & Pricing Breakdown */}
          <div className="p-3.5 rounded-xl bg-[var(--background-subtle)] border border-[var(--border)] space-y-2 text-xs">
            <span className="font-semibold text-[var(--foreground)] block">
              Item Pesanan ({cartItemCount})
            </span>
            <div className="space-y-1 text-[var(--muted)]">
              {cart.map((c) => {
                const item = menu.find((m) => m.id === c.menuId);
                if (!item) return null;
                return (
                  <div key={c.menuId} className="flex justify-between">
                    <span>
                      {c.quantity}x {item.name}
                    </span>
                    <span className="font-medium text-[var(--foreground)]">
                      {formatRupiah(item.price * c.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="pt-2 border-t border-[var(--border)] space-y-1">
              <div className="flex justify-between text-[var(--muted)]">
                <span>Subtotal</span>
                <span>{formatRupiah(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-[var(--muted)]">
                <span>Biaya Pengantaran</span>
                <span>{formatRupiah(deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[var(--foreground)] pt-1">
                <span>Total Biaya</span>
                <span className="text-orange-600 dark:text-orange-400">
                  {formatRupiah(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--card)] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--background-subtle)] transition-colors min-h-[44px]"
          >
            Kembali
          </button>
          <button
            type="button"
            onClick={handleConfirmOrder}
            className="flex-1 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
          >
            <span>Konfirmasi & Buat Pesanan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
