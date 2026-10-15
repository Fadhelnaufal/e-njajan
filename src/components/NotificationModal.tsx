"use client";

import React, { useEffect } from "react";
import { useApp } from "../context/AppContext";
import { X, Bell, CheckCheck, Clock, CheckCircle, AlertCircle, ShoppingBag } from "lucide-react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationCount,
  } = useApp();

  // Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "order_created":
        return <ShoppingBag className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
      case "status_changed":
        return <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case "payment_confirmed":
        return <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case "order_cancelled":
        return <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      default:
        return <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        className="w-full max-w-md bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notif-modal-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h2 id="notif-modal-title" className="font-bold text-lg text-[var(--foreground)]">
              Notifikasi Kantin
            </h2>
            {unreadNotificationCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 font-semibold">
                {unreadNotificationCount} baru
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {notifications.length > 0 && unreadNotificationCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsAsRead}
                className="text-xs font-medium text-orange-600 dark:text-orange-400 hover:underline px-2 py-1 flex items-center gap-1 min-h-[36px]"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Tandai dibaca
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-subtle)] transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Tutup dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[var(--background-subtle)] flex items-center justify-center mx-auto text-[var(--muted)]">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-[var(--foreground)]">
                Belum ada notifikasi
              </p>
              <p className="text-xs text-[var(--muted)] max-w-xs mx-auto">
                Setiap pembaruan pesanan dan konfirmasi pembayaran akan muncul di sini.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-3 rounded-xl border transition-colors cursor-pointer flex items-start gap-3 ${
                  !notif.isRead
                    ? "bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800"
                    : "bg-[var(--card)] border-[var(--border)] hover:bg-[var(--background-subtle)]"
                }`}
              >
                <div className="p-2 rounded-lg bg-[var(--background-subtle)] flex-shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-semibold text-[var(--foreground)] truncate">
                      {notif.title}
                    </h3>
                    <span className="text-[11px] text-[var(--muted)] flex-shrink-0">
                      {formatTime(notif.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted)] mt-0.5 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
