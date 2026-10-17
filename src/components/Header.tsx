"use client";

import React from "react";
import { useApp } from "../context/AppContext";
import {
  UtensilsCrossed,
  User,
  Bell,
  Moon,
  Sun,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

interface HeaderProps {
  onOpenRoleModal: () => void;
  onOpenNotifModal: () => void;
}

export function Header({ onOpenRoleModal, onOpenNotifModal }: HeaderProps) {
  const {
    profile,
    settings,
    theme,
    toggleTheme,
    unreadNotificationCount,
    isCloudConnected,
  } = useApp();

  const roleBadgeLabel = {
    user: "Pelanggan",
    petugas: "Petugas Kantin",
  }[profile.role as "user" | "petugas"] || "Pelanggan";

  return (
    <header className="sticky top-0 z-30 bg-[var(--card)]/95 backdrop-blur-md border-b border-[var(--border)] transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand & Canteen Name */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-lg leading-tight tracking-tight text-[var(--foreground)]">
                e-njajan
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded font-medium bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 flex items-center gap-0.5">
                <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                Kantin
              </span>
              {isCloudConnected && (
                <span
                  title="Tersambung ke database cloud Supabase dengan Realtime aktif"
                  className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Cloud Live</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--muted)] truncate">
              {settings.canteenName}
            </p>
          </div>
        </div>

        {/* Actions & Role Switcher */}
        <div className="flex items-center gap-2">
          {/* Quick Role Switcher Button */}
          <button
            type="button"
            onClick={onOpenRoleModal}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background-subtle)] hover:bg-[var(--primary-light)] hover:border-orange-300 dark:hover:border-orange-700 transition-colors text-[var(--foreground)] min-h-[40px]"
            title="Klik untuk berganti peran demo"
          >
            <User className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            <span className="hidden sm:inline font-semibold">{profile.name}</span>
            <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 font-semibold">
              {roleBadgeLabel}
            </span>
          </button>

          {/* In-App Notifications Bell */}
          <button
            type="button"
            onClick={onOpenNotifModal}
            aria-label="Buka notifikasi"
            className="relative p-2 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--background-subtle)] transition-colors text-[var(--foreground)] min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Ganti ke tema gelap" : "Ganti ke tema terang"}
            className="p-2 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--background-subtle)] transition-colors text-[var(--foreground)] min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4 text-stone-600" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>
        </div>
      </div>

      {/* Canteen Inactive Banner (PRD Section 7.8) */}
      {!settings.isServiceActive && (
        <div className="bg-amber-500/15 border-t border-amber-300 dark:border-amber-800 px-4 py-2">
          <div className="max-w-4xl mx-auto flex items-center gap-2 text-xs font-medium text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span>
              Layanan kantin saat ini dinonaktifkan sementara oleh petugas. Anda tetap dapat melihat menu dan riwayat, namun checkout pesanan baru ditutup.
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
