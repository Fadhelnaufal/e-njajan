"use client";

import React, { useEffect } from "react";
import { useApp, formatRupiah } from "../../context/AppContext";
import { Order } from "../../types";
import { X, QrCode, CheckCircle, Info, Sparkles } from "lucide-react";

interface QrisModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QrisModal({ order, isOpen, onClose }: QrisModalProps) {
  const { simulateQrisPayment, orders } = useApp();

  // Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  // Retrieve latest status for this order from state
  const currentOrder = orders.find((o) => o.id === order.id) || order;
  const isPaid = currentOrder.paymentStatus === "berhasil_disimulasikan";

  const handleSimulatePayment = () => {
    simulateQrisPayment(currentOrder.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        className="w-full max-w-sm bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qris-modal-title"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 id="qris-modal-title" className="font-bold text-base text-[var(--foreground)]">
              Simulasi QRIS Kantin
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-subtle)] min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Tutup QRIS"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Body */}
        <div className="p-5 text-center space-y-4">
          <div className="space-y-1">
            <span className="text-xs text-[var(--muted)]">Total Tagihan Pesanan</span>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatRupiah(currentOrder.total)}
            </div>
            <p className="text-xs text-[var(--muted)]">
              Nomor Pesanan: <strong className="text-[var(--foreground)]">{currentOrder.id}</strong>
            </p>
          </div>

          {/* Dummy QR Code Visual */}
          <div className="p-4 rounded-2xl bg-white border-2 border-stone-200 inline-block shadow-inner mx-auto">
            <div className="w-48 h-48 bg-stone-50 p-2 relative flex flex-col justify-between">
              {/* Corner position markers */}
              <div className="flex justify-between">
                <div className="w-12 h-12 border-4 border-black p-1 flex items-center justify-center">
                  <div className="w-6 h-6 bg-black" />
                </div>
                <div className="w-12 h-12 border-4 border-black p-1 flex items-center justify-center">
                  <div className="w-6 h-6 bg-black" />
                </div>
              </div>

              {/* Center decorative logo */}
              <div className="self-center my-auto flex flex-col items-center">
                <div className="w-10 h-10 rounded-lg bg-orange-600 text-white font-bold text-[10px] flex items-center justify-center shadow-md">
                  QRIS
                </div>
                <span className="text-[9px] font-mono text-stone-500 mt-1 font-semibold">
                  E-NJAJAN
                </span>
              </div>

              {/* Bottom position marker and timing pattern */}
              <div className="flex justify-between items-end">
                <div className="w-12 h-12 border-4 border-black p-1 flex items-center justify-center">
                  <div className="w-6 h-6 bg-black" />
                </div>
                <div className="text-[10px] font-mono text-stone-400">
                  {currentOrder.id}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status Indicator */}
          {isPaid ? (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Pembayaran Berhasil Disimulasikan</span>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-[var(--background-subtle)] border border-[var(--border-subtle)] text-[11px] text-[var(--muted)] flex items-start gap-2 text-left">
              <Info className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <span>
                Ini adalah simulasi demo transaksi digital sekolah tanpa pemotongan saldo nyata.
              </span>
            </div>
          )}

          {/* Simulation CTA */}
          <div className="space-y-2 pt-1">
            {!isPaid ? (
              <button
                type="button"
                onClick={handleSimulatePayment}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Simulasikan Pembayaran Berhasil</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs transition-colors min-h-[44px]"
              >
                Selesai & Tutup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
