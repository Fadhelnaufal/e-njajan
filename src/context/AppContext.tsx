"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  UserProfile,
  UserRole,
  MenuItem,
  CartItem,
  Order,
  OrderStatus,
  PaymentMethod,
  FulfillmentMethod,
  CanteenSettings,
  InAppNotification,
  ToastNotification,
} from "../types";
import {
  INITIAL_MENU_ITEMS,
  INITIAL_ORDERS,
  INITIAL_CANTEEN_SETTINGS,
  INITIAL_USER_PROFILE,
} from "../data/initialData";
import {
  supabase,
  mapDbToMenuItem,
  mapMenuItemToDb,
  mapDbToOrder,
  mapOrderToDb,
  mapDbToSettings,
  DbMenuRow,
  DbOrderRow,
  DbSettingsRow,
} from "../lib/supabase";

interface AppContextType {
  isHydrated: boolean;
  isCloudConnected: boolean;
  theme: "light" | "dark";
  toggleTheme: () => void;
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  switchRole: (role: UserRole) => void;
  updateProfileName: (name: string, roomOrClass?: string) => void;
  
  menu: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, "id">) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  updateStock: (id: string, deltaOrExact: number, isExact?: boolean) => void;

  cart: CartItem[];
  addToCart: (menuId: string, quantity?: number) => { success: boolean; message?: string };
  updateCartQuantity: (menuId: string, quantity: number) => void;
  removeFromCart: (menuId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartItemCount: number;

  orders: Order[];
  createOrder: (params: {
    fulfillmentMethod: FulfillmentMethod;
    deliveryLocation?: string;
    paymentMethod: PaymentMethod;
  }) => { success: boolean; order?: Order; error?: string };
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  cancelOrder: (orderId: string, reason?: string) => { success: boolean; error?: string };
  confirmCashPayment: (orderId: string) => void;
  simulateQrisPayment: (orderId: string) => void;

  settings: CanteenSettings;
  updateSettings: (updates: Partial<CanteenSettings>) => void;
  resetDemoData: () => void;
  restoreDailyStock: () => void;

  notifications: InAppNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  toasts: ToastNotification[];
  showToast: (
    title: string,
    message: string,
    type?: ToastNotification["type"],
    actionTab?: ToastNotification["actionTab"]
  ) => void;
  removeToast: (id: string) => void;

  // Active view helpers
  activeTab: "menu" | "cart" | "active_orders" | "history" | "profile";
  setActiveTab: (tab: "menu" | "cart" | "active_orders" | "history" | "profile") => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  THEME: "enjajan_theme_v1",
  PROFILE: "enjajan_profile_v1",
  MENU: "enjajan_menu_v1",
  CART: "enjajan_cart_v1",
  ORDERS: "enjajan_orders_v1",
  SETTINGS: "enjajan_settings_v1",
  NOTIFICATIONS: "enjajan_notifs_v1",
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [settings, setSettings] = useState<CanteenSettings>(INITIAL_CANTEEN_SETTINGS);
  const [notifications, setNotifications] = useState<InAppNotification[]>([
    {
      id: "notif-init",
      title: "Selamat Datang di e-njajan!",
      message: "Aplikasi kantin sekolah siap digunakan untuk pemesanan bebas antre.",
      timestamp: "2026-10-14T07:00:00.000Z",
      type: "order_created",
      isRead: false,
    },
  ]);
  const [activeTab, setActiveTab] = useState<
    "menu" | "cart" | "active_orders" | "history" | "profile"
  >("menu");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Floating Toast Notification System
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = useCallback(
    (
      title: string,
      message: string,
      type: ToastNotification["type"] = "info",
      actionTab?: ToastNotification["actionTab"]
    ) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newToast: ToastNotification = {
        id,
        title,
        message,
        type,
        actionTab,
        timestamp: Date.now(),
      };
      setToasts((prev) => [newToast, ...prev].slice(0, 3));

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as "light" | "dark" | null;
      if (storedTheme) {
        setTheme(storedTheme);
        document.documentElement.setAttribute("data-theme", storedTheme);
      }

      const storedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        if (parsed.role === "siswa" || parsed.role === "guru") {
          parsed.role = "user";
        }
        setProfile(parsed);
      }

      const storedMenu = localStorage.getItem(STORAGE_KEYS.MENU);
      if (storedMenu) setMenu(JSON.parse(storedMenu));

      const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (storedOrders) setOrders(JSON.parse(storedOrders));

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (storedSettings) setSettings(JSON.parse(storedSettings));

      const storedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (storedNotifs) setNotifications(JSON.parse(storedNotifs));
    } catch (e) {
      console.warn("Could not load state from localStorage:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const [isCloudConnected, setIsCloudConnected] = useState(false);

  // Initial load from Supabase with graceful fallback
  useEffect(() => {
    if (!isHydrated) return;
    let isMounted = true;

    async function loadCloudData() {
      try {
        // 1. Fetch settings
        const { data: settingsData } = await supabase
          .from("canteen_settings")
          .select("*")
          .eq("id", "default")
          .single();
        if (settingsData && isMounted) {
          setSettings(mapDbToSettings(settingsData));
        }

        // 2. Fetch menu
        const { data: menuData } = await supabase
          .from("menu")
          .select("*")
          .order("id");
        if (menuData && menuData.length > 0 && isMounted) {
          setMenu(menuData.map(mapDbToMenuItem));
        }

        // 3. Fetch orders
        const { data: ordersData } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });
        if (ordersData && ordersData.length > 0 && isMounted) {
          setOrders(ordersData.map(mapDbToOrder));
        }

        if (isMounted) {
          setIsCloudConnected(true);
        }
      } catch (err) {
        console.warn("Supabase initial sync using local storage:", err);
      }
    }

    loadCloudData();

    return () => {
      isMounted = false;
    };
  }, [isHydrated]);

  const profileRef = useRef(profile);
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  const showToastRef = useRef(showToast);
  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  // Realtime subscription via Supabase WebSockets
  useEffect(() => {
    if (!isHydrated) return;

    const ordersChannel = supabase
      .channel("orders-realtime-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newOrder = mapDbToOrder(payload.new as unknown as DbOrderRow);
            setOrders((prev) => {
              if (prev.some((o) => o.id === newOrder.id)) return prev;
              return [newOrder, ...prev];
            });
            setIsCloudConnected(true);
            if (profileRef.current.role === "petugas") {
              showToastRef.current(
                "Pesanan Baru Masuk! 🔔",
                `${newOrder.id} dari ${newOrder.customerName} (${formatRupiah(newOrder.total)})`,
                "info"
              );
            }
          } else if (payload.eventType === "UPDATE") {
            const updated = mapDbToOrder(payload.new as unknown as DbOrderRow);
            setOrders((prev) =>
              prev.map((o) => (o.id === updated.id ? updated : o))
            );
            setIsCloudConnected(true);

            // Toast feedback for customer
            if (updated.customerName === profileRef.current.name && profileRef.current.role !== "petugas") {
              if (updated.orderStatus === "sedang_disiapkan") {
                showToastRef.current(
                  "Pesanan Sedang Disiapkan 🍳",
                  `Petugas kantin mulai memasak pesanan ${updated.id}.`,
                  "info",
                  "active_orders"
                );
              } else if (updated.orderStatus === "siap_diambil") {
                showToastRef.current(
                  "Pesanan Siap Diambil! 🛎️",
                  `Makanan pesanan ${updated.id} sudah siap di kounter kantin.`,
                  "success",
                  "active_orders"
                );
              } else if (updated.orderStatus === "dalam_pengantaran") {
                showToastRef.current(
                  "Pesanan Sedang Diantar 🛵",
                  `Kurir sedang mengantar pesanan ${updated.id} ke ${updated.deliveryLocation || "ruangan Anda"}.`,
                  "info",
                  "active_orders"
                );
              } else if (updated.orderStatus === "selesai") {
                showToastRef.current(
                  "Pesanan Selesai ✨",
                  `Pesanan ${updated.id} telah tuntas diserahkan. Selamat menikmati!`,
                  "success",
                  "history"
                );
              } else if (updated.orderStatus === "dibatalkan") {
                const reasonStr = updated.cancellationReason ? `: ${updated.cancellationReason}` : "";
                showToastRef.current(
                  "Pesanan Ditolak/Dibatalkan ⚠️",
                  `Pesanan ${updated.id} ditolak kantin${reasonStr}.`,
                  "error",
                  "active_orders"
                );
              } else if (updated.paymentStatus === "lunas") {
                showToastRef.current(
                  "Pembayaran Tunai Lunas 💵",
                  `Pembayaran pesanan ${updated.id} telah dikonfirmasi lunas oleh kasir.`,
                  "success",
                  "active_orders"
                );
              }
            }
          } else if (payload.eventType === "DELETE") {
            const deleted = payload.old as unknown as { id?: string };
            if (deleted?.id) {
              setOrders((prev) => prev.filter((o) => o.id !== deleted.id));
            }
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsCloudConnected(true);
        }
      });

    const menuChannel = supabase
      .channel("menu-realtime-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newItem = mapDbToMenuItem(payload.new as unknown as DbMenuRow);
            setMenu((prev) => {
              if (prev.some((m) => m.id === newItem.id)) return prev;
              return [...prev, newItem];
            });
          } else if (payload.eventType === "UPDATE") {
            const updated = mapDbToMenuItem(payload.new as unknown as DbMenuRow);
            setMenu((prev) =>
              prev.map((m) => (m.id === updated.id ? updated : m))
            );
          } else if (payload.eventType === "DELETE") {
            const deleted = payload.old as unknown as { id?: string };
            if (deleted?.id) {
              setMenu((prev) => prev.filter((m) => m.id !== deleted.id));
            }
          }
        }
      )
      .subscribe();

    const settingsChannel = supabase
      .channel("settings-realtime-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "canteen_settings" },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            const updated = mapDbToSettings(payload.new as unknown as DbSettingsRow);
            setSettings(updated);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(menuChannel);
      supabase.removeChannel(settingsChannel);
    };
  }, [isHydrated]);

  // Save changes to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      document.documentElement.setAttribute("data-theme", theme);
    } catch {}
  }, [theme, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch {}
  }, [profile, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menu));
    } catch {}
  }, [menu, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {}
  }, [cart, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {}
  }, [orders, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {}
  }, [settings, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch {}
  }, [notifications, isHydrated]);

  // Helpers
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const addNotification = (
    title: string,
    message: string,
    type: InAppNotification["type"]
  ) => {
    const newNotif: InAppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title,
      message,
      timestamp: new Date().toISOString(),
      type,
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  const switchRole = (role: UserRole) => {
    setProfile((prev) => ({
      ...prev,
      role,
      name:
        role === "petugas"
          ? "Petugas Kantin"
          : prev.role === "user"
          ? prev.name
          : "Budi Santoso",
      roomOrClass:
        role === "petugas"
          ? "Kounter Kantin"
          : prev.roomOrClass || "Kelas 8B",
    }));
  };

  const updateProfileName = (name: string, roomOrClass?: string) => {
    setProfile((prev) => ({
      ...prev,
      name: name.trim() || prev.name,
      roomOrClass: roomOrClass !== undefined ? roomOrClass : prev.roomOrClass,
    }));
  };

  // Menu Management
  const addMenuItem = (item: Omit<MenuItem, "id">) => {
    const newItem: MenuItem = {
      ...item,
      id: `menu-${Date.now()}`,
    };
    setMenu((prev) => [newItem, ...prev]);
    supabase.from("menu").insert(mapMenuItemToDb(newItem)).then();
    addNotification("Menu Ditambahkan", `Menu baru "${item.name}" berhasil ditambahkan.`, "status_changed");
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    let targetItem: MenuItem | undefined;
    setMenu((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          targetItem = { ...m, ...updates };
          return targetItem;
        }
        return m;
      })
    );
    if (targetItem) {
      supabase.from("menu").update(mapMenuItemToDb(targetItem)).eq("id", id).then();
    }
  };

  const deleteMenuItem = (id: string) => {
    const item = menu.find((m) => m.id === id);
    setMenu((prev) => prev.filter((m) => m.id !== id));
    setCart((prev) => prev.filter((c) => c.menuId !== id));
    supabase.from("menu").delete().eq("id", id).then();
    if (item) {
      addNotification("Menu Dihapus", `Menu "${item.name}" telah dihapus dari katalog.`, "status_changed");
    }
  };

  const updateStock = (id: string, deltaOrExact: number, isExact = false) => {
    let targetStock = 0;
    setMenu((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          targetStock = isExact
            ? Math.max(0, deltaOrExact)
            : Math.max(0, m.stock + deltaOrExact);
          return { ...m, stock: targetStock };
        }
        return m;
      })
    );
    supabase.from("menu").update({ stock: targetStock }).eq("id", id).then();
  };

  // Cart Management
  const addToCart = (menuId: string, quantity = 1) => {
    const item = menu.find((m) => m.id === menuId);
    if (!item || !item.isActive) {
      return { success: false, message: "Menu tidak tersedia." };
    }
    const existing = cart.find((c) => c.menuId === menuId);
    const currentQty = existing ? existing.quantity : 0;
    const targetQty = currentQty + quantity;

    if (targetQty > item.stock) {
      return {
        success: false,
        message: `Stok tidak mencukupi. Sisa stok tersedia hanya ${item.stock}.`,
      };
    }

    if (existing) {
      setCart((prev) =>
        prev.map((c) =>
          c.menuId === menuId ? { ...c, quantity: targetQty } : c
        )
      );
    } else {
      setCart((prev) => [...prev, { menuId, quantity: targetQty }]);
    }
    return { success: true };
  };

  const updateCartQuantity = (menuId: string, quantity: number) => {
    const item = menu.find((m) => m.id === menuId);
    if (!item) return;

    if (quantity <= 0) {
      removeFromCart(menuId);
      return;
    }

    const validQty = Math.min(quantity, item.stock);
    setCart((prev) =>
      prev.map((c) => (c.menuId === menuId ? { ...c, quantity: validQty } : c))
    );
  };

  const removeFromCart = (menuId: string) => {
    setCart((prev) => prev.filter((c) => c.menuId !== menuId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => {
    const menuItem = menu.find((m) => m.id === item.menuId);
    return sum + (menuItem ? menuItem.price * item.quantity : 0);
  }, 0);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Orders Management
  const createOrder = ({
    fulfillmentMethod,
    deliveryLocation,
    paymentMethod,
  }: {
    fulfillmentMethod: FulfillmentMethod;
    deliveryLocation?: string;
    paymentMethod: PaymentMethod;
  }) => {
    if (!settings.isServiceActive) {
      return {
        success: false,
        error: "Layanan kantin sedang dinonaktifkan sementara oleh petugas.",
      };
    }

    if (cart.length === 0) {
      return { success: false, error: "Keranjang belanja masih kosong." };
    }

    // Re-validate stock for every item (PRD 7.3)
    for (const item of cart) {
      const menuItem = menu.find((m) => m.id === item.menuId);
      if (!menuItem) {
        return {
          success: false,
          error: "Terdapat menu dalam keranjang yang sudah tidak ada.",
        };
      }
      if (!menuItem.isActive) {
        return {
          success: false,
          error: `Menu "${menuItem.name}" sedang tidak aktif.`,
        };
      }
      if (item.quantity > menuItem.stock) {
        return {
          success: false,
          error: `Stok "${menuItem.name}" tidak mencukupi (Tersedia: ${menuItem.stock}, Dipesan: ${item.quantity}). Silakan sesuaikan jumlah di keranjang.`,
        };
      }
    }

    if (fulfillmentMethod === "delivery" && (!deliveryLocation || !deliveryLocation.trim())) {
      return {
        success: false,
        error: "Lokasi pengantaran wajib diisi untuk layanan pesan antar (delivery).",
      };
    }

    // Deduct stock in real-time and sync to Supabase (Finding 8)
    setMenu((prev) =>
      prev.map((m) => {
        const cartItem = cart.find((c) => c.menuId === m.id);
        if (cartItem) {
          const newStock = Math.max(0, m.stock - cartItem.quantity);
          supabase.from("menu").update({ stock: newStock }).eq("id", m.id).then();
          return { ...m, stock: newStock };
        }
        return m;
      })
    );

    // Build order items snapshot
    const orderItems = cart.map((c) => {
      const m = menu.find((item) => item.id === c.menuId)!;
      return {
        menuId: m.id,
        name: m.name,
        price: m.price,
        quantity: c.quantity,
        emoji: m.emoji,
      };
    });

    const subtotal = orderItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const deliveryFee = fulfillmentMethod === "delivery" ? settings.deliveryFee : 0;
    const total = subtotal + deliveryFee;

    // Generate daily order ID (e.g. KNT-005)
    const orderNumber = `KNT-${String(orders.length + 1).padStart(3, "0")}`;

    const newOrder: Order = {
      id: orderNumber,
      createdAt: new Date().toISOString(),
      customerName: profile.name,
      customerRole: "user",
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      fulfillmentMethod,
      deliveryLocation: fulfillmentMethod === "delivery" ? deliveryLocation?.trim() : undefined,
      orderStatus: "menunggu_konfirmasi",
      paymentMethod,
      paymentStatus: "belum_dibayar",
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Sync to Supabase orders table
    supabase.from("orders").insert(mapOrderToDb(newOrder)).then();

    addNotification(
      "Pesanan Dibuat",
      `Pesanan nomor ${orderNumber} berhasil dikirim ke petugas kantin.`,
      "order_created"
    );

    return { success: true, order: newOrder };
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return { ...o, orderStatus: newStatus };
        }
        return o;
      })
    );

    // Sync to Supabase
    supabase.from("orders").update({ order_status: newStatus }).eq("id", orderId).then();

    const statusLabels: Record<OrderStatus, string> = {
      menunggu_konfirmasi: "Menunggu Konfirmasi",
      sedang_disiapkan: "Sedang Disiapkan",
      siap_diambil: "Siap Diambil di Kantin",
      dalam_pengantaran: "Dalam Pengantaran",
      selesai: "Selesai",
      dibatalkan: "Dibatalkan",
    };

    addNotification(
      "Status Pesanan Berubah",
      `Pesanan ${orderId} kini berstatus: ${statusLabels[newStatus]}.`,
      "status_changed"
    );
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) {
      return { success: false, error: "Pesanan tidak ditemukan." };
    }

    // Cancellation is strictly allowed only before preparation starts (PRD 7.6)
    if (targetOrder.orderStatus !== "menunggu_konfirmasi") {
      return {
        success: false,
        error: "Pesanan tidak dapat dibatalkan karena sudah mulai disiapkan oleh petugas.",
      };
    }

    // Restore stock for all items and sync to Supabase (Finding 8)
    setMenu((prev) =>
      prev.map((m) => {
        const itemInOrder = targetOrder.items.find((i) => i.menuId === m.id);
        if (itemInOrder) {
          const restoredStock = m.stock + itemInOrder.quantity;
          supabase.from("menu").update({ stock: restoredStock }).eq("id", m.id).then();
          return { ...m, stock: restoredStock };
        }
        return m;
      })
    );

    // Update order status and refund simulation if QRIS was already paid
    const needsRefundSim = targetOrder.paymentStatus === "berhasil_disimulasikan";
    const nextPaymentStatus = needsRefundSim ? "refund_disimulasikan" : targetOrder.paymentStatus;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            orderStatus: "dibatalkan",
            paymentStatus: nextPaymentStatus,
            cancellationReason: reason,
          };
        }
        return o;
      })
    );

    // Sync cancellation to Supabase orders table (Finding 9 & rejection reason)
    supabase
      .from("orders")
      .update({
        order_status: "dibatalkan",
        payment_status: nextPaymentStatus,
        cancellation_reason: reason || null,
      })
      .eq("id", orderId)
      .then();

    const notifMsg = reason
      ? `Pesanan ${orderId} telah dibatalkan (${reason}) dan stok makanan berhasil dipulihkan.`
      : `Pesanan ${orderId} telah dibatalkan dan stok makanan berhasil dipulihkan.`;

    addNotification("Pesanan Dibatalkan", notifMsg, "order_cancelled");

    return { success: true };
  };

  const confirmCashPayment = (orderId: string) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            paymentStatus: "lunas",
            paymentConfirmedAt: now,
          };
        }
        return o;
      })
    );
    supabase.from("orders").update({ payment_status: "lunas", payment_confirmed_at: now }).eq("id", orderId).then();
    addNotification(
      "Pembayaran Dikonfirmasi",
      `Pembayaran tunai untuk pesanan ${orderId} telah ditandai lunas oleh petugas.`,
      "payment_confirmed"
    );
  };

  const simulateQrisPayment = (orderId: string) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            paymentStatus: "berhasil_disimulasikan",
            paymentConfirmedAt: now,
          };
        }
        return o;
      })
    );
    supabase.from("orders").update({ payment_status: "berhasil_disimulasikan", payment_confirmed_at: now }).eq("id", orderId).then();
    addNotification(
      "Simulasi QRIS Berhasil",
      `Pembayaran simulasi QRIS untuk pesanan ${orderId} berhasil dikonfirmasi.`,
      "payment_confirmed"
    );
  };

  // Canteen Settings & Reset Demo
  const updateSettings = (updates: Partial<CanteenSettings>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    supabase
      .from("canteen_settings")
      .upsert({
        id: "default",
        canteen_name: updated.canteenName,
        delivery_fee: updated.deliveryFee,
        is_service_active: updated.isServiceActive,
      })
      .then();
    addNotification("Pengaturan Disimpan", "Pengaturan operasional kantin berhasil diperbarui.", "status_changed");
  };

  const resetDemoData = () => {
    setMenu(INITIAL_MENU_ITEMS);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    setSettings(INITIAL_CANTEEN_SETTINGS);
    setProfile(INITIAL_USER_PROFILE);
    try {
      localStorage.removeItem(STORAGE_KEYS.MENU);
      localStorage.removeItem(STORAGE_KEYS.ORDERS);
      localStorage.removeItem(STORAGE_KEYS.CART);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
    } catch {}

    // Reset and sync cloud database in Supabase (Finding 11)
    supabase
      .from("orders")
      .delete()
      .neq("id", "")
      .then(() => {
        // Restore initial menu stock and status in Supabase
        INITIAL_MENU_ITEMS.forEach((item) => {
          supabase
            .from("menu")
            .update({ stock: item.stock, is_active: item.isActive })
            .eq("id", item.id)
            .then();
        });
      });

    addNotification(
      "Data Demo Direset",
      "Seluruh menu, stok, pesanan contoh, dan pengaturan dikembalikan ke data awal.",
      "status_changed"
    );
  };

  const restoreDailyStock = () => {
    setMenu((prev) =>
      prev.map((m) => {
        const initial = INITIAL_MENU_ITEMS.find((it) => it.id === m.id);
        const targetStock = m.dailyQuota ?? (initial ? initial.stock : 25);
        supabase.from("menu").update({ stock: targetStock }).eq("id", m.id).then();
        return { ...m, stock: targetStock };
      })
    );
    showToast(
      "Stok Harian Dipulihkan 🌅",
      "Seluruh kuota menu kantin pagi hari berhasil diisi ulang.",
      "success"
    );
    addNotification(
      "Stok Harian Dipulihkan",
      "Seluruh kuota porsi harian menu kantin berhasil diisi ulang.",
      "status_changed"
    );
  };

  return (
    <AppContext.Provider
      value={{
        isHydrated,
        isCloudConnected,
        theme,
        toggleTheme,
        profile,
        setProfile,
        switchRole,
        updateProfileName,
        menu,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        updateStock,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartItemCount,
        orders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        confirmCashPayment,
        simulateQrisPayment,
        settings,
        updateSettings,
        resetDemoData,
        restoreDailyStock,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        toasts,
        showToast,
        removeToast,
        activeTab,
        setActiveTab,
        selectedOrderId,
        setSelectedOrderId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

// Utility currency formatter
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
