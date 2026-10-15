"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { UserRole } from "../types";
import { X, GraduationCap, Briefcase, Store, Check, Info } from "lucide-react";

interface RoleSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RoleSelectModal({ isOpen, onClose }: RoleSelectModalProps) {
  const { profile, setProfile } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>(profile.role);
  const [name, setName] = useState(profile.name);
  const [roomOrClass, setRoomOrClass] = useState(profile.roomOrClass || "");

  useEffect(() => {
    if (isOpen) {
      setSelectedRole(profile.role);
      setName(profile.name);
      setRoomOrClass(profile.roomOrClass || "");
    }
  }, [isOpen, profile]);

  // Handle escape key
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

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === "petugas") {
      setName("Petugas Kantin");
      setRoomOrClass("Kounter Kantin");
    } else if (role === "guru") {
      setName(profile.role === "guru" ? profile.name : "Ibu Siti Rahma");
      setRoomOrClass(profile.role === "guru" ? profile.roomOrClass || "Ruang Guru" : "Ruang Guru Meja 4");
    } else {
      setName(profile.role === "siswa" ? profile.name : "Budi Santoso");
      setRoomOrClass(profile.role === "siswa" ? profile.roomOrClass || "Kelas 8B" : "Kelas 8B");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      role: selectedRole,
      name: name.trim() || (selectedRole === "petugas" ? "Petugas Kantin" : "Pengguna Kantin"),
      roomOrClass: roomOrClass.trim() || undefined,
    });
    onClose();
  };

  const roles = [
    {
      id: "siswa" as UserRole,
      title: "Siswa",
      desc: "Lihat menu jajan, pesan untuk istirahat, ambil di kantin atau antar ke kelas.",
      icon: GraduationCap,
      color: "from-amber-500 to-orange-500",
    },
    {
      id: "guru" as UserRole,
      title: "Guru",
      desc: "Pesan makanan dan minuman dengan opsi pengantaran langsung ke ruang guru atau lab.",
      icon: Briefcase,
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: "petugas" as UserRole,
      title: "Petugas Kantin",
      desc: "Dashboard operasional kantin, proses pesanan, atur menu, stok, dan kasir.",
      icon: Store,
      color: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        className="w-full max-w-md bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-modal-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <div>
            <h2 id="role-modal-title" className="font-bold text-lg text-[var(--foreground)]">
              Pilih Peran Demo
            </h2>
            <p className="text-xs text-[var(--muted)]">
              Ganti peran kapan saja untuk menguji alur aplikasi
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-subtle)] transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Tutup dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4">
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-[var(--foreground)]">
              Pilih salah satu peran:
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleChange(r.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 min-h-[56px] ${
                      isSelected
                        ? "border-orange-500 bg-orange-50/60 dark:bg-orange-950/30 ring-1 ring-orange-500"
                        : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--background-subtle)]"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-br ${r.color} flex items-center justify-center text-white flex-shrink-0 mt-0.5`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-[var(--foreground)]">
                          {r.title}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-[var(--muted)] mt-0.5 leading-relaxed">
                        {r.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Profile Name & Class/Room for Siswa/Guru */}
          {selectedRole !== "petugas" && (
            <div className="pt-2 border-t border-[var(--border)] space-y-3">
              <div>
                <label
                  htmlFor="profile-name"
                  className="block text-xs font-semibold text-[var(--foreground)] mb-1"
                >
                  Nama Pemesan
                </label>
                <input
                  id="profile-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-orange-500 focus:outline-none min-h-[44px]"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-room"
                  className="block text-xs font-semibold text-[var(--foreground)] mb-1"
                >
                  {selectedRole === "siswa" ? "Kelas" : "Ruang / Lokasi Guru"}
                </label>
                <input
                  id="profile-room"
                  type="text"
                  value={roomOrClass}
                  onChange={(e) => setRoomOrClass(e.target.value)}
                  placeholder={
                    selectedRole === "siswa"
                      ? "Contoh: Kelas 8B"
                      : "Contoh: Ruang Guru Meja 4"
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-orange-500 focus:outline-none min-h-[44px]"
                />
              </div>
            </div>
          )}

          {/* Demo Disclaimer Note */}
          <div className="p-3 rounded-xl bg-[var(--background-subtle)] border border-[var(--border-subtle)] flex items-start gap-2.5 text-xs text-[var(--muted)] leading-relaxed">
            <Info className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
            <span>
              Semua peran berbagi data yang sama pada browser ini. Pergantian peran tidak menghapus riwayat pesanan yang sudah dibuat.
            </span>
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background-subtle)] transition-colors min-h-[44px]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-sm transition-colors min-h-[44px]"
            >
              Simpan & Masuk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
