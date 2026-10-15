"use client";

import React, { useState, useEffect } from "react";
import { useApp, formatRupiah } from "../../context/AppContext";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Utensils,
  AlertCircle,
} from "lucide-react";

interface CartViewProps {
  onOpenCheckout: () => void;
}

export function CartView({ onOpenCheckout }: CartViewProps) {
  const {
    cart,
    menu,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartItemCount,
    setActiveTab,
    settings,
  } = useApp();

  const [confirmClear, setConfirmClear] = useState(false);

  // Close clear cart confirmation modal on Escape key (R-32)
  useEffect(() => {
    if (!confirmClear) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setConfirmClear(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [confirmClear]);

  // Check if any cart item has insufficient stock
  const stockIssues = cart.map((c) => {
    const item = menu.find((m) => m.id === c.menuId);
    if (!item) return { menuId: c.menuId, name: "Menu tidak ditemukan", isOver: true, stock: 0 };
    return {
      menuId: c.menuId,
      name: item.name,
      isOver: c.quantity > item.stock,
      stock: item.stock,
    };
  }).filter((i) => i.isOver);

  if (cart.length === 0) {
    return (
      <div className="py-16 text-center space-y-4 bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="font-bold text-lg text-[var(--foreground)]">
            Keranjang Masih Kosong
          </h2>
          <p className="text-xs text-[var(--muted)] max-w-xs mx-auto leading-relaxed">
            Yuk pilih jajanan lezat atau minuman segar dari kantin sekolah untuk dinikmati saat istirahat.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setActiveTab("menu")}
          className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition-colors inline-flex items-center gap-2 min-h-[44px]"
        >
          <Utensils className="w-4 h-4" />
          <span>Lihat Menu Kantin</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-28 max-w-lg mx-auto">
      {/* Title & Clear Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl text-[var(--foreground)]">
            Keranjang Jajan
          </h1>
          <p className="text-xs text-[var(--muted)]">
            {cartItemCount} item makanan dan minuman dipilih
          </p>
        </div>
        <button
          type="button"
          onClick={() => setConfirmClear(true)}
          className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 py-1 min-h-[44px]"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Kosongkan</span>
        </button>
      </div>

      {/* Stock warning banner if any item exceeds stock */}
      {stockIssues.length > 0 && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-200 text-xs font-medium space-y-1">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>Sebagian pesanan melebihi stok tersedia:</span>
          </div>
          <ul className="list-disc list-inside pl-1 space-y-0.5 text-[11px]">
            {stockIssues.map((issue) => (
              <li key={issue.menuId}>
                {issue.name} (sisa stok: {issue.stock})
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-rose-700 dark:text-rose-300 pt-1">
            Silakan kurangi jumlah item agar checkout dapat dilanjutkan.
          </p>
        </div>
      )}

      {/* Cart Items List */}
      <div className="space-y-3">
        {cart.map((cartItem) => {
          const item = menu.find((m) => m.id === cartItem.menuId);
          if (!item) return null;
          const isOverStock = cartItem.quantity > item.stock;

          return (
            <div
              key={cartItem.menuId}
              className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                isOverStock
                  ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800"
                  : "bg-[var(--card)] border-[var(--border)]"
              }`}
            >
              {/* Thumbnail / Emoji */}
              <div className="w-14 h-14 rounded-xl bg-[var(--background-subtle)] overflow-hidden flex items-center justify-center flex-shrink-0 border border-[var(--border-subtle)]">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                  className="w-full h-full object-cover"
                />
                <span className="text-xl" aria-hidden="true">
                  {item.emoji}
                </span>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-[var(--foreground)] truncate">
                  {item.name}
                </h3>
                <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                  {formatRupiah(item.price)}
                </span>
                {isOverStock && (
                  <span className="block text-[11px] font-bold text-rose-600 mt-0.5">
                    Maks. stok: {item.stock}
                  </span>
                )}
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-1.5 bg-[var(--background-subtle)] border border-[var(--border)] rounded-lg p-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => updateCartQuantity(item.id, cartItem.quantity - 1)}
                  className="w-8 h-8 rounded bg-[var(--card)] text-[var(--foreground)] hover:bg-orange-100 dark:hover:bg-orange-950/40 flex items-center justify-center font-bold min-h-[40px] min-w-[40px]"
                  aria-label={`Kurangi ${item.name}`}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-[var(--foreground)] px-1 min-w-[18px] text-center">
                  {cartItem.quantity}
                </span>
                <button
                  type="button"
                  disabled={cartItem.quantity >= item.stock}
                  onClick={() => updateCartQuantity(item.id, cartItem.quantity + 1)}
                  className={`w-8 h-8 rounded flex items-center justify-center font-bold min-h-[40px] min-w-[40px] ${
                    cartItem.quantity >= item.stock
                      ? "bg-stone-200 text-stone-400 dark:bg-stone-800 cursor-not-allowed"
                      : "bg-orange-600 text-white hover:bg-orange-700"
                  }`}
                  aria-label={`Tambah ${item.name}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-stone-400 hover:text-rose-600 min-h-[40px] min-w-[40px] flex items-center justify-center"
                aria-label={`Hapus ${item.name} dari keranjang`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Summary Card */}
      <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-3">
        <h3 className="font-bold text-sm text-[var(--foreground)]">
          Ringkasan Belanja
        </h3>
        <div className="space-y-1.5 text-xs text-[var(--muted)]">
          <div className="flex justify-between">
            <span>Subtotal ({cartItemCount} item)</span>
            <span className="font-semibold text-[var(--foreground)]">
              {formatRupiah(cartSubtotal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Opsi Ambil Sendiri (Pickup)</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              Rp 0
            </span>
          </div>
          <div className="flex justify-between">
            <span>Opsi Pesan Antar (Delivery)</span>
            <span>+ {formatRupiah(settings.deliveryFee)}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-[var(--border)] flex items-baseline justify-between">
          <div>
            <span className="text-xs text-[var(--muted)] block">Total Pembayaran</span>
            <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {formatRupiah(cartSubtotal)}
            </span>
          </div>

          <button
            type="button"
            disabled={stockIssues.length > 0 || !settings.isServiceActive}
            onClick={onOpenCheckout}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md min-h-[46px] ${
              stockIssues.length > 0 || !settings.isServiceActive
                ? "bg-stone-300 text-stone-500 dark:bg-stone-800 cursor-not-allowed shadow-none"
                : "bg-orange-600 hover:bg-orange-700 text-white"
            }`}
          >
            <span>Lanjut Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {confirmClear && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-cart-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmClear(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="w-full max-w-xs bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 space-y-4 shadow-xl">
            <h3 id="clear-cart-modal-title" className="font-bold text-sm text-[var(--foreground)]">
              Kosongkan Keranjang?
            </h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Semua makanan dan minuman yang sudah dipilih akan dihapus dari keranjang.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="px-3.5 py-2 rounded-lg border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] min-h-[40px]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  setConfirmClear(false);
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold min-h-[40px]"
              >
                Ya, Kosongkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
