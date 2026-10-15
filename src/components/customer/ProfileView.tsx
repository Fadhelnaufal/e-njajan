"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Check, Clock } from "lucide-react";

interface ProfileViewProps {
  onOpenRoleModal: () => void;
}

export function ProfileView({ onOpenRoleModal }: ProfileViewProps) {
  const { profile, updateProfileName } = useApp();
  const [name, setName] = useState(profile.name);
  const [room, setRoom] = useState(profile.roomOrClass || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileName(name, room);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const roleLabel = {
    user: "User / Pelanggan (Warga Sekolah)",
    petugas: "Petugas Kantin",
  }[profile.role as "user" | "petugas"] || "User / Pelanggan";

  return (
    <div className="space-y-5 pb-28 max-w-lg mx-auto">
      <div>
        <h1 className="font-bold text-xl text-[var(--foreground)]">
          Profil Pemesan
        </h1>
        <p className="text-xs text-[var(--muted)]">
          Atur identitas pemesan dan lokasi pengantaran Anda
        </p>
      </div>

      {/* Role Card Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xl font-bold">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/25 inline-block mb-1">
              Peran: {roleLabel}
            </span>
            <h2 className="font-bold text-base leading-tight">{profile.name}</h2>
            <p className="text-xs text-orange-100">
              {profile.roomOrClass || "Lokasi belum disetel"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenRoleModal}
          className="px-3.5 py-2 rounded-xl bg-white text-orange-700 text-xs font-bold hover:bg-orange-50 transition-colors shadow-sm flex-shrink-0 min-h-[44px]"
        >
          Ganti Peran
        </button>
      </div>

      {/* Profile Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4 shadow-sm"
      >
        <h3 className="font-bold text-sm text-[var(--foreground)]">
          Informasi Pemesan
        </h3>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Profil berhasil disimpan!</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label
            htmlFor="profile-name-input"
            className="text-xs font-semibold text-[var(--foreground)] block"
          >
            Nama Lengkap
          </label>
          <input
            id="profile-name-input"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-orange-500 focus:outline-none min-h-[44px]"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="profile-room-input"
            className="text-xs font-semibold text-[var(--foreground)] block"
          >
            Kelas / Ruangan / Lokasi Antar
          </label>
          <input
            id="profile-room-input"
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Contoh: Kelas 8B, Ruang Guru, atau Lab Komputer"
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-orange-500 focus:outline-none min-h-[44px]"
          />
          <span className="text-[11px] text-[var(--muted)] block">
            Lokasi ini akan otomatis terisi saat Anda memilih layanan pesan antar (delivery).
          </span>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-colors min-h-[44px]"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>

      {/* Canteen Schedule Guide */}
      <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--foreground)]">
          <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <span>Jadwal Jam Istirahat Sekolah</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-[var(--muted)]">
          <div className="p-2.5 rounded-xl bg-[var(--background-subtle)] space-y-1">
            <span className="font-semibold text-[var(--foreground)] block">
              Istirahat 1
            </span>
            <span>09.30 - 10.00 WIB</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--background-subtle)] space-y-1">
            <span className="font-semibold text-[var(--foreground)] block">
              Istirahat 2
            </span>
            <span>12.00 - 12.30 WIB</span>
          </div>
        </div>
        <p className="text-[11px] text-[var(--muted)] leading-relaxed">
          Tip: Pesan 10-15 menit sebelum bel istirahat berbunyi agar makanan sudah siap saat Anda tiba di kantin.
        </p>
      </div>
    </div>
  );
}
