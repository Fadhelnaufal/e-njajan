"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useApp, formatRupiah } from "../../context/AppContext";
import { MenuItem, MenuCategory } from "../../types";
import {
  Search,
  X,
  Plus,
  Minus,
  Sparkles,
  ShoppingBag,
  Flame,
  AlertCircle,
  Eye,
} from "lucide-react";

export function MenuCatalog() {
  const {
    menu,
    cart,
    addToCart,
    updateCartQuantity,
    cartItemCount,
    cartSubtotal,
    setActiveTab,
    profile,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>("semua");
  const [selectedItemDetail, setSelectedItemDetail] = useState<MenuItem | null>(null);
  const [stockAlert, setStockAlert] = useState<string | null>(null);

  const categories = [
    { id: "semua" as MenuCategory, label: "Semua Menu", emoji: "🍽️" },
    { id: "makanan_berat" as MenuCategory, label: "Makanan Berat", emoji: "🍛" },
    { id: "camilan" as MenuCategory, label: "Camilan & Snack", emoji: "🥟" },
    { id: "minuman_dingin" as MenuCategory, label: "Minuman Dingin", emoji: "🥤" },
    { id: "minuman_hangat" as MenuCategory, label: "Minuman Hangat", emoji: "☕" },
  ];

  // Filter menu items
  const filteredItems = useMemo(() => {
    return menu.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory =
        selectedCategory === "semua" || item.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [menu, searchQuery, selectedCategory]);

  const handleAddToCart = (item: MenuItem) => {
    if (item.stock <= 0 || !item.isActive) return;
    const res = addToCart(item.id, 1);
    if (!res.success && res.message) {
      setStockAlert(res.message);
      setTimeout(() => setStockAlert(null), 3500);
    }
  };

  const getItemCartQty = (menuId: string) => {
    const found = cart.find((c) => c.menuId === menuId);
    return found ? found.quantity : 0;
  };

  // Close item detail modal on Escape key (R-32)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedItemDetail) {
        setSelectedItemDetail(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItemDetail]);

  return (
    <div className="space-y-5 pb-24">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-5 text-white shadow-md">
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Pesan Dini, Bebas Desak-Desakan</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Hai, {profile.name}!
          </h1>
          <p className="text-sm text-orange-100 mt-1 leading-relaxed">
            Pesan jajan dan minuman hangat kantin sekarang, nikmati istirahat tanpa antre di loket.
          </p>
        </div>
      </div>

      {/* Floating Stock Alert Toast */}
      {stockAlert && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/50 dark:border-rose-900 dark:text-rose-200 text-xs font-medium flex items-center justify-between gap-2 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{stockAlert}</span>
          </div>
          <button
            type="button"
            onClick={() => setStockAlert(null)}
            className="p-1 text-rose-600 hover:text-rose-800"
            aria-label="Tutup peringatan stok"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Bar & Clear */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nasi goreng, siomay, es teh..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:border-orange-500 focus:outline-none min-h-[46px] shadow-sm transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--muted)] hover:text-[var(--foreground)] min-h-[32px] min-w-[32px] flex items-center justify-center"
            aria-label="Hapus kata kunci pencarian"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills (Horizontal Scrollable) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all min-h-[40px] flex-shrink-0 ${
                isSelected
                  ? "bg-orange-600 text-white shadow-sm"
                  : "bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-subtle)]"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Menu Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
          <div className="w-14 h-14 rounded-full bg-[var(--background-subtle)] flex items-center justify-center mx-auto text-2xl">
            🔍
          </div>
          <h3 className="font-semibold text-base text-[var(--foreground)]">
            Menu tidak ditemukan
          </h3>
          <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
            Tidak ada makanan atau minuman yang cocok dengan pencarian &quot;{searchQuery}&quot;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("semua");
            }}
            className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold transition-colors min-h-[44px]"
          >
            Tampilkan Semua Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredItems.map((item) => {
            const inCartQty = getItemCartQty(item.id);
            const isOutOfStock = item.stock <= 0 || !item.isActive;

            return (
              <div
                key={item.id}
                className={`group rounded-2xl border transition-all p-3.5 flex flex-col justify-between ${
                  isOutOfStock
                    ? "bg-[var(--background-subtle)]/70 border-[var(--border-subtle)] opacity-75"
                    : "bg-[var(--card)] border-[var(--border)] hover:border-orange-300 dark:hover:border-orange-800 shadow-sm"
                }`}
              >
                <div className="flex gap-3">
                  {/* Item Image with Fallback Emoji */}
                  <div
                    onClick={() => setSelectedItemDetail(item)}
                    className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[var(--background-subtle)] flex-shrink-0 cursor-pointer flex items-center justify-center border border-[var(--border-subtle)]"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="text-3xl select-none" aria-hidden="true">
                      {item.emoji}
                    </span>

                    {/* Populer Badge */}
                    {item.isPopular && !isOutOfStock && (
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-amber-500 text-amber-950 font-bold text-[10px] flex items-center gap-0.5 shadow-sm">
                        <Flame className="w-2.5 h-2.5 fill-current" />
                        Favorit
                      </span>
                    )}

                    {/* Habis Badge */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[11px] shadow-sm">
                          Habis
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h2
                          onClick={() => setSelectedItemDetail(item)}
                          className="font-bold text-sm text-[var(--foreground)] hover:text-orange-600 transition-colors line-clamp-1 cursor-pointer"
                        >
                          {item.name}
                        </h2>
                      </div>
                      <p className="text-xs text-[var(--muted)] line-clamp-2 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-2 flex items-baseline justify-between gap-2">
                      <span className="font-bold text-sm text-orange-600 dark:text-orange-400">
                        {formatRupiah(item.price)}
                      </span>
                      <span
                        className={`text-[11px] font-medium ${
                          item.stock <= 5 && item.stock > 0
                            ? "text-rose-600 dark:text-rose-400 font-bold"
                            : "text-[var(--muted)]"
                        }`}
                      >
                        {isOutOfStock ? "Stok habis" : `Sisa ${item.stock}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="mt-3 pt-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedItemDetail(item)}
                    className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--foreground)] flex items-center gap-1 py-1.5 min-h-[44px]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Detail
                  </button>

                  {isOutOfStock ? (
                    <button
                      type="button"
                      disabled
                      className="px-3.5 py-1.5 rounded-lg bg-[var(--background-subtle)] text-[var(--muted)] text-xs font-semibold cursor-not-allowed min-h-[44px]"
                    >
                      Tidak Tersedia
                    </button>
                  ) : inCartQty > 0 ? (
                    <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, inCartQty - 1)}
                        className="w-9 h-9 rounded-lg bg-white dark:bg-stone-800 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 hover:bg-orange-100 flex items-center justify-center font-bold min-h-[40px] min-w-[40px] transition-colors"
                        aria-label={`Kurangi ${item.name}`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-bold text-orange-900 dark:text-orange-200 px-1.5 min-w-[20px] text-center">
                        {inCartQty}
                      </span>
                      <button
                        type="button"
                        disabled={inCartQty >= item.stock}
                        onClick={() => handleAddToCart(item)}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold min-h-[40px] min-w-[40px] transition-colors ${
                          inCartQty >= item.stock
                            ? "bg-stone-200 text-stone-400 dark:bg-stone-800 cursor-not-allowed"
                            : "bg-orange-600 text-white hover:bg-orange-700 shadow-sm"
                        }`}
                        aria-label={`Tambah ${item.name}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className="px-3.5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 min-h-[44px]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Tambah
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sticky Cart Preview Bar if items exist */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-20 left-4 right-4 z-20 max-w-md mx-auto animate-in slide-in-from-bottom-3">
          <button
            type="button"
            onClick={() => setActiveTab("cart")}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xl hover:from-orange-700 hover:to-amber-700 transition-all flex items-center justify-between gap-3 min-h-[52px]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">
                {cartItemCount}
              </div>
              <div className="text-left">
                <span className="text-xs text-orange-100 block">Keranjang Belanja</span>
                <span className="text-sm font-bold">{formatRupiah(cartSubtotal)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold bg-white/20 px-3 py-1.5 rounded-xl">
              <ShoppingBag className="w-4 h-4" />
              <span>Lihat Keranjang</span>
            </div>
          </button>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItemDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-sm bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="menu-detail-title"
          >
            <div className="relative h-44 bg-[var(--background-subtle)] flex items-center justify-center">
              <img
                src={selectedItemDetail.image}
                alt={selectedItemDetail.name}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
                className="w-full h-full object-cover"
              />
              <span className="text-5xl select-none" aria-hidden="true">
                {selectedItemDetail.emoji}
              </span>
              <button
                type="button"
                onClick={() => setSelectedItemDetail(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label="Tutup detail menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              <div>
                <div className="flex items-center gap-2">
                  <h3 id="menu-detail-title" className="font-bold text-lg text-[var(--foreground)]">
                    {selectedItemDetail.name}
                  </h3>
                  {selectedItemDetail.isPopular && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500 text-amber-950 font-bold text-[10px]">
                      Favorit
                    </span>
                  )}
                </div>
                <p className="text-sm text-[var(--muted)] mt-1.5 leading-relaxed">
                  {selectedItemDetail.description}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--background-subtle)]">
                <div>
                  <span className="text-xs text-[var(--muted)] block">Harga</span>
                  <span className="text-base font-bold text-orange-600 dark:text-orange-400">
                    {formatRupiah(selectedItemDetail.price)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[var(--muted)] block">Ketersediaan</span>
                  <span className="text-xs font-semibold text-[var(--foreground)]">
                    {selectedItemDetail.stock > 0
                      ? `${selectedItemDetail.stock} porsi tersedia`
                      : "Habis"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={selectedItemDetail.stock <= 0 || !selectedItemDetail.isActive}
                onClick={() => {
                  handleAddToCart(selectedItemDetail);
                  setSelectedItemDetail(null);
                }}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 min-h-[44px] ${
                  selectedItemDetail.stock <= 0 || !selectedItemDetail.isActive
                    ? "bg-stone-300 text-stone-500 dark:bg-stone-800 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-700 text-white shadow-md"
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>
                  {selectedItemDetail.stock <= 0 ? "Stok Habis" : "Tambah ke Keranjang"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
